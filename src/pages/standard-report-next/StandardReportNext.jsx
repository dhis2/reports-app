import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, IconArrowLeft16, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RailToggleIcon } from '../../components/shell/RailToggleIcon.jsx'
import { SectionSwitcher } from '../../components/shell/SectionSwitcher.jsx'
import {
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import { HtmlReportView } from './HtmlReportView.jsx'
import {
    fetchHtmlReport,
    idFromPath,
    ME_QUERY,
    ORG_UNIT_NAME_QUERY,
    REPORTS_QUERY,
} from './queries.js'
import { EditReportDialog, SharingDialog } from './ReportActionDialogs.jsx'
import { ReportMeta } from './ReportMeta.jsx'
import { ReportParamsFields } from './ReportParamsFields.jsx'
import { periodLabel, reportNeeds } from './reportShape.js'
import styles from './StandardReportNext.module.css'
import { useStandardReportSelection } from './useStandardReportSelection.js'

const basePath = sections[STANDARD_REPORT_NEXT_SECTION_KEY].path

/*
 * Whether the options rail is collapsed is a per-viewer preference, not part
 * of what the report is — so it is remembered locally and deliberately kept
 * out of the URL, which stays a description of the report itself.
 */
const RAIL_STORAGE_KEY = 'reports-app:standard-report-next:rail-collapsed'

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
 * One report: its options on the rail, its output beside them.
 *
 * Which report this is comes from the route rather than from anything on the
 * page — finding a report is the list's job, on its own full-width page, and
 * by the time you are here that question is settled.
 */
export const StandardReportNext = ({ match }) => {
    const { baseUrl } = useConfig()
    const history = useHistory()
    const reportId = match.params.id

    const { selection, update, remember, restoredFromMemory, restoredFromUrl } =
        useStandardReportSelection()

    const [railCollapsed, setRailCollapsed] = useState(readRailCollapsed)
    const toggleRail = () =>
        setRailCollapsed((collapsed) => {
            writeRailCollapsed(!collapsed)
            return !collapsed
        })

    /* ---------------- data ---------------- */

    /*
     * The whole list again, rather than a single report by id. It is one
     * cached request shared with the list page, and the report objects are
     * identical either way.
     */
    const reportsResult = useDataQuery(REPORTS_QUERY)
    const reports = useMemo(
        () => reportsResult.data?.reports?.reports ?? [],
        [reportsResult.data]
    )

    const meResult = useDataQuery(ME_QUERY)
    const roots = useMemo(() => {
        const me = meResult.data?.me
        const units = me?.dataViewOrganisationUnits?.length
            ? me.dataViewOrganisationUnits
            : me?.organisationUnits ?? []
        return units.map((unit) => unit.id)
    }, [meResult.data])

    const selected = useMemo(
        () => reports.find((report) => report.id === reportId),
        [reports, reportId]
    )
    const needs = useMemo(() => reportNeeds(selected), [selected])

    /* The list has loaded and this id is not in it. */
    const notFound = Boolean(
        !reportsResult.loading && !reportsResult.error && !selected
    )

    /*
     * Management is gated on the report's own access flags, exactly as the
     * current page's context menu is. Most people can only read, so for most
     * people these buttons never appear at all.
     */
    const access = selected?.access ?? {}
    const canEdit = Boolean(access.update)
    const canShare = Boolean(access.manage || access.externalize)

    const [dialog, setDialog] = useState(null)
    const closeDialog = useCallback(() => setDialog(null), [])

    /*
     * The org unit's name, for the summary line. Fetched rather than only
     * taken from the tree, because a selection restored from a link arrives
     * as an id with no name attached.
     */
    const [ouName, setOuName] = useState('')
    const nameResult = useDataQuery(ORG_UNIT_NAME_QUERY, {
        variables: { id: idFromPath(selection.ouPath) },
        lazy: true,
    })
    useEffect(() => {
        const id = idFromPath(selection.ouPath)
        if (id) {
            nameResult.refetch({ id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection.ouPath])
    useEffect(() => {
        const name = nameResult.data?.orgUnit?.displayName
        if (name) {
            setOuName(name)
        }
    }, [nameResult.data])

    /* ---------------- generating ---------------- */

    const [report, setReport] = useState(null)
    const [reportLoading, setReportLoading] = useState(false)
    const [reportError, setReportError] = useState(null)
    const inFlight = useRef(null)

    /*
     * Takes the report and the values explicitly rather than reading state,
     * because the first run happens as soon as the report resolves — before
     * anything derived from it has landed.
     */
    const generate = useCallback(
        async (target, values) => {
            if (!target) {
                return
            }

            inFlight.current?.abort()
            const controller = new AbortController()
            inFlight.current = controller

            setReportLoading(true)
            setReportError(null)

            const snapshot = {
                reportName: target.displayName,
                ou: values.ou,
                ouName: values.ouName,
                pe: values.pe,
                peLabel: values.peLabel,
                generatedAt: new Date(),
            }

            try {
                const html = await fetchHtmlReport(
                    baseUrl,
                    { id: target.id, ou: values.ou, pe: values.pe },
                    controller.signal
                )

                if (controller.signal.aborted) {
                    return
                }

                setReport({ html, snapshot })
            } catch (error) {
                if (error.name === 'AbortError') {
                    return
                }
                setReport(null)
                setReportError(error)
            } finally {
                if (inFlight.current === controller) {
                    inFlight.current = null
                    setReportLoading(false)
                }
            }
        },
        [baseUrl]
    )

    useEffect(() => () => inFlight.current?.abort(), [])

    const currentValues = () => ({
        ou: needs.orgUnit ? idFromPath(selection.ouPath) : '',
        ouName: needs.orgUnit ? ouName : '',
        pe: needs.period ? selection.pe : '',
        peLabel: needs.period ? periodLabel(selected, selection) : '',
    })

    const canGenerate =
        Boolean(selected) &&
        (!needs.orgUnit || Boolean(selection.ouPath)) &&
        (!needs.period || Boolean(selection.pe))

    /*
     * Opening the page is the request. A report that asks for nothing runs on
     * arrival — there is no second step to put a button on — and so does one
     * whose parameters were named by the link that got you here, because a
     * link to a run should show that run rather than a filled-in form.
     *
     * An org unit remembered from last time is deliberately not enough: that
     * is our guess, not the visitor's instruction.
     */
    const autoRan = useRef(false)
    useEffect(() => {
        if (autoRan.current || !selected || reportLoading) {
            return
        }

        const asksNothing = !needs.orgUnit && !needs.period

        if (!asksNothing && !(restoredFromUrl && canGenerate)) {
            return
        }

        /* Wait for the name, so the summary line is not born incomplete. */
        if (needs.orgUnit && selection.ouPath && !ouName) {
            return
        }

        autoRan.current = true
        generate(selected, currentValues())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, needs, ouName, canGenerate, restoredFromUrl])

    const onGenerate = (event) => {
        event?.preventDefault()

        if (!canGenerate) {
            return
        }

        remember(selection)
        generate(selected, currentValues())
    }

    /*
     * Whether what is on screen still matches what the rail says: the same
     * report, run against options the rail has since moved on from.
     */
    const isStale =
        Boolean(report) &&
        Boolean(selected) &&
        (report.snapshot.ou !== currentValues().ou ||
            report.snapshot.pe !== currentValues().pe)

    const summaryLine = report
        ? [
              report.snapshot.reportName,
              report.snapshot.ouName || null,
              report.snapshot.peLabel || report.snapshot.pe || null,
              report.snapshot.generatedAt.toLocaleString(),
          ]
              .filter(Boolean)
              .join(' · ')
        : ''

    /* ---------------- render ---------------- */

    return (
        <div className={styles.page}>
            {/* ---------------- top bar ---------------- */}
            <header className={styles.topbar}>
                {/*
                 * Where you are. The section name is also the control for
                 * switching section, so it stands in for a page heading
                 * rather than adding one.
                 */}
                <SectionSwitcher
                    currentSection={STANDARD_REPORT_NEXT_SECTION_KEY}
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
                    </div>
                )}
            </header>

            <div
                className={`${styles.work} ${
                    railCollapsed ? styles.workRailCollapsed : ''
                }`}
            >
                {/* ---------------- options rail ---------------- */}
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

                    <div id="report-options" className={styles.railBody}>
                        <form className={styles.railForm} onSubmit={onGenerate}>
                            <div className={styles.railScroll}>
                                <div className={styles.railFields}>
                                    {/*
                                     * Above the report rather than beside its
                                     * name: leaving is a move back out to the
                                     * list, not an edit to which report this
                                     * is.
                                     */}
                                    <button
                                        type="button"
                                        className={styles.backToAll}
                                        onClick={() => history.push(basePath)}
                                    >
                                        <IconArrowLeft16 />
                                        {i18n.t('All reports')}
                                    </button>

                                    {reportsResult.loading && (
                                        <CircularLoader small />
                                    )}

                                    {selected && (
                                        <>
                                            <div className={styles.chosen}>
                                                <span
                                                    className={
                                                        styles.chosenName
                                                    }
                                                    title={selected.displayName}
                                                >
                                                    {selected.displayName}
                                                </span>
                                            </div>

                                            <ReportParamsFields
                                                report={selected}
                                                needs={needs}
                                                selection={selection}
                                                update={update}
                                                roots={roots}
                                                rootsLoading={meResult.loading}
                                                rootsError={meResult.error}
                                                onOrgUnitName={setOuName}
                                            />

                                            {!needs.orgUnit &&
                                                !needs.period && (
                                                    <p className={styles.help}>
                                                        {i18n.t(
                                                            'This report takes no options — it ran as soon as you opened it.'
                                                        )}
                                                    </p>
                                                )}

                                            <ReportMeta report={selected} />
                                        </>
                                    )}
                                </div>

                                {/*
                                 * Only shown when there is something to
                                 * generate *with*. A parameterless report has
                                 * already run; a button here would do nothing
                                 * but repeat it.
                                 */}
                                {selected &&
                                    (needs.orgUnit ||
                                        needs.period ||
                                        canEdit ||
                                        canShare) && (
                                        <div className={styles.railActions}>
                                            {(needs.orgUnit ||
                                                needs.period) && (
                                                <Button
                                                    primary
                                                    type="submit"
                                                    disabled={!canGenerate}
                                                    loading={reportLoading}
                                                >
                                                    {i18n.t('Get report')}
                                                </Button>
                                            )}

                                            {/*
                                             * Changing the report is a
                                             * different kind of act from
                                             * running it, so these sit apart
                                             * and read quieter.
                                             */}
                                            {(canEdit || canShare) && (
                                                <div
                                                    className={
                                                        styles.manageActions
                                                    }
                                                >
                                                    {canEdit && (
                                                        <Button
                                                            small
                                                            secondary
                                                            onClick={() =>
                                                                setDialog({
                                                                    kind: 'edit',
                                                                    report: selected,
                                                                })
                                                            }
                                                        >
                                                            {i18n.t(
                                                                'Edit report…'
                                                            )}
                                                        </Button>
                                                    )}
                                                    {canShare && (
                                                        <Button
                                                            small
                                                            secondary
                                                            onClick={() =>
                                                                setDialog({
                                                                    kind: 'sharing',
                                                                    report: selected,
                                                                })
                                                            }
                                                        >
                                                            {i18n.t(
                                                                'Manage sharing…'
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* ---------------- output ---------------- */}
                <section className={styles.output}>
                    {notFound && (
                        <div className={styles.noticePad}>
                            <NoticeBox
                                error
                                title={i18n.t('This report is not available')}
                            >
                                {i18n.t(
                                    'It may have been deleted, or it may be a type this page cannot run. Go back to all reports to pick another.'
                                )}
                            </NoticeBox>
                        </div>
                    )}

                    {reportError && (
                        <div className={styles.noticePad}>
                            <NoticeBox
                                error
                                title={i18n.t('The report could not be built')}
                            >
                                {reportError.message}
                            </NoticeBox>
                        </div>
                    )}

                    {reportLoading && (
                        <div className={styles.loading}>
                            <CircularLoader small />
                            <p className={styles.loadingText}>
                                {i18n.t('Getting report…')}
                            </p>
                        </div>
                    )}

                    {!reportLoading && !report && !reportError && !notFound && (
                        <div className={styles.centered}>
                            <h2>{i18n.t('No report yet')}</h2>
                            <p>
                                {i18n.t(
                                    'Fill in the options on the left, then select Get report.'
                                )}
                            </p>
                            {restoredFromMemory && (
                                <p
                                    className={styles.help}
                                    style={{ marginTop: 16 }}
                                >
                                    {i18n.t(
                                        'Your organisation unit from last time is filled in already.'
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                    {!reportLoading && report && isStale && (
                        <div className={styles.noticePad}>
                            <NoticeBox
                                warning
                                title={i18n.t('These options changed')}
                            >
                                {i18n.t(
                                    'The report below is still {{report}}. Select Get report on the left to refresh it.',
                                    {
                                        report: report.snapshot.reportName,
                                    }
                                )}
                            </NoticeBox>
                        </div>
                    )}

                    {!reportLoading && report && (
                        <div
                            className={isStale ? styles.staleOutput : undefined}
                        >
                            <div className={styles.summary}>
                                <p className={styles.summaryLine}>
                                    {summaryLine}
                                </p>
                            </div>

                            <HtmlReportView html={report.html} />
                        </div>
                    )}
                </section>
            </div>

            {dialog?.kind === 'edit' && dialog.report && (
                <EditReportDialog
                    report={dialog.report}
                    onClose={closeDialog}
                />
            )}

            {dialog?.kind === 'sharing' && dialog.report && (
                <SharingDialog report={dialog.report} onClose={closeDialog} />
            )}
        </div>
    )
}

StandardReportNext.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({ id: PropTypes.string }),
    }).isRequired,
}
