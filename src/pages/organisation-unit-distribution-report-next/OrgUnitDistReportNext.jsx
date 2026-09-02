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
    SegmentedControl,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { ReportEmptyState } from '../../components/shell/ReportEmptyState.jsx'
import { ReportRailLayout } from '../../components/shell/ReportRailLayout.jsx'
import railStyles from '../../components/shell/ReportRailLayout.module.css'
import { ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY } from '../../config/sections.config.js'
import { DistributionChart } from './DistributionChart.jsx'
import { DistributionTable } from './DistributionTable.jsx'
import styles from './OrgUnitDistReportNext.module.css'
import {
    ANALYTICS_QUERY,
    downloadUrls,
    GROUP_SETS_QUERY,
    idFromPath,
    ORG_UNIT_ROOTS_QUERY,
    ORG_UNIT_WITH_CHILDREN_QUERY,
    orgUnitParam,
} from './queries.js'
import {
    coveredUnitCount,
    isEmptyTable,
    toChart,
    toTable,
} from './transform.js'
import { useOrgUnitDistSelection } from './useOrgUnitDistSelection.js'

const VIEW_MODES = {
    TABLE: 'table',
    CHART: 'chart',
}

/*
 * When the report was built. Short and numeric — it is a timestamp on a
 * summary line, not a date anyone reads out. The locale decides the order of
 * the parts, so this never hard-codes day-before-month.
 */
const createdLabel = (generatedAt) =>
    generatedAt.toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

/*
 * How much the report covers, as separate facts rather than one sentence.
 *
 * The plural is chosen here rather than handed to i18next's `count`, which
 * cannot work for a string this app has not shipped yet: the `_plural` key
 * only appears in a locale catalogue once the string has been through
 * translation, and until then i18next falls back to the key — the singular —
 * so "110 organisation unit" is what actually renders.
 *
 * Each phrase stands on its own, so nothing depends on the order they end up
 * in, and a unit with nothing under it simply has no sub-unit phrase: "0
 * sub-units" reads as a fault rather than as a leaf of the hierarchy.
 */
const unitsLabel = (units) =>
    units === 1
        ? i18n.t('1 organisation unit')
        : i18n.t('{{units}} organisation units', { units })

const subUnitsLabel = (subUnits) =>
    subUnits === 1
        ? i18n.t('1 sub-unit')
        : i18n.t('{{subUnits}} sub-units', { subUnits })

/**
 * How the organisation units under one part of the hierarchy break down by
 * the groups of one group set.
 *
 * Two questions on the rail — where, and by what — and one request behind
 * them. The answer is shown as a table or as stacked bars; they are the same
 * numbers, so the toggle sits with the report rather than on the rail.
 */
