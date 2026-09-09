import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RailToggleIcon } from '../../components/shell/RailToggleIcon.jsx'
import { ReportBreadcrumb } from '../../components/shell/ReportBreadcrumb.jsx'
import { ReportEmptyState } from '../../components/shell/ReportEmptyState.jsx'
import { STANDARD_REPORT_NEXT_SECTION_KEY } from '../../config/sections.config.js'
import {
    analyticsLabel,
    useAnalyticsGeneratedAt,
} from '../../utils/analytics/analyticsGenerated.js'
import { DEMO_REPORTS, demoReportHtml, isDemoReport } from './demoReports.js'
import { HtmlReportView } from './HtmlReportView.jsx'
import { recordLastUsed } from './lastUsed.js'
import {
    fetchHtmlReport,
    idFromPath,
    ME_QUERY,
    ORG_UNIT_NAME_QUERY,
    REPORTS_QUERY,
} from './queries.js'
import { ReportParamsFields } from './ReportParamsFields.jsx'
import { periodLabel, reportNeeds } from './reportShape.js'
import styles from './StandardReportNext.module.css'
import { useStandardReportSelection } from './useStandardReportSelection.js'

/*
 * When the report was built. Short and numeric — it is a timestamp on a
 * summary line, not a date anyone reads out. The locale decides the order of
 * the parts, so this never hard-codes day-before-month.
 */
const createdLabel = (generatedAt) =>
    i18n.t('Created {{when}}', {
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
 * One report: its options on the rail, its output beside them.
 *
 * Which report this is comes from the route rather than from anything on the
 * page — finding a report is the list's job, on its own full-width page, and
 * by the time you are here that question is settled.
 */
export const StandardReportNext = ({ match }) => {
    const { baseUrl } = useConfig()
    const reportId = match.params.id

    const { selection, update, remember, restoredFromUrl } =
        useStandardReportSelection()

    /*
     * Collapsing the options rail is a thing you do to the report in front of you
     * — to get it out of the way of this table, on this screen — not a standing
     * preference. So it lasts as long as the page does: every report opens with
     * its options in view, which is also the only state that explains itself to
     * someone arriving.
     */
    const [railCollapsed, setRailCollapsed] = useState(false)
    const toggleRail = () => setRailCollapsed((collapsed) => !collapsed)

    /* ---------------- data ---------------- */

    /*
     * The whole list again, rather than a single report by id. It is one
     * cached request shared with the list page, and the report objects are
     * identical either way.
     */
    const reportsResult = useDataQuery(REPORTS_QUERY)
    const reports = useMemo(
        () => [
            ...DEMO_REPORTS,
            ...(reportsResult.data?.reports?.reports ?? []),
        ],
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
            /* Running it is what counts as using it. */
            recordLastUsed(target.id)

            const snapshot = {
                reportName: target.displayName,
                ou: values.ou,
                ouName: values.ouName,
                pe: values.pe,
                peLabel: values.peLabel,
                generatedAt: new Date(),
            }

            try {
                /* A demo design is generated here rather than by the server. */
                if (isDemoReport(target.id)) {
                    setReport({
                        html: demoReportHtml(target.id, snapshot),
                        snapshot,
                    })
                    return
                }

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

    /* A property of the instance, not of this report — same answer on every
     * report screen. */
    const analyticsGeneratedAt = useAnalyticsGeneratedAt()

    /* What was asked for: the report, and the two answers it was run
     * against. */
    const summaryLine = report
        ? [
              report.snapshot.reportName,
              report.snapshot.ouName || null,
              report.snapshot.peLabel || report.snapshot.pe || null,
          ]
              .filter(Boolean)
              .join(' · ')
        : ''

    /*
     * The subtitle: when this copy was made, and how old the numbers in it
     * are. Below the line above rather than on the end of it, because these
     * are facts about the report rather than about what was asked for.
     */
    const subtitleLine = report
        ? [
              createdLabel(report.snapshot.generatedAt),
              analyticsLabel(analyticsGeneratedAt),
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
                 * Where you are: the trail back to the report list.
                 */}
                {/*
                 * With a report open its name is the whole trail — the
                 * section name in between says nothing you need.
                 */}
                <ReportBreadcrumb
                    currentSection={
                        selected ? '' : STANDARD_REPORT_NEXT_SECTION_KEY
                    }
                    leaf={selected?.displayName}
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
                                    {/* Which report you are on is the
                                     * breadcrumb's job; the rail is only the
                                     * options for it. */}
                                    {reportsResult.loading && (
                                        <CircularLoader small />
                                    )}

                                    {selected && (
                                        <>
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
                                                    <section
                                                        className={styles.group}
                                                    >
                                                        <p
                                                            className={
                                                                styles.help
                                                            }
                                                        >
                                                            {i18n.t(
                                                                'No parameters available. Period and org unit are set by the report.'
                                                            )}
                                                        </p>
                                                    </section>
                                                )}
                                        </>
                                    )}
                                </div>

                                <div className={styles.railActions}>
                                    {/*
                                     * Shown even for a parameterless report,
                                     * which already ran on arrival: the data
                                     * behind it can change after that, and
                                     * this is how you ask for it again.
                                     */}
                                    {selected && (
                                        <Button
                                            primary
                                            type="submit"
                                            disabled={!canGenerate}
                                            loading={reportLoading}
                                        >
                                            {i18n.t('Get report')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
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
                        {notFound && (
                            <div className={styles.noticePad}>
                                <NoticeBox
                                    error
                                    title={i18n.t(
                                        'This report is not available'
                                    )}
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
                                    {i18n.t('Getting report…')}
                                </p>
                            </div>
                        )}

                        {!reportLoading &&
                            !report &&
                            !reportError &&
                            !notFound && <ReportEmptyState />}

                        {!reportLoading && report && (
                            <div
                                className={`${styles.reportCard} ${
                                    isStale ? styles.staleOutput : ''
                                }`}
                            >
                                <div className={styles.summary}>
                                    <p className={styles.summaryLine}>
                                        {summaryLine}
                                    </p>
                                    <p className={styles.subtitleLine}>
                                        {subtitleLine}
                                    </p>
                                </div>

                                {/*
                                 * The report frame is as tall as the report it
                                 * drew, so it is this that scrolls rather than
                                 * the card around it.
                                 */}
                                <div className={styles.reportScroll}>
                                    <HtmlReportView html={report.html} />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

StandardReportNext.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({ id: PropTypes.string }),
    }).isRequired,
}
