import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
    IconArrowLeft16,
    IconChevronLeft24,
    IconChevronRight24,
    NoticeBox,
} from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SectionSwitcher } from '../../components/shell/SectionSwitcher.jsx'
import { STANDARD_REPORT_NEXT_SECTION_KEY } from '../../config/sections.config.js'
import { HtmlReportView } from './HtmlReportView.jsx'
import {
    EditReportDialog,
    NewReportDialog,
    SharingDialog,
} from './ReportActionDialogs.jsx'
import { ReportMeta } from './ReportMeta.jsx'
import {
    fetchHtmlReport,
    idFromPath,
    ORG_UNIT_NAME_QUERY,
    ME_QUERY,
    REPORTS_QUERY,
} from './queries.js'
import { ReportList } from './ReportList.jsx'
import { ReportParamsFields } from './ReportParamsFields.jsx'
import { periodLabel, reportNeeds } from './reportShape.js'
import styles from './StandardReportNext.module.css'
import { useStandardReportSelection } from './useStandardReportSelection.js'

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

export const StandardReportNext = () => {
    const { baseUrl } = useConfig()
    const {
        selection,
        update,
        selectReport,
        clearReport,
        remember,
        restoredFromMemory,
    } = useStandardReportSelection()

    const [railCollapsed, setRailCollapsed] = useState(readRailCollapsed)
    const toggleRail = () =>
        setRailCollapsed((collapsed) => {
            writeRailCollapsed(!collapsed)
            return !collapsed
        })

    /* ---------------- data ---------------- */

    const reportsResult = useDataQuery(REPORTS_QUERY)
    /* Memoised because an empty array literal is a new identity every render,
     * which would invalidate everything derived from it below. */
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

    /*
     * Creating is an authority, not an access flag on an existing report —
     * either of the two report-add authorities will do, and ALL covers both.
     */
    const canCreate = useMemo(() => {
        const authorities = meResult.data?.me?.authorities ?? []
        return ['ALL', 'F_REPORT_PUBLIC_ADD', 'F_REPORT_PRIVATE_ADD'].some(
            (authority) => authorities.includes(authority)
        )
    }, [meResult.data])

    const selected = useMemo(
        () => reports.find((report) => report.id === selection.reportId),
        [reports, selection.reportId]
    )
    const needs = useMemo(() => reportNeeds(selected), [selected])

    /*
     * Management is gated on the report's own access flags, exactly as the
     * current page's context menu is. Most people can only read, so for most
     * people these buttons never appear at all.
     */
    const access = selected?.access ?? {}
    const canEdit = Boolean(access.update)
    const canShare = Boolean(access.manage || access.externalize)

    /* Which management dialog is open, if any. */
    const [dialog, setDialog] = useState(null)

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
     * Takes the report and the values explicitly rather than reading state.
     * Selecting a parameterless report generates it in the same tick as the
     * selection, and the state holding that selection has not landed yet.
     */
    const generate = useCallback(
        async (target, values) => {
            if (!target) {
                return
            }

            /*
             * Selecting a report with no parameters runs it, so browsing the
             * list fires a request per click. Abandoning the previous one
             * means fast browsing costs one render rather than five.
             */
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

    /* Take down whatever is on screen, and abandon anything still coming. */
    const clearReportOutput = useCallback(() => {
        inFlight.current?.abort()
        inFlight.current = null
        setReportLoading(false)
        setReport(null)
        setReportError(null)
    }, [])

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

    const onGenerate = (event) => {
        event?.preventDefault()

        if (!canGenerate) {
            return
        }

        remember(selection)
        generate(selected, currentValues())
    }

    /*
     * Selection is the action for a report that asks for nothing — there is
     * no second step to put a button on. A report that does ask for something
     * switches the rail into its parameters instead and waits.
     */
    const onSelect = (candidate) => {
        selectReport(candidate.id)
        setDialog(null)

        const candidateNeeds = reportNeeds(candidate)

        if (!candidateNeeds.orgUnit && !candidateNeeds.period) {
            generate(candidate, {
                ou: '',
                ouName: '',
                pe: '',
                peLabel: '',
            })
            return
        }

        /*
         * This report cannot run yet, so nothing should be on screen. Leaving
         * the previous report up while the rail asks for a period invites
         * reading it as this report's output — a warning above it is not
         * enough, because the numbers are what people look at.
         */
        clearReportOutput()
    }

    const onChangeReport = () => {
        clearReport()
        clearReportOutput()
        setDialog(null)
    }

    /*
     * Whether what is on screen still matches what the rail says. Only the
     * parameters can drift now — choosing a different report clears the
     * output outright — so this is the milder case: the same report, run
     * against options the rail has since moved on from.
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

                    <div className={styles.railHeader}>
                        <SectionSwitcher
                            currentSection={STANDARD_REPORT_NEXT_SECTION_KEY}
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

                    <div id="report-options" className={styles.railBody}>
                        {/*
                         * Two modes sharing one rail. Finding a report wants
                         * the whole height; so does an org unit tree. They
                         * never need it at the same time, so they take turns.
                         */}
                        {!selected ? (
                            <ReportList
                                reports={reports}
                                loading={reportsResult.loading}
                                error={reportsResult.error}
                                canCreate={canCreate}
                                onSelect={onSelect}
                                onCreate={() => setDialog('new')}
                            />
                        ) : (
                            <form
                                className={styles.railForm}
                                onSubmit={onGenerate}
                            >
                                <div className={styles.railScroll}>
                                    <div className={styles.railFields}>
                                        {/*
                                         * Above the report rather than
                                         * beside its name: leaving is a move
                                         * back out of this report, not an
                                         * edit to which report it is.
                                         */}
                                        <button
                                            type="button"
                                            className={styles.backToAll}
                                            onClick={onChangeReport}
                                        >
                                            <IconArrowLeft16 />
                                            {i18n.t('Back to all')}
                                        </button>

                                        <div className={styles.chosen}>
                                            <span
                                                className={styles.chosenName}
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

                                        {!needs.orgUnit && !needs.period && (
                                            <p className={styles.help}>
                                                {i18n.t(
                                                    'This report takes no options — it ran as soon as you picked it.'
                                                )}
                                            </p>
                                        )}

                                        <ReportMeta report={selected} />
                                    </div>

                                    {/*
                                     * Only shown when there is something to
                                     * generate *with*. A parameterless report
                                     * has already run; a button here would do
                                     * nothing but repeat it.
                                     */}
                                    {(needs.orgUnit ||
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
                                                    {i18n.t('Generate')}
                                                </Button>
                                            )}

                                            {/*
                                             * Changing the report is a
                                             * different kind of act from
                                             * running it, so these sit
                                             * apart and read quieter.
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
                                                                setDialog(
                                                                    'edit'
                                                                )
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
                                                                setDialog(
                                                                    'sharing'
                                                                )
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
                        )}
                    </div>
                </aside>

                {/* ---------------- output ---------------- */}
                <section className={styles.output}>
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
                        <div className={styles.centered}>
                            <CircularLoader />
                            <p style={{ marginTop: 16 }}>
                                {i18n.t('Building your report…')}
                            </p>
                        </div>
                    )}

                    {!reportLoading && !report && !reportError && (
                        <div className={styles.centered}>
                            <h2>{i18n.t('No report yet')}</h2>
                            <p>
                                {selected
                                    ? i18n.t(
                                          'Fill in the options on the left, then select Generate.'
                                      )
                                    : i18n.t(
                                          'Choose a report on the left. Most run straight away; the rest will ask you for a period or an organisation unit first.'
                                      )}
                            </p>
                            {restoredFromMemory && !selected && (
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

                    {!reportLoading && report && (
                        <div>
                            {isStale && (
                                <div className={styles.noticePad}>
                                    <NoticeBox
                                        warning
                                        title={i18n.t('These options changed')}
                                    >
                                        {i18n.t(
                                            'The report below is still {{report}}.',
                                            {
                                                report: report.snapshot
                                                    .reportName,
                                            }
                                        )}{' '}
                                        <Button
                                            small
                                            onClick={onGenerate}
                                            disabled={!canGenerate}
                                        >
                                            {i18n.t('Generate again')}
                                        </Button>
                                    </NoticeBox>
                                </div>
                            )}

                            <div className={styles.summary}>
                                <p className={styles.summaryLine}>
                                    {summaryLine}
                                </p>
                                <div className={styles.summaryActions}>
                                    <Button
                                        small
                                        onClick={() => window.print()}
                                    >
                                        {i18n.t('Print')}
                                    </Button>
                                </div>
                            </div>

                            <HtmlReportView html={report.html} />
                        </div>
                    )}
                </section>
            </div>

            {dialog === 'new' && (
                <NewReportDialog onClose={() => setDialog(null)} />
            )}

            {dialog === 'edit' && selected && (
                <EditReportDialog
                    report={selected}
                    onClose={() => setDialog(null)}
                />
            )}

            {dialog === 'sharing' && selected && (
                <SharingDialog
                    report={selected}
                    onClose={() => setDialog(null)}
                />
            )}
        </div>
    )
}