export const OrgUnitDistReportNext = () => {
    const { baseUrl } = useConfig()
    const engine = useDataEngine()

    const { selection, update, reset, remember } = useOrgUnitDistSelection()
    const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE)

    /* ---------------- data ---------------- */

    const rootsQuery = useDataQuery(ORG_UNIT_ROOTS_QUERY)
    const roots = useMemo(() => {
        const me = rootsQuery.data?.me
        const units = me?.dataViewOrganisationUnits?.length
            ? me.dataViewOrganisationUnits
            : me?.organisationUnits ?? []
        return units.map((unit) => unit.id)
    }, [rootsQuery.data])

    const groupSetsQuery = useDataQuery(GROUP_SETS_QUERY)
    const groupSets = useMemo(
        () => groupSetsQuery.data?.groupSets?.organisationUnitGroupSets ?? [],
        [groupSetsQuery.data]
    )

    const groupSet = useMemo(
        () => groupSets.find((set) => set.id === selection.groupSetId),
        [groupSets, selection.groupSetId]
    )

    const orgUnitId = idFromPath(selection.ouPath)

    /* ---------------- the report ---------------- */

    /*
     * The report is a snapshot, not a view of the form: it holds what was
     * asked for as well as what came back, so the summary line describes the
     * report on screen rather than the current state of the rail.
     */
    const [report, setReport] = useState(null)
    const [reportLoading, setReportLoading] = useState(false)
    const [reportError, setReportError] = useState(null)

    /*
     * The resolved group set, not just its id: the report is labelled with the
     * group set's name, and until the list has loaded there is no name to put
     * on it. That only matters for the moment after a shared link opens, when
     * the id is known from the URL and the list is still in flight.
     */
    const canGenerate = Boolean(orgUnitId && groupSet)

    const onGenerate = useCallback(
        async (event) => {
            event?.preventDefault()

            if (!canGenerate) {
                return
            }

            setReportLoading(true)
            setReportError(null)

            try {
                /*
                 * The selected unit and the units directly under it are the
                 * rows of the report, so they have to be known before the
                 * report can be asked for. The same request supplies the
                 * unit's display name, which is how its row is recognised in
                 * the response — rows carry names, not ids.
                 */
                const { orgUnit } = await engine.query(
                    ORG_UNIT_WITH_CHILDREN_QUERY,
                    { variables: { id: orgUnitId } }
                )

                const ou = orgUnitParam(orgUnit)
                const { analytics } = await engine.query(ANALYTICS_QUERY, {
                    variables: { ou, ougs: selection.groupSetId },
                })

                setReport({
                    table: toTable(analytics, {
                        orgUnitName: orgUnit.displayName,
                    }),
                    generatedAt: new Date(),
                    /* What was asked for — see the note on `report` above. */
                    snapshot: {
                        ou,
                        ougs: selection.groupSetId,
                        ouPath: selection.ouPath,
                        orgUnitName: orgUnit.displayName,
                        /* Always resolved — canGenerate waits for it. */
                        groupSetName: groupSet.displayName,
                    },
                })
                remember(selection)
            } catch (error) {
                setReport(null)
                setReportError(error)
            } finally {
                setReportLoading(false)
            }
        },
        [canGenerate, engine, groupSet, orgUnitId, remember, selection]
    )

    /*
     * Stale detection: the report on screen no longer matches the rail. The
     * current page has no equivalent — it just leaves the old table sitting
     * there looking current.
     */
    const isStale = Boolean(
        report &&
            (report.snapshot.ouPath !== selection.ouPath ||
                report.snapshot.ougs !== selection.groupSetId)
    )

    const onClear = () => {
        reset()
        setReport(null)
        setReportError(null)
    }

    const table = report?.table
    const chart = useMemo(
        () =>
            table
                ? toChart(table, {
                      title: report.snapshot.groupSetName,
                  })
                : null,
        [table, report]
    )

    const downloads = report ? downloadUrls(baseUrl, report.snapshot) : []
    const isEmptyReport = table ? isEmptyTable(table) : false

    /* ---------------- summary ---------------- */

    /*
     * What the report is, as the two names that decide it. Joined rather than
     * phrased: they are both proper nouns, so there is no sentence here to
     * translate — and the same separator carries the detail line below, which
     * makes the two read as one stack of facts about this report.
     */
    const summaryLine = report
        ? [report.snapshot.groupSetName, report.snapshot.orgUnitName].join(
              ' · '
          )
        : ''

    const summaryDetail = report
        ? [
              unitsLabel(coveredUnitCount(table)),
              table.rows.length > 0 ? subUnitsLabel(table.rows.length) : null,
              i18n.t('created {{when}}', {
                  when: createdLabel(report.generatedAt),
                  /*
                   * i18next HTML-escapes interpolated values by default, which
                   * turns the slashes of a numeric date into &#x2F;. React
                   * escapes on render anyway, so escaping here only ever
                   * double-escapes.
                   */
                  interpolation: { escapeValue: false },
              }),
          ]
              .filter(Boolean)
              .join(' · ')
        : ''

    /* ---------------- chrome ---------------- */

    const actions = report ? (
        <>
            <Button small onClick={() => window.print()}>
                {i18n.t('Print')}
            </Button>
            <DropdownButton
                small
                component={
                    <FlyoutMenu>
                        {downloads.map((file) => (
                            <MenuItem
                                key={file.extension}
                                label={file.extension.toUpperCase()}
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
        </>
    ) : null

    const rail = (
        <form className={railStyles.railForm} onSubmit={onGenerate}>
            <div className={railStyles.railScroll}>
                <div className={railStyles.railFields}>
                    {/*
                     * Where in the hierarchy. There is no include-descendants
                     * choice to make: the report is always the units directly
                     * under this one, plus a total over the whole subtree —
                     * that is what the report is.
                     */}
                    <section className={railStyles.group}>
                        <h3 className={railStyles.groupTitle}>
                            {i18n.t('Organisation unit')}
                        </h3>
                        <div className={railStyles.treeCard}>
                            <div className={railStyles.treeBox}>
                                {rootsQuery.loading && <CircularLoader small />}
                                {rootsQuery.error && (
                                    <NoticeBox error>
                                        {i18n.t(
                                            'Could not load organisation units.'
                                        )}
                                    </NoticeBox>
                                )}
                                {!rootsQuery.loading && roots.length > 0 && (
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
                                        onChange={({ path }) =>
                                            update({ ouPath: path })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* By what. One group set — one column per group. */}
                    <section className={railStyles.group}>
                        <h3 className={railStyles.groupTitle}>
                            {i18n.t('Group set')}
                        </h3>

                        {groupSetsQuery.error ? (
                            <NoticeBox error>
                                {i18n.t(
                                    'Could not load organisation unit group sets.'
                                )}
                            </NoticeBox>
                        ) : (
                            <SingleSelectField
                                dense
                                filterable={groupSets.length > 10}
                                noMatchText={i18n.t('No group sets found')}
                                loading={groupSetsQuery.loading}
                                selected={
                                    groupSet ? selection.groupSetId : undefined
                                }
                                placeholder={i18n.t('Choose a group set')}
                                onChange={({ selected }) =>
                                    update({ groupSetId: selected })
                                }
                            >
                                {groupSets.map((set) => (
                                    <SingleSelectOption
                                        key={set.id}
                                        label={set.displayName}
                                        value={set.id}
                                    />
                                ))}
                            </SingleSelectField>
                        )}

                        {!groupSetsQuery.loading &&
                            !groupSetsQuery.error &&
                            groupSets.length === 0 && (
                                <p className={railStyles.help}>
                                    {i18n.t(
                                        'No group sets on this instance have any groups, so there is nothing to report on.'
                                    )}
                                </p>
                            )}
                    </section>
                </div>

                <div className={railStyles.railActions}>
                    <Button
                        primary
                        type="submit"
                        disabled={!canGenerate}
                        loading={reportLoading}
                    >
                        {i18n.t('Get report')}
                    </Button>
                    <Button small secondary onClick={onClear}>
                        {i18n.t('Clear')}
                    </Button>
                </div>
            </div>
        </form>
    )

    return (
        <ReportRailLayout
            sectionKey={ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY}
            railTitle={i18n.t('Configure report')}
            railStorageKey="reports-app:org-unit-dist-report-next:rail-collapsed"
            actions={actions}
            staleNote={
                !reportLoading && report && isStale
                    ? i18n.t('Not updated with latest options')
                    : undefined
            }
            rail={rail}
        >
            {reportError && (
                <div className={railStyles.noticePad}>
                    <NoticeBox error title={i18n.t('The report failed')}>
                        {reportError.message}
                    </NoticeBox>
                </div>
            )}

            {reportLoading && (
                <div className={railStyles.loading}>
                    <CircularLoader small />
                    <p className={railStyles.loadingText}>
                        {i18n.t('Getting report…')}
                    </p>
                </div>
            )}

            {!reportLoading && !report && !reportError && <ReportEmptyState />}

            {!reportLoading && report && (
                <div className={isStale ? railStyles.staleOutput : undefined}>
                    <div className={railStyles.summary}>
                        <p className={railStyles.summaryLine}>{summaryLine}</p>
                        <p className={styles.summaryDetail}>{summaryDetail}</p>
                    </div>

                    {isEmptyReport ? (
                        <p className={styles.emptyReport}>
                            {i18n.t(
                                'No organisation units beneath this one belong to any group in this group set.'
                            )}
                        </p>
                    ) : (
                        <>
                            <div className={styles.viewBar}>
                                <SegmentedControl
                                    selected={viewMode}
                                    options={[
                                        {
                                            label: i18n.t('Table'),
                                            value: VIEW_MODES.TABLE,
                                        },
                                        {
                                            label: i18n.t('Chart'),
                                            value: VIEW_MODES.CHART,
                                            disabled: !chart,
                                        },
                                    ]}
                                    onChange={({ value }) => setViewMode(value)}
                                />
                            </div>

                            {viewMode === VIEW_MODES.CHART && chart ? (
                                <DistributionChart chart={chart} />
                            ) : (
                                <DistributionTable table={table} />
                            )}
                        </>
                    )}
                </div>
            )}
        </ReportRailLayout>
    )
}
