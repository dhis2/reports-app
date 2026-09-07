import { useConfig, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    NoticeBox,
    OrganisationUnitTree,
    Radio,
    SegmentedControl,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RailToggleIcon } from '../../components/shell/RailToggleIcon.jsx'
import { ReportBreadcrumb } from '../../components/shell/ReportBreadcrumb.jsx'
import { ReportEmptyState } from '../../components/shell/ReportEmptyState.jsx'
import { DATA_SET_REPORT_NEXT_SECTION_KEY } from '../../config/sections.config.js'
import { fixedPeriodTranslations } from '../../utils/periods/fixedPeriods.js'
import { CustomFormReport } from './CustomFormReport.jsx'
import styles from './DataSetReportNext.module.css'
import { FormView } from './form-view/index.js'
import {
    canReportAtPeriodType,
    dropUnopenedPeriods,
    generatePeriods,
    needsYear,
    newestEndedPeriod,
    supportsPeriodType,
    yearOptions,
} from './periods.js'
import {
    DATA_SETS_QUERY,
    DIMENSIONS_QUERY,
    GROUP_SETS_QUERY,
    ORG_UNIT_NAME_QUERY,
    ORG_UNIT_ROOTS_QUERY,
    REPORT_QUERY,
    downloadUrls,
    fetchCustomForm,
    filtersToParams,
    idFromPath,
} from './queries.js'
import { addRecentReport, readRecentReports } from './recentReports.js'
import { RecentReports } from './RecentReports.jsx'
import { countValues, ReportTables, transformTables } from './ReportTables.jsx'
import { emptySelection, useReportSelection } from './useReportSelection.js'

const CUSTOM_FORM = 'CUSTOM'

/*
 * The period types this page can actually offer, taken from the app's own
 * translation map rather than a hand-written list, minus the ones d2 ships no
 * period generator for — see periods.js. Choosing one of those could only
 * ever produce an empty period list, so it is not offered at all.
 *
 * `selected` must always have a matching option here, so a data set using an
 * unsupported type leaves the field empty rather than throwing — see
 * safeSelected.
 */
const PERIOD_TYPE_OPTIONS = Object.entries(fixedPeriodTranslations)
    .filter(([id]) => supportsPeriodType(id))
    .map(([id, displayName]) => ({ id, displayName }))

/*
 * SingleSelectField throws if `selected` is not among its options, and the
 * options for the data set, the periods and the filters all arrive
 * asynchronously — while a value restored from the URL or from local storage
 * is present on the very first render. So never hand it a value it cannot
 * match; show nothing until the matching option exists.
 */
const safeSelected = (options, value) =>
    value && options.some((option) => option.id === value) ? value : ''

/*
 * Whether the options rail is collapsed is a per-viewer preference, not part
 * of what the report is — so it is remembered locally and deliberately kept
 * out of the URL, which stays a description of the report itself.
 */
const RAIL_STORAGE_KEY = 'reports-app:data-set-report-next:rail-collapsed'

