import { useConfig, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Card,
    CircularLoader,
    IconChevronLeft24,
    IconChevronRight24,
    NoticeBox,
    OrganisationUnitTree,
    Radio,
    SegmentedControl,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SectionSwitcher } from '../../components/shell/SectionSwitcher.jsx'
import { DATA_SET_REPORT_NEXT_SECTION_KEY } from '../../config/sections.config.js'
import { fixedPeriodTranslations } from '../../utils/periods/fixedPeriods.js'
import { CustomFormReport } from './CustomFormReport.jsx'
import styles from './DataSetReportNext.module.css'
import { FormView } from './form-view/index.js'
import {
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
import { countValues, ReportTables, transformTables } from './ReportTables.jsx'
import { useReportSelection } from './useReportSelection.js'

const CUSTOM_FORM = 'CUSTOM'

/*
 * Every period type the server can report, taken from the app's own
 * translation map rather than a hand-written list. A data set may use any of
 * them, and `selected` must always have a matching option — see safeSelected.
 */
const PERIOD_TYPE_OPTIONS = Object.entries(fixedPeriodTranslations).map(
    ([id, displayName]) => ({ id, displayName })
)

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

const formTypeLabel = (formType) => {
    switch (formType) {
        case 'CUSTOM':
            return i18n.t('custom form')
        case 'SECTION':
            return i18n.t('section form')
        default:
            return i18n.t('default form')
    }
}

export const DataSetReportNext = () => {
    const { baseUrl } = useConfig()
    const engine = useDataEngine()
    const { selection, update, reset, remember, restoredFromMemory } =
        useReportSelection()

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
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [ouName, setOuName] = useState('')
    const [railCollapsed, setRailCollapsed] = useState(readRailCollapsed)
    const [viewMode, setViewMode] = useState(readViewMode)

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

    /* Every optional filter, from both sources, in one shape. */
    const filterFields = useMemo(
        () => [
            ...dimensions.map((dimension) => ({
                id: dimension.id,
                label: dimension.displayName,
                options: dimension.items || [],
            })),
            ...groupSets.map((groupSet) => ({
                id: groupSet.id,
                label: groupSet.displayName,
                options: groupSet.organisationUnitGroups || [],
            })),
        ],
        [dimensions, groupSets]
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

    const periodTypeMismatch = Boolean(
        dataSet && periodType && dataSet.periodType !== periodType
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

    const filterCount = activeFilters.length
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
                     * Shown only while collapsed. The form below stays
                     * mounted and is hidden with CSS rather than unmounted,
                     * so the org unit tree keeps whatever the user had
                     * expanded.
                     */}
                    <button
                        type="button"
                        className={styles.railExpand}
                        onClick={toggleRail}
                        aria-expanded={false}
                        aria-controls="report-options"
                        title={i18n.t('Show report options')}
                    >
                        <IconChevronRight24 />
                        <span className={styles.visuallyHidden}>
                            {i18n.t('Show report options')}
                        </span>
                    </button>

                    {/*
                     * The section name lives here rather than as a page
                     * heading: it is also the control for switching section,
                     * so it earns its place at the top of the panel the page
                     * already has.
                     */}
                    <div className={styles.railHeader}>
                        <SectionSwitcher
                            currentSection={DATA_SET_REPORT_NEXT_SECTION_KEY}
                        />
                        <button
                            type="button"
                            className={styles.railCollapse}
                            onClick={toggleRail}
                            aria-expanded={true}
                            aria-controls="report-options"
                            title={i18n.t('Hide report options')}
                        >
                            <IconChevronLeft24 />
                            <span className={styles.visuallyHidden}>
                                {i18n.t('Hide report options')}
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
                                <div>
                                    <span className={styles.label}>
                                        {i18n.t('Organisation unit')}
                                    </span>
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
                                                            ? [selection.ouPath]
                                                            : []
                                                    }
                                                    initiallyExpanded={roots.map(
                                                        (id) => `/${id}`
                                                    )}
                                                    onChange={({
                                                        path,
                                                        displayName,
                                                    }) => {
                                                        setOuName(displayName)
                                                        update({ ouPath: path })
                                                    }}
                                                />
                                            )}
                                    </div>
                                </div>

                                <fieldset className={styles.scopeGroup}>
                                    <legend>{i18n.t('What to include')}</legend>
                                    <Radio
                                        dense
                                        name="scope"
                                        label={i18n.t(
                                            'Everything below this unit, added up'
                                        )}
                                        checked={!selection.selectedUnitOnly}
                                        onChange={() =>
                                            update({ selectedUnitOnly: false })
                                        }
                                    />
                                    <Radio
                                        dense
                                        name="scope"
                                        label={i18n.t(
                                            'Only data recorded at this unit'
                                        )}
                                        checked={selection.selectedUnitOnly}
                                        onChange={() =>
                                            update({ selectedUnitOnly: true })
                                        }
                                    />
                                </fieldset>

                                <div>
                                    <SingleSelectField
                                        filterable
                                        noMatchText={i18n.t(
                                            'No data set found'
                                        )}
                                        label={i18n.t('Data set')}
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
                                            {dataSet.periodType} ·{' '}
                                            {formTypeLabel(dataSet.formType)}
                                            {dataSet.formType === CUSTOM_FORM &&
                                                ` · ${i18n.t(
                                                    'rendered by the server'
                                                )}`}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <SingleSelectField
                                        label={i18n.t('Period type')}
                                        placeholder={i18n.t(
                                            'Choose a period type'
                                        )}
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
                                            />
                                        ))}
                                    </SingleSelectField>
                                    {periodTypeMismatch && (
                                        <p className={styles.warnHelp}>
                                            {i18n.t(
                                                '{{name}} is collected {{periodType}}. A {{chosen}} report may come back empty.',
                                                {
                                                    name: dataSet.displayName,
                                                    periodType:
                                                        dataSet.periodType.toLowerCase(),
                                                    chosen: periodType.toLowerCase(),
                                                }
                                            )}
                                        </p>
                                    )}
                                    {periodType &&
                                        !supportsPeriodType(periodType) && (
                                            <p className={styles.warnHelp}>
                                                {i18n.t(
                                                    'This prototype cannot build a period list for {{periodType}} yet.',
                                                    { periodType }
                                                )}
                                            </p>
                                        )}
                                </div>

                                {needsYear(periodType) && (
                                    <SingleSelectField
                                        filterable
                                        noMatchText={i18n.t('No year found')}
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

                                {filterFields.length > 0 && (
                                    <div className={styles.disclosure}>
                                        <button
                                            type="button"
                                            className={styles.disclosureButton}
                                            aria-expanded={filtersOpen}
                                            onClick={() =>
                                                setFiltersOpen(!filtersOpen)
                                            }
                                        >
                                            <span aria-hidden="true">
                                                {filtersOpen ? '▾' : '▸'}
                                            </span>
                                            {i18n.t('Optional filters')}
                                            {filterCount > 0 && (
                                                <span
                                                    className={
                                                        styles.countBadge
                                                    }
                                                >
                                                    {filterCount}
                                                </span>
                                            )}
                                        </button>

                                        {filtersOpen && (
                                            <div
                                                className={
                                                    styles.disclosureBody
                                                }
                                            >
                                                {filterFields.map((field) => (
                                                    <SingleSelectField
                                                        key={field.id}
                                                        clearable
                                                        label={field.label}
                                                        placeholder={i18n.t(
                                                            'Any'
                                                        )}
                                                        selected={safeSelected(
                                                            field.options,
                                                            selection.filters[
                                                                field.id
                                                            ]
                                                        )}
                                                        onChange={({
                                                            selected,
                                                        }) =>
                                                            update({
                                                                filters: {
                                                                    ...selection.filters,
                                                                    [field.id]:
                                                                        selected,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        {field.options.map(
                                                            (option) => (
                                                                <SingleSelectOption
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    value={
                                                                        option.id
                                                                    }
                                                                    label={
                                                                        option.displayName
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </SingleSelectField>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                <section className={styles.output}>
                    {reportError && (
                        <Card>
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
                        </Card>
                    )}

                    {reportLoading && (
                        <Card>
                            <div className={styles.centered}>
                                <CircularLoader />
                                <p style={{ marginTop: 16 }}>
                                    {i18n.t(
                                        'Building your report — large forms can take a moment.'
                                    )}
                                </p>
                            </div>
                        </Card>
                    )}

                    {!reportLoading && !report && !reportError && (
                        <Card>
                            <div className={styles.centered}>
                                <h2>{i18n.t('No report yet')}</h2>
                                <p>
                                    {i18n.t(
                                        'Choose an organisation unit, a data set and a period, then select Get report. You will get the data entry form for that period, filled in and ready to print.'
                                    )}
                                </p>
                                {restoredFromMemory && (
                                    <p
                                        className={styles.help}
                                        style={{ marginTop: 16 }}
                                    >
                                        {i18n.t(
                                            'Your options from last time are filled in already.'
                                        )}
                                    </p>
                                )}
                            </div>
                        </Card>
                    )}

                    {!reportLoading && report && (
                        <Card>
                            {isStale && (
                                <div className={styles.noticePad}>
                                    <NoticeBox
                                        warning
                                        title={i18n.t('These options changed')}
                                    >
                                        {i18n.t(
                                            'The report below is still {{dataSet}} · {{period}} · {{orgUnit}}.',
                                            {
                                                dataSet:
                                                    report.snapshot.dataSetName,
                                                period: report.snapshot
                                                    .periodName,
                                                orgUnit:
                                                    report.snapshot.orgUnitName,
                                            }
                                        )}{' '}
                                        <Button
                                            small
                                            onClick={onGenerate}
                                            disabled={!canGenerate}
                                        >
                                            {i18n.t('Get report again')}
                                        </Button>
                                    </NoticeBox>
                                </div>
                            )}

                            <div className={styles.summary}>
                                <dl>
                                    <div>
                                        <dt>{i18n.t('Data set')}</dt>
                                        <dd>{report.snapshot.dataSetName}</dd>
                                    </div>
                                    <div>
                                        <dt>{i18n.t('Period')}</dt>
                                        <dd>{report.snapshot.periodName}</dd>
                                    </div>
                                    <div>
                                        <dt>{i18n.t('Organisation unit')}</dt>
                                        <dd>{report.snapshot.orgUnitName}</dd>
                                    </div>
                                    <div>
                                        <dt>{i18n.t('Includes')}</dt>
                                        <dd>
                                            {report.snapshot.selectedUnitOnly
                                                ? i18n.t('This unit only')
                                                : i18n.t('Sub-units')}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>{i18n.t('Generated')}</dt>
                                        <dd>
                                            {report.snapshot.generatedAt.toLocaleString()}
                                        </dd>
                                    </div>
                                </dl>

                                <div className={styles.summaryActions}>
                                    <Button
                                        small
                                        onClick={() => window.print()}
                                    >
                                        {i18n.t('Print')}
                                    </Button>
                                    {downloads.map((file) => (
                                        <a
                                            key={file.extension}
                                            href={file.url}
                                            download
                                            rel="noreferrer"
                                            target={
                                                file.extension === 'pdf'
                                                    ? '_blank'
                                                    : '_self'
                                            }
                                        >
                                            <Button small>
                                                {i18n.t('Download {{ext}}', {
                                                    ext: file.extension.toUpperCase(),
                                                })}
                                            </Button>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/*
                             * Applied filters stay visible, and stay on the
                             * printout. A filtered report that looks like a
                             * full one gets filed as the facility total.
                             */}
                            {report.snapshot.filterLabels?.length > 0 && (
                                <div className={styles.filterNote}>
                                    <strong>{i18n.t('Filtered:')}</strong>
                                    {report.snapshot.filterLabels.map(
                                        (filter) => (
                                            <span key={filter.label}>
                                                {filter.label}: {filter.value}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}

                            {/*
                             * The two views, and the options that belong to
                             * whichever one is showing. This sits directly
                             * above the report because it is about how the
                             * report is drawn, not about what was asked for —
                             * that is the summary strip above.
                             */}
                            <div className={styles.toolbar}>
                                <SegmentedControl
                                    selected={viewMode}
                                    onChange={onChangeViewMode}
                                    options={[
                                        {
                                            label: i18n.t('Standard'),
                                            value: VIEW_MODES.STANDARD,
                                        },
                                        {
                                            label: i18n.t('Form'),
                                            value: VIEW_MODES.FORM,
                                        },
                                    ]}
                                />

                                {isStandardView &&
                                    report.tables?.length > 1 && (
                                        <nav className={styles.toc}>
                                            <span>
                                                {i18n.t('{{count}} sections', {
                                                    count: report.tables.length,
                                                })}
                                            </span>
                                            {/*
                                             * Buttons, not anchors: the app uses
                                             * hash routing, so href="#section-1"
                                             * is read as a route change and
                                             * navigates away from the report
                                             * instead of scrolling to it.
                                             */}
                                            {report.tables.map((table) => (
                                                <button
                                                    type="button"
                                                    key={table.id}
                                                    className={styles.tocLink}
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                table.id
                                                            )
                                                            ?.scrollIntoView({
                                                                behavior:
                                                                    'smooth',
                                                                block: 'start',
                                                            })
                                                    }
                                                >
                                                    {table.title}
                                                </button>
                                            ))}
                                        </nav>
                                    )}
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
                                                    report.snapshot.dataSetName,
                                                orgUnit:
                                                    report.snapshot.orgUnitName,
                                                period: report.snapshot
                                                    .periodName,
                                            }
                                        )}
                                        {report.snapshot.filterLabels?.length >
                                            0 &&
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
                            {!isStandardView && report.kind === 'custom' && (
                                <div className={styles.reportBody}>
                                    <CustomFormReport
                                        html={report.html}
                                        baseUrl={baseUrl}
                                    />
                                </div>
                            )}

                            {!isStandardView && report.kind !== 'custom' && (
                                <div className={styles.reportBody}>
                                    <FormView
                                        dataSetId={report.snapshot.ds}
                                        grids={report.grids}
                                    />
                                </div>
                            )}
                        </Card>
                    )}
                </section>
            </div>
        </div>
    )
}

export default DataSetReportNext