const readRailCollapsed = () => {
    try {
        return window.localStorage.getItem(RAIL_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

const writeRailCollapsed = (collapsed) => {
    try {
        window.localStorage.setItem(RAIL_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {
        // A remembered preference is a convenience, never worth an error.
    }
}

/*
 * The two ways to read the same report.
 *
 * STANDARD is the summary grid this page has always shown. FORM is the data
 * set drawn the way data entry draws it, which is what people asking for this
 * actually mean when they say they want to see "the form".
 *
 * Which one you prefer is a habit, not a property of the report, so it is
 * remembered locally and stays out of the URL for the same reason the rail
 * state does.
 */
const VIEW_MODES = {
    STANDARD: 'STANDARD',
    FORM: 'FORM',
}

const VIEW_STORAGE_KEY = 'reports-app:data-set-report-next:view-mode'

/*
 * Standard is the default: it is what the page does today, so nobody's
 * existing habit changes underneath them. The control is right above the
 * report, so anyone who wants Form finds it once and then it sticks.
 */
const readViewMode = () => {
    try {
        return window.localStorage.getItem(VIEW_STORAGE_KEY) === VIEW_MODES.FORM
            ? VIEW_MODES.FORM
            : VIEW_MODES.STANDARD
    } catch {
        return VIEW_MODES.STANDARD
    }
}

const writeViewMode = (mode) => {
    try {
        window.localStorage.setItem(VIEW_STORAGE_KEY, mode)
    } catch {
        // A remembered preference is a convenience, never worth an error.
    }
}

/*
 * When the report was built. Short and numeric — it is a timestamp on a
 * summary line, not a date anyone reads out. The locale decides the order of
 * the parts, so this never hard-codes day-before-month.
 */
const createdLabel = (generatedAt) =>
    i18n.t('Report created {{when}}', {
        when: generatedAt.toLocaleString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }),
        /*
         * i18next HTML-escapes interpolated values by default, which turns the
         * slashes of a numeric date into &#x2F;. React escapes on render
         * anyway, so escaping here only ever double-escapes.
         */
        interpolation: { escapeValue: false },
    })

/*
 * How often this data set is collected, as a whole sentence rather than the
 * bare period type. Written out per type instead of interpolating the period
 * name, because "Data collected {{Bi-Monthly}}" does not read as English and
 * would not survive translation into languages that inflect it.
 *
 * The form type used to sit here too. It describes how the entry screen is
 * drawn, which is the data entry clerk's concern — someone reading a report
 * cannot act on it.
 */
const cadenceLabel = (periodType) => {
    switch (periodType) {
        case 'Daily':
            return i18n.t('Data collected daily')
        case 'Weekly':
        case 'WeeklyWednesday':
        case 'WeeklyThursday':
        case 'WeeklySaturday':
        case 'WeeklySunday':
            return i18n.t('Data collected weekly')
        case 'BiWeekly':
            return i18n.t('Data collected every two weeks')
        case 'Monthly':
            return i18n.t('Data collected monthly')
        case 'BiMonthly':
            return i18n.t('Data collected every two months')
        case 'Quarterly':
        case 'QuarterlyNov':
            return i18n.t('Data collected quarterly')
        case 'SixMonthly':
        case 'SixMonthlyApril':
        case 'SixMonthlyNov':
            return i18n.t('Data collected twice a year')
        case 'Yearly':
        case 'FinancialApril':
        case 'FinancialJuly':
        case 'FinancialOct':
        case 'FinancialNov':
            return i18n.t('Data collected yearly')
        default:
            return periodType
    }
}

/*
 * One optional filter. Both sources — data set dimensions and org unit group
 * sets — reduce to the same {id, label, options} shape, so they render the
 * same way; only where they sit in the form differs.
 */
const FilterSelect = ({ field, value, onChange }) => (
    <SingleSelectField
        clearable
        dense
        label={field.label}
        placeholder={i18n.t('Any')}
        selected={safeSelected(field.options, value)}
        onChange={({ selected }) => onChange(field.id, selected)}
    >
        {field.options.map((option) => (
            <SingleSelectOption
                key={option.id}
                value={option.id}
                label={option.displayName}
            />
        ))}
    </SingleSelectField>
)

FilterSelect.propTypes = {
    field: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
}

export const DataSetReportNext = () => {
    const { baseUrl } = useConfig()
    const engine = useDataEngine()
    const { selection, update, reset, remember } = useReportSelection()

    const dataSetsQuery = useDataQuery(DATA_SETS_QUERY)
    const rootsQuery = useDataQuery(ORG_UNIT_ROOTS_QUERY)
    const groupSetsQuery = useDataQuery(GROUP_SETS_QUERY)
    const dimensionsQuery = useDataQuery(DIMENSIONS_QUERY, {
        lazy: true,
        variables: { dataSetId: selection.dsId },
    })

    const [report, setReport] = useState(null)
    const [reportLoading, setReportLoading] = useState(false)
    const [reportError, setReportError] = useState(null)
    const [groupSetsOpen, setGroupSetsOpen] = useState(false)
    const [ouName, setOuName] = useState('')
    const [railCollapsed, setRailCollapsed] = useState(readRailCollapsed)
    const [viewMode, setViewMode] = useState(readViewMode)
    const [recent, setRecent] = useState(readRecentReports)
    /* A recent report picked from the empty state, waiting on its options. */
    const [pendingRun, setPendingRun] = useState(false)

    const onChangeViewMode = ({ value }) => {
        setViewMode(value)
        writeViewMode(value)
    }

    const toggleRail = () => {
        setRailCollapsed((collapsed) => {
            writeRailCollapsed(!collapsed)
            return !collapsed
        })
    }

    const dataSets = dataSetsQuery.data?.dataSets?.dataSets || []
    const dataSet = useMemo(
        () => dataSets.find((candidate) => candidate.id === selection.dsId),
        [dataSets, selection.dsId]
    )

    const roots = useMemo(() => {
        const me = rootsQuery.data?.me
        if (!me) {
            return []
        }

        const preferred = me.dataViewOrganisationUnits?.length
            ? me.dataViewOrganisationUnits
            : me.organisationUnits || []

        return preferred.map((orgUnit) => orgUnit.id)
    }, [rootsQuery.data])

    const dimensions = dimensionsQuery.data?.dimensions?.dimensions || []
    const groupSets =
        groupSetsQuery.data?.groupSets?.organisationUnitGroupSets || []

    /*
     * The two filter sources stay apart, because they answer to different
     * selections. Data set dimensions come from the chosen data set and sit
     * under it; group sets slice the org unit hierarchy and sit under the
     * tree. Pooling them into one "optional filters" bucket, as an earlier
     * pass did, detaches each one from the choice that gives it meaning.
     */
    const dimensionFields = useMemo(
        () =>
            dimensions.map((dimension) => ({
                id: dimension.id,
                label: dimension.displayName,
                options: dimension.items || [],
            })),
        [dimensions]
    )

    const groupSetFields = useMemo(
        () =>
            groupSets.map((groupSet) => ({
                id: groupSet.id,
                label: groupSet.displayName,
                options: groupSet.organisationUnitGroups || [],
            })),
        [groupSets]
    )

    /* Both sources together, for the filter chips and the pruning below. */
    const filterFields = useMemo(
        () => [...dimensionFields, ...groupSetFields],
        [dimensionFields, groupSetFields]
    )

    const activeFilters = useMemo(
        () =>
            filterFields
                .map((field) => {
                    const optionId = selection.filters[field.id]
                    if (!optionId) {
                        return null
                    }
                    const option = field.options.find(
                        (candidate) => candidate.id === optionId
                    )
                    return {
                        label: field.label,
                        value: option?.displayName || optionId,
                    }
                })
                .filter(Boolean),
        [filterFields, selection.filters]
    )

    /*
     * Only the group set filters count here: the badge belongs to the
     * collapsed area, so it must not report filters set elsewhere.
     */
    const groupSetFilterCount = useMemo(
        () =>
            groupSetFields.filter((field) => selection.filters[field.id])
                .length,
        [groupSetFields, selection.filters]
    )

    /*
     * A filter restored from a link or from local storage would otherwise sit
     * inside a shut area, shaping the report with only a badge to show for
     * it. Opening on a non-zero count is a no-op once the area is already
     * open, so this does not fight the user closing it again.
     */
    useEffect(() => {
        if (groupSetFilterCount > 0) {
            setGroupSetsOpen(true)
        }
    }, [groupSetFilterCount])

    const onFilterChange = useCallback(
        (fieldId, optionId) =>
            update({
                filters: { ...selection.filters, [fieldId]: optionId },
            }),
        [selection.filters, update]
    )

    const periodType = selection.periodType
    const periods = useMemo(() => {
        if (!periodType || !supportsPeriodType(periodType)) {
            return []
        }

        return dropUnopenedPeriods(
            generatePeriods(periodType, selection.year),
            dataSet?.openFuturePeriods ?? 0
        )
    }, [periodType, selection.year, dataSet])

    /*
     * A link may name a data set that has been deleted, or that this user
     * cannot see. Guarding the select stops the crash but leaves the id in
     * state, so Get report would still ask the server for it. Clear it once
     * the list has loaded and we know it is not there.
     */
    useEffect(() => {
        if (
            dataSetsQuery.loading ||
            !dataSets.length ||
            !selection.dsId ||
            dataSet
        ) {
            return
        }

        update({ dsId: '', periodType: '', pe: '' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSetsQuery.loading, dataSets.length, selection.dsId, dataSet])

    /*
     * A deep link can carry a year outside the default range, so union it in
     * rather than dropping the user back to this year.
     */
    const yearChoices = useMemo(() => {
        const years = new Set(yearOptions().map(String))
        if (selection.year) {
            years.add(String(selection.year))
        }

        return [...years]
            .sort((a, b) => Number(b) - Number(a))
            .map((year) => ({ id: year, displayName: year }))
    }, [selection.year])

    /*
     * Drop filters that do not belong to the current data set.
     *
     * A filter restored from a link or from local storage may name a dimension
     * the newly chosen data set does not have. Hiding it would not be enough:
     * it would still be sent as a `filter=` parameter, so the report would be
     * quietly narrowed with nothing on screen saying so.
     *
     * Only runs once both option sources have settled, otherwise it would wipe
     * perfectly good filters while they are still loading.
     */
    const filterFieldIds = useMemo(
        () => filterFields.map((field) => field.id).join(','),
        [filterFields]
    )
    useEffect(() => {
        const optionsSettled =
            !groupSetsQuery.loading &&
            !dimensionsQuery.loading &&
            (dimensionsQuery.data || dimensionsQuery.error)

        if (!selection.dsId || !optionsSettled) {
            return
        }

        const known = new Set(filterFieldIds ? filterFieldIds.split(',') : [])
        const applicable = Object.keys(selection.filters).filter((id) =>
            known.has(id)
        )

        if (applicable.length === Object.keys(selection.filters).length) {
            return
        }

        update({
            filters: applicable.reduce((filters, id) => {
                filters[id] = selection.filters[id]
                return filters
            }, {}),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filterFieldIds,
        selection.dsId,
        selection.filters,
        groupSetsQuery.loading,
        dimensionsQuery.loading,
    ])

    /*
     * Adopt the data set's own period type and preselect the newest finished
     * period. This is the one change that needs a real API field
     * (`periodType`), and it removes the commonest cause of an empty report.
     */
    const lastDataSetId = useRef(selection.dsId)
    useEffect(() => {
        if (!dataSet) {
            return
        }

        const sameDataSet = lastDataSetId.current === selection.dsId
        if (sameDataSet && selection.periodType) {
            return
        }

        lastDataSetId.current = selection.dsId

        const candidates = dropUnopenedPeriods(
            generatePeriods(dataSet.periodType, selection.year),
            dataSet.openFuturePeriods ?? 0
        )
        const newest = newestEndedPeriod(candidates)

        update({
            periodType: dataSet.periodType,
            pe: newest ? newest.id : '',
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSet, selection.dsId])

    /*
     * Picking a recent report refills the rail with what it asked for. The
     * data set ref is moved along with it, so the effect above does not treat
     * this as "new data set" and replace the period we just restored.
     */
    const onSelectRecent = useCallback(
        (entry) => {
            lastDataSetId.current = entry.dsId
            setOuName(entry.orgUnitName || '')
            setPendingRun(true)
            update({
                dsId: entry.dsId,
                periodType: entry.periodType,
                year: Number(entry.pe?.slice(0, 4)) || emptySelection.year,
                pe: entry.pe,
                ouPath: entry.ouPath,
                selectedUnitOnly: Boolean(entry.selectedUnitOnly),
                filters: entry.filters || {},
            })
        },
        [update]
    )

    /* Dimensions belong to a data set, so reload them when it changes. */
    useEffect(() => {
        if (selection.dsId) {
            dimensionsQuery.refetch({ dataSetId: selection.dsId })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection.dsId])

    /*
     * A restored URL gives us a path but no name, and the summary strip needs
     * the name. Clicking the tree fills it in without waiting for this.
     */
    useEffect(() => {
        const id = idFromPath(selection.ouPath)
        if (!id) {
            setOuName('')
            return undefined
        }

        let cancelled = false
        engine
            .query(ORG_UNIT_NAME_QUERY, { variables: { id } })
            .then((response) => {
                if (!cancelled) {
                    setOuName(response?.orgUnit?.displayName || id)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setOuName(id)
                }
            })

        return () => {
            cancelled = true
        }
    }, [selection.ouPath, engine])

    const periodName = useMemo(() => {
        const match = periods.find((period) => period.id === selection.pe)
        return match ? match.name : selection.pe
    }, [periods, selection.pe])

    const orgUnitId = idFromPath(selection.ouPath)
    const canGenerate = Boolean(
        selection.dsId && selection.pe && orgUnitId && !reportLoading
    )

    const onGenerate = useCallback(
        async (event) => {
            event?.preventDefault()

            if (!canGenerate || !dataSet) {
                return
            }

            const request = {
                ds: selection.dsId,
                pe: selection.pe,
                ou: orgUnitId,
                selectedUnitOnly: selection.selectedUnitOnly,
                filters: selection.filters,
            }

            const snapshot = {
                ds: request.ds,
                pe: request.pe,
                ou: request.ou,
                selectedUnitOnly: request.selectedUnitOnly,
                /* the map the request was built from, for downloads and staleness */
                rawFilters: request.filters,
                /* the readable version, for the summary and the printout */
                filterLabels: activeFilters,
                dataSetName: dataSet.displayName,
                periodName,
                orgUnitName: ouName || orgUnitId,
                generatedAt: new Date(),
            }

            setReportLoading(true)
            setReportError(null)
            remember(selection)
            setRecent(
                addRecentReport({
                    dsId: selection.dsId,
                    dataSetName: snapshot.dataSetName,
                    periodType: selection.periodType,
                    pe: selection.pe,
                    periodName: snapshot.periodName,
                    ouPath: selection.ouPath,
                    orgUnitName: snapshot.orgUnitName,
                    selectedUnitOnly: selection.selectedUnitOnly,
                    filters: selection.filters,
                })
            )

            try {
                const queryGrids = () =>
                    engine.query(REPORT_QUERY, {
                        variables: {
                            ds: request.ds,
                            pe: request.pe,
                            ou: request.ou,
                            selectedUnitOnly: request.selectedUnitOnly,
                            filter: filtersToParams(request.filters),
                        },
                    })

                if (dataSet.formType === CUSTOM_FORM) {
                    /*
                     * Both shapes are fetched for a custom form, because both
                     * views are offered for it: Standard reads the grids, Form
                     * shows the server-rendered HTML. Fetching them together
                     * costs one extra request per report and buys a toggle
                     * that never waits.
                     */
                    const [html, response] = await Promise.all([
                        fetchCustomForm(baseUrl, request),
                        queryGrids(),
                    ])

                    setReport({
                        kind: 'custom',
                        html,
                        grids: response?.report,
                        tables: transformTables(response?.report),
                        snapshot,
                    })
                } else {
                    const response = await queryGrids()
                    /*
                     * The endpoint returns the tables as a top-level array.
                     * The legacy page wraps it as `{ data, fileUrls }` before
                     * storing it, which is where the extra `.data` in earlier
                     * versions of this line came from — there is no such key
                     * on the response itself.
                     */
                    setReport({
                        kind: 'tables',
                        /* the raw grids, which Form view matches against */
                        grids: response?.report,
                        tables: transformTables(response?.report),
                        snapshot,
                    })
                }
            } catch (error) {
                setReport(null)
                setReportError(error)
            } finally {
                setReportLoading(false)
            }
        },
        [
            activeFilters,
            baseUrl,
            canGenerate,
            dataSet,
            engine,
            orgUnitId,
            ouName,
            periodName,
            remember,
            selection,
        ]
    )

    /*
     * The data set has to be loaded before a report can be built, so a click
     * on a recent report arms the run and this fires it once everything the
     * request needs has arrived.
     */
    useEffect(() => {
        if (pendingRun && canGenerate && dataSet?.id === selection.dsId) {
            setPendingRun(false)
            onGenerate()
        }
    }, [pendingRun, canGenerate, dataSet, selection.dsId, onGenerate])

    /*
     * Stale detection: the report on screen no longer matches the form. The
     * current page has no equivalent — it just leaves the old tables sitting
     * there looking current.
     */
    const isStale = useMemo(() => {
        if (!report) {
            return false
        }

        const { snapshot } = report
        return (
            snapshot.ds !== selection.dsId ||
            snapshot.pe !== selection.pe ||
            snapshot.ou !== orgUnitId ||
            snapshot.selectedUnitOnly !== selection.selectedUnitOnly ||
            filtersToParams(snapshot.rawFilters).sort().join() !==
                filtersToParams(selection.filters).sort().join()
        )
    }, [report, selection, orgUnitId])

    const onClear = () => {
        reset()
        setReport(null)
        setReportError(null)
        lastDataSetId.current = ''
    }

    const downloads = report
        ? downloadUrls(baseUrl, {
              ds: report.snapshot.ds,
              pe: report.snapshot.pe,
              ou: report.snapshot.ou,
              selectedUnitOnly: report.snapshot.selectedUnitOnly,
              filters: report.snapshot.rawFilters,
          })
        : []

    /*
     * Grids are now fetched for custom-form data sets too, so this is no
     * longer conditional on the report kind — a custom form has a Standard
     * view like any other data set.
     */
    const valueCount = report?.tables ? countValues(report.tables) : null

    const isStandardView = viewMode === VIEW_MODES.STANDARD

    return (
        <div className={styles.page}>
            {/* ---------------- top bar ---------------- */}
            <header className={styles.topbar}>
                {/*
                 * Where you are: the trail back to the report list.
                 */}
                <ReportBreadcrumb
                    currentSection={DATA_SET_REPORT_NEXT_SECTION_KEY}
                />

                {/*
                 * What you can do with what is on screen. The report's own
                 * title is not repeated here — it heads the report itself.
                 */}
                {report && (
                    <div className={styles.topbarActions}>
                        <Button small onClick={() => window.print()}>
                            {i18n.t('Print')}
                        </Button>
                        {downloads.length > 0 && (
                            <DropdownButton
                                small
                                component={
                                    <FlyoutMenu>
                                        {downloads.map((file) => (
                                            <MenuItem
                                                key={file.extension}
                                                label={i18n.t('{{ext}}', {
                                                    ext: file.extension.toUpperCase(),
                                                })}
                                                href={file.url}
                                                target={
                                                    file.extension === 'pdf'
                                                        ? '_blank'
                                                        : '_self'
                                                }
                                            />
                                        ))}
                                    </FlyoutMenu>
                                }
                            >
                                {i18n.t('Download...')}
                            </DropdownButton>
                        )}
                    </div>
                )}
            </header>

            <div
                className={`${styles.work} ${
                    railCollapsed ? styles.workRailCollapsed : ''
                }`}
            >
                {/* ---------------- filter rail ---------------- */}
                <aside
                    className={`${styles.rail} ${
                        railCollapsed ? styles.railCollapsed : ''
                    }`}
                >
                    {/*
                     * The panel says what it is, and carries the control that
                     * puts it away. The rule under it runs the full width of
                     * the rail, so the header reads as the panel's own bar
                     * rather than as a first row of options.
                     */}
                    <div className={styles.railHeader}>
                        <h2 className={styles.railTitle}>
                            {i18n.t('Configure report')}
                        </h2>
                        <button
                            type="button"
                            className={styles.railToggle}
                            onClick={toggleRail}
                            aria-expanded={!railCollapsed}
                            aria-controls="report-options"
                            title={
                                railCollapsed
                                    ? i18n.t('Show report options')
                                    : i18n.t('Hide report options')
                            }
                        >
                            <RailToggleIcon collapsed={railCollapsed} />
                            <span className={styles.visuallyHidden}>
                                {railCollapsed
                                    ? i18n.t('Show report options')
                                    : i18n.t('Hide report options')}
                            </span>
                        </button>
                    </div>

                    <form
                        id="report-options"
                        className={styles.railForm}
                        onSubmit={onGenerate}
                    >
                        <div className={styles.railScroll}>
                            <div className={styles.railFields}>
                                {/*
                                 * Three groups — where, which data, when.
                                 * Each is one question with its own follow-ups
                                 * hanging off it, so the gap inside a group is
                                 * tighter than the space between groups, and a
                                 * rule marks where one question ends.
                                 */}
                                <section className={styles.group}>
                                    <h3 className={styles.groupTitle}>
                                        {i18n.t('Organisation unit')}
                                    </h3>
                                    <div className={styles.treeCard}>
                                        <div className={styles.treeBox}>
                                            {rootsQuery.loading && (
                                                <CircularLoader small />
                                            )}
                                            {rootsQuery.error && (
                                                <NoticeBox error>
                                                    {i18n.t(
                                                        'Could not load organisation units.'
                                                    )}
                                                </NoticeBox>
                                            )}
                                            {!rootsQuery.loading &&
                                                roots.length > 0 && (
                                                    <OrganisationUnitTree
                                                        roots={roots}
                                                        singleSelection
                                                        selected={
                                                            selection.ouPath
                                                                ? [
                                                                      selection.ouPath,
                                                                  ]
                                                                : []
                                                        }
                                                        initiallyExpanded={roots.map(
                                                            (id) => `/${id}`
                                                        )}
                                                        onChange={({
                                                            path,
                                                            displayName,
                                                        }) => {
                                                            setOuName(
                                                                displayName
                                                            )
                                                            update({
                                                                ouPath: path,
                                                            })
                                                        }}
                                                    />
                                                )}
                                        </div>

                                        {/*
                                         * Tacked onto the bottom of the tree
                                         * rather than standing as a field of
                                         * its own. It is not a separate thing
                                         * to decide — it is how far down the
                                         * hierarchy the unit you just picked
                                         * reaches, so it belongs to the tree.
                                         */}
                                        <fieldset className={styles.treeFooter}>
                                            <legend className={styles.srOnly}>
                                                {i18n.t('Selection mode')}
                                            </legend>
                                            <Radio
                                                dense
                                                name="scope"
                                                label={i18n.t(
                                                    'Include units inside'
                                                )}
                                                checked={
                                                    !selection.selectedUnitOnly
                                                }
                                                onChange={() =>
                                                    update({
                                                        selectedUnitOnly: false,
                                                    })
                                                }
                                            />
                                            <Radio
                                                dense
                                                name="scope"
                                                label={i18n.t('Selection only')}
                                                checked={
                                                    selection.selectedUnitOnly
                                                }
                                                onChange={() =>
                                                    update({
                                                        selectedUnitOnly: true,
                                                    })
                                                }
                                            />
                                        </fieldset>
                                    </div>

                                    {/*
                                     * Group sets slice the hierarchy, so they stay
                                     * with the tree above rather than becoming a
                                     * separate kind of choice — but they are a
                                     * narrowing most reports never need, so the
                                     * area is shut until asked for. The count on
                                     * the button is what keeps a collapsed filter
                                     * from silently shaping the report. Group sets
                                     * with no groups are dropped server-side; see
                                     * GROUP_SETS_QUERY.
                                     */}
                                    {groupSetFields.length > 0 && (
                                        <div className={styles.disclosure}>
                                            <button
                                                type="button"
                                                className={
                                                    styles.disclosureButton
                                                }
                                                aria-expanded={groupSetsOpen}
                                                onClick={() =>
                                                    setGroupSetsOpen(
                                                        !groupSetsOpen
                                                    )
                                                }
                                            >
                                                <svg
                                                    className={
                                                        styles.disclosureChevron
                                                    }
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                >
                                                    <path
                                                        d="M6 3.5 10.5 8 6 12.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.75"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span
                                                    className={
                                                        styles.disclosureLabel
                                                    }
                                                >
                                                    {i18n.t(
                                                        'Filter by org. unit group'
                                                    )}
                                                </span>
                                                {/*
                                                 * Only when closed — open, the
                                                 * fields themselves already show
                                                 * what is set, so the badge is
                                                 * just a second copy of it.
                                                 */}
                                                {!groupSetsOpen &&
                                                    groupSetFilterCount > 0 && (
                                                        <span
                                                            className={
                                                                styles.countBadge
                                                            }
                                                        >
                                                            {
                                                                groupSetFilterCount
                                                            }
                                                        </span>
                                                    )}
                                            </button>

                                            {groupSetsOpen && (
                                                <div
                                                    className={
                                                        styles.disclosureBody
                                                    }
                                                >
                                                    {groupSetFields.map(
                                                        (field) => (
                                                            <FilterSelect
                                                                key={field.id}
                                                                field={field}
                                                                value={
                                                                    selection
                                                                        .filters[
                                                                        field.id
                                                                    ]
                                                                }
                                                                onChange={
                                                                    onFilterChange
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>

                                <section className={styles.group}>
                                    <h3 className={styles.groupTitle}>
                                        {i18n.t('Data set')}
                                    </h3>
                                    <SingleSelectField
                                        filterable
                                        noMatchText={i18n.t(
                                            'No data set found'
                                        )}
                                        /* The group title above is this field's label. */
                                        aria-label={i18n.t('Data set')}
                                        placeholder={i18n.t(
                                            'Choose a data set'
                                        )}
                                        loading={dataSetsQuery.loading}
                                        selected={safeSelected(
                                            dataSets,
                                            selection.dsId
                                        )}
                                        onChange={({ selected }) =>
                                            update({ dsId: selected })
                                        }
                                    >
                                        {dataSets.map((candidate) => (
                                            <SingleSelectOption
                                                key={candidate.id}
                                                value={candidate.id}
                                                label={candidate.displayName}
                                            />
                                        ))}
                                    </SingleSelectField>
                                    {dataSet && (
                                        <p className={styles.help}>
                                            {cadenceLabel(dataSet.periodType)}
                                        </p>
                                    )}

                                    {/*
                                     * Attribute dimensions belong to the data
                                     * set, so they appear with it and vanish
                                     * with it. There are rarely more than two.
                                     */}
                                    {dimensionFields.length > 0 && (
                                        <div className={styles.subFields}>
                                            {dimensionFields.map((field) => (
                                                <FilterSelect
                                                    key={field.id}
                                                    field={field}
                                                    value={
                                                        selection.filters[
                                                            field.id
                                                        ]
                                                    }
                                                    onChange={onFilterChange}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section className={styles.group}>
                                    <h3 className={styles.groupTitle}>
                                        {i18n.t('Period')}
                                    </h3>
                                    {/*
                                     * Types shorter than the data set's own
                                     * are shown but disabled: the data can be
                                     * added up into a longer period and never
                                     * split into a shorter one, so those can
                                     * only ever return an empty report.
                                     */}
                                    <SingleSelectField
                                        /* "Period" is the group title above. */
                                        label={i18n.t('Type')}
                                        placeholder={i18n.t('Choose a type')}
                                        selected={safeSelected(
                                            PERIOD_TYPE_OPTIONS,
                                            periodType
                                        )}
                                        onChange={({ selected }) =>
                                            update({
                                                periodType: selected,
                                                pe: '',
                                            })
                                        }
                                    >
                                        {PERIOD_TYPE_OPTIONS.map((type) => (
                                            <SingleSelectOption
                                                key={type.id}
                                                value={type.id}
                                                label={type.displayName}
                                                disabled={
                                                    !canReportAtPeriodType(
                                                        dataSet?.periodType,
                                                        type.id
                                                    )
                                                }
                                            />
                                        ))}
                                    </SingleSelectField>
                                    {needsYear(periodType) && (
                                        <SingleSelectField
                                            filterable
                                            noMatchText={i18n.t(
                                                'No year found'
                                            )}
                                            label={i18n.t('Year')}
                                            selected={safeSelected(
                                                yearChoices,
                                                String(selection.year)
                                            )}
                                            onChange={({ selected }) =>
                                                update({
                                                    year: Number(selected),
                                                    pe: '',
                                                })
                                            }
                                        >
                                            {yearChoices.map((year) => (
                                                <SingleSelectOption
                                                    key={year.id}
                                                    value={year.id}
                                                    label={year.displayName}
                                                />
                                            ))}
                                        </SingleSelectField>
                                    )}

                                    <SingleSelectField
                                        label={i18n.t('Period')}
                                        placeholder={i18n.t('Choose a period')}
                                        selected={safeSelected(
                                            periods,
                                            selection.pe
                                        )}
                                        disabled={periods.length === 0}
                                        onChange={({ selected }) =>
                                            update({ pe: selected })
                                        }
                                    >
                                        {periods.map((period) => (
                                            <SingleSelectOption
                                                key={period.id}
                                                value={period.id}
                                                label={period.name}
                                            />
                                        ))}
                                    </SingleSelectField>
                                </section>
                            </div>

                            {/*
                             * Sticky, not pinned: with a short form this sits
                             * right after the fields, wherever that lands. Only
                             * once the fields overflow and the rail scrolls
                             * does it stick to the bottom of the scroll area,
                             * so the button never needs to be scrolled to.
                             */}
                            <div className={styles.railActions}>
                                <Button
                                    primary
                                    type="submit"
                                    disabled={!canGenerate}
                                    loading={reportLoading}
                                >
                                    {i18n.t('Get report')}
                                </Button>
                                <Button
                                    secondary
                                    type="button"
                                    onClick={onClear}
                                >
                                    {i18n.t('Clear')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </aside>

                {/* ---------------- output ---------------- */}
                <div className={styles.outputPane}>
                    {/*
                     * Tagged onto the top of the output rather than announced
                     * inside it. Changing an option is the ordinary start of
                     * the next report, not a fault, so this labels what is on
                     * screen instead of raising an alert about it.
                     *
                     * It lives outside .output because .output is the scroll
                     * container, which clips anything hanging over its edge —
                     * and out here it also stays put while the report scrolls.
                     */}
                    {!reportLoading && report && isStale && (
                        <span className={styles.staleBadge}>
                            {i18n.t('Not updated with latest options')}
                            {/* The badge says what is wrong; this is the one
                             * thing you would do about it. */}
                            <button
                                type="button"
                                className={styles.staleAction}
                                onClick={onGenerate}
                                disabled={!canGenerate}
                            >
                                {i18n.t('Update')}
                            </button>
                        </span>
                    )}

                    <section className={styles.output}>
                        {reportError && (
                            <div className={styles.noticePad}>
                                <NoticeBox
                                    error
                                    title={i18n.t(
                                        'The report could not be built'
                                    )}
                                >
                                    {reportError.message}
                                </NoticeBox>
                            </div>
                        )}

                        {reportLoading && (
                            <div className={styles.loading}>
                                <CircularLoader small />
                                <p className={styles.loadingText}>
                                    {i18n.t('Generating report...')}
                                </p>
                            </div>
                        )}

                        {!reportLoading && !report && !reportError && (
                            <div>
                                <ReportEmptyState />
                                <RecentReports
                                    entries={recent}
                                    onSelect={onSelectRecent}
                                />
                            </div>
                        )}

                        {!reportLoading && report && (
                            <div
                                className={cx({
                                    [styles.staleOutput]: isStale,
                                })}
                            >
                                <div className={styles.summary}>
                                    <p className={styles.summaryLine}>
                                        {[
                                            report.snapshot.dataSetName,
                                            report.snapshot.periodName,
                                            report.snapshot.selectedUnitOnly
                                                ? report.snapshot.orgUnitName
                                                : i18n.t(
                                                      '{{orgUnit}} and units inside',
                                                      {
                                                          orgUnit:
                                                              report.snapshot
                                                                  .orgUnitName,
                                                      }
                                                  ),
                                            createdLabel(
                                                report.snapshot.generatedAt
                                            ),
                                        ].join(' \u00b7 ')}
                                    </p>

                                    {/*
                                     * Applied filters sit on their own line under
                                     * the summary, and travel onto the printout. A
                                     * filtered report that looks like a full one
                                     * gets filed as the facility total.
                                     */}
                                    {report.snapshot.filterLabels?.length >
                                        0 && (
                                        <p className={styles.filterLine}>
                                            {report.snapshot.filterLabels
                                                .map(
                                                    (filter) =>
                                                        `${filter.label}: ${filter.value}`
                                                )
                                                .join(' \u00b7 ')}
                                        </p>
                                    )}
                                </div>

                                {/*
                                 * The two views, and the options that belong to
                                 * whichever one is showing. This sits directly
                                 * above the report because it is about how the
                                 * report is drawn, not about what was asked for —
                                 * that is the summary strip above.
                                 */}
                                <div className={styles.toolbar}>
                                    <span className={styles.viewAsLabel}>
                                        {i18n.t('View as:')}
                                    </span>
                                    <SegmentedControl
                                        selected={viewMode}
                                        onChange={onChangeViewMode}
                                        options={[
                                            {
                                                label: i18n.t('Summary'),
                                                value: VIEW_MODES.STANDARD,
                                            },
                                            {
                                                label: i18n.t(
                                                    'Data entry form'
                                                ),
                                                value: VIEW_MODES.FORM,
                                            },
                                        ]}
                                    />
                                </div>

                                {/* ---------------- standard view ---------------- */}
                                {isStandardView && valueCount === 0 && (
                                    <div className={styles.noticePad}>
                                        <NoticeBox
                                            title={i18n.t(
                                                'No data for this selection'
                                            )}
                                        >
                                            {i18n.t(
                                                'Nothing was recorded for {{dataSet}} at {{orgUnit}} in {{period}}. The form may not be used here, or the data may not be entered yet.',
                                                {
                                                    dataSet:
                                                        report.snapshot
                                                            .dataSetName,
                                                    orgUnit:
                                                        report.snapshot
                                                            .orgUnitName,
                                                    period: report.snapshot
                                                        .periodName,
                                                }
                                            )}
                                            {report.snapshot.filterLabels
                                                ?.length > 0 &&
                                                ` ${i18n.t(
                                                    'Your filters may also be too narrow.'
                                                )}`}
                                        </NoticeBox>
                                    </div>
                                )}

                                {isStandardView && valueCount > 0 && (
                                    <div className={styles.reportBody}>
                                        <ReportTables tables={report.tables} />
                                    </div>
                                )}

                                {/* ---------------- form view ---------------- */}
                                {!isStandardView &&
                                    report.kind === 'custom' && (
                                        <div className={styles.reportBody}>
                                            <CustomFormReport
                                                html={report.html}
                                                baseUrl={baseUrl}
                                            />
                                        </div>
                                    )}

                                {!isStandardView &&
                                    report.kind !== 'custom' && (
                                        <div className={styles.reportBody}>
                                            <FormView
                                                dataSetId={report.snapshot.ds}
                                                grids={report.grids}
                                            />
                                        </div>
                                    )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default DataSetReportNext
