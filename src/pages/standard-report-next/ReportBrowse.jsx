import { useDataQuery, useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    InputField,
    NoticeBox,
} from '@dhis2/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { SectionSwitcher } from '../../components/shell/SectionSwitcher.jsx'
import {
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import { ME_QUERY, REPORTS_QUERY } from './queries.js'
import { exactTime, timeAgo } from './relativeTime.js'
import {
    EditReportDialog,
    NewReportDialog,
    SharingDialog,
} from './ReportActionDialogs.jsx'
import { ReportRowMenu } from './ReportRowMenu.jsx'
import { needsSummary } from './reportShape.js'
import styles from './StandardReportNext.module.css'

const basePath = sections[STANDARD_REPORT_NEXT_SECTION_KEY].path

/*
 * Sorting is done here rather than at the server for the same reason the
 * search is: the whole list is already in memory, so it costs nothing and
 * responds instantly.
 */
const COLUMNS = {
    NAME: 'displayName',
    CREATED_BY: 'createdBy',
    CREATED: 'created',
    UPDATED: 'lastUpdated',
}

const sortValue = (report, column) => {
    switch (column) {
        case COLUMNS.CREATED_BY:
            return (report.createdBy?.displayName || '').toLowerCase()
        case COLUMNS.CREATED:
            return report.created || ''
        case COLUMNS.UPDATED:
            return report.lastUpdated || ''
        default:
            return (report.displayName || '').toLowerCase()
    }
}

const nextDirection = (direction) => (direction === 'asc' ? 'desc' : 'asc')

/*
 * The landing page for standard reports: the whole list, with room for what
 * you need in order to choose between two reports with similar names — who
 * wrote them, when they were last touched, and what each will ask for.
 *
 * Running one is a different job, on a different route. This page is only
 * about finding the right one.
 */
export const ReportBrowse = () => {
    const history = useHistory()
    const { fromServerDate } = useTimeZoneConversion()

    const reportsResult = useDataQuery(REPORTS_QUERY)
    const reports = useMemo(
        () => reportsResult.data?.reports?.reports ?? [],
        [reportsResult.data]
    )

    const meResult = useDataQuery(ME_QUERY)
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

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState({
        column: COLUMNS.NAME,
        direction: 'asc',
    })

    const [dialog, setDialog] = useState(null)
    const closeDialog = useCallback(() => setDialog(null), [])
    const openEdit = useCallback(
        (subject) => setDialog({ kind: 'edit', report: subject }),
        []
    )
    const openSharing = useCallback(
        (subject) => setDialog({ kind: 'sharing', report: subject }),
        []
    )

    const rows = useMemo(() => {
        const term = search.trim().toLowerCase()

        const filtered = term
            ? reports.filter((report) =>
                  report.displayName.toLowerCase().includes(term)
              )
            : reports

        const factor = sort.direction === 'asc' ? 1 : -1

        return [...filtered].sort((a, b) => {
            const left = sortValue(a, sort.column)
            const right = sortValue(b, sort.column)

            if (left === right) {
                /* A stable second key, so equal timestamps are not arbitrary. */
                return a.displayName.localeCompare(b.displayName)
            }

            return left > right ? factor : -factor
        })
    }, [reports, search, sort])

    const open = (report) => history.push(`${basePath}/${report.id}`)

    const onSort = (column) =>
        setSort((current) => ({
            column,
            direction:
                current.column === column
                    ? nextDirection(current.direction)
                    : 'asc',
        }))

    /*
     * DataTableColumnHeader wants a direction for every sortable column, and
     * "default" is what it calls the two it is not currently sorting by.
     */
    const directionFor = (column) =>
        sort.column === column ? sort.direction : 'default'

    const header = (column, label, width) => (
        <DataTableColumnHeader
            width={width}
            name={column}
            sortDirection={directionFor(column)}
            onSortIconClick={() => onSort(column)}
        >
            {label}
        </DataTableColumnHeader>
    )

    const when = (timestamp) => {
        if (!timestamp) {
            return null
        }

        /*
         * DHIS2 timestamps are written in the server's timezone and carry no
         * offset, so reading them as local time makes something saved minutes
         * ago look hours old. app-runtime knows the server's zone.
         */
        const date = fromServerDate(timestamp)

        return <span title={exactTime(date)}>{timeAgo(date)}</span>
    }

    const isSearching = Boolean(search.trim())

    return (
        <div className={styles.page}>
            {/* ---------------- top bar ---------------- */}
            <header className={styles.topbar}>
                <SectionSwitcher
                    currentSection={STANDARD_REPORT_NEXT_SECTION_KEY}
                />
            </header>

            {/* ---------------- the list ---------------- */}
            <div className={styles.browsePage}>
                <section className={styles.browseCard}>
                    <div className={styles.browseToolbar}>
                        <div className={styles.browseSearch}>
                            <InputField
                                dense
                                type="search"
                                value={search}
                                onChange={({ value }) => setSearch(value)}
                                placeholder={i18n.t('Search by name')}
                            />
                        </div>

                        {/*
                         * Only while searching. A permanent count is a
                         * number nobody asked for; a count under a search is
                         * the answer to "did that find anything".
                         */}
                        {isSearching && !reportsResult.loading && (
                            <p className={styles.browseCount}>
                                {i18n.t('{{count}} of {{total}} reports', {
                                    count: rows.length,
                                    total: reports.length,
                                })}
                            </p>
                        )}

                        {/*
                         * At the far end of the row that governs the list,
                         * not in the page's bar: it acts on the list, and the
                         * bar above belongs to the page.
                         */}
                        {canCreate && (
                            <div className={styles.browseNew}>
                                <Button
                                    small
                                    onClick={() => setDialog({ kind: 'new' })}
                                >
                                    {i18n.t('New standard report…')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {reportsResult.loading && (
                        <div className={styles.loading}>
                            <CircularLoader small />
                            <p className={styles.loadingText}>
                                {i18n.t('Loading reports…')}
                            </p>
                        </div>
                    )}

                    {reportsResult.error && (
                        <div className={styles.noticePad}>
                            <NoticeBox
                                error
                                title={i18n.t('Could not load the reports')}
                            >
                                {reportsResult.error.message}
                            </NoticeBox>
                        </div>
                    )}

                    {!reportsResult.loading && !reportsResult.error && (
                        <div className={styles.browseScroll}>
                            <DataTable layout="fixed">
                                <DataTableHead>
                                    <DataTableRow>
                                        {header(
                                            COLUMNS.NAME,
                                            i18n.t('Report'),
                                            'auto'
                                        )}
                                        <DataTableColumnHeader width="200px">
                                            {i18n.t('Parameters')}
                                        </DataTableColumnHeader>
                                        {header(
                                            COLUMNS.CREATED_BY,
                                            i18n.t('Created by'),
                                            '180px'
                                        )}
                                        {header(
                                            COLUMNS.CREATED,
                                            i18n.t('Created'),
                                            '140px'
                                        )}
                                        {header(
                                            COLUMNS.UPDATED,
                                            i18n.t('Last changed'),
                                            '140px'
                                        )}
                                        <DataTableColumnHeader width="48px">
                                            <span
                                                className={
                                                    styles.visuallyHidden
                                                }
                                            >
                                                {i18n.t('Actions')}
                                            </span>
                                        </DataTableColumnHeader>
                                    </DataTableRow>
                                </DataTableHead>

                                <DataTableBody>
                                    {rows.map((report) => (
                                        <DataTableRow key={report.id}>
                                            {/*
                                             * A real link, not a cell that
                                             * happens to be clickable: it
                                             * takes keyboard focus, and it
                                             * can be opened in a new tab.
                                             */}
                                            <DataTableCell>
                                                <Link
                                                    className={
                                                        styles.browseName
                                                    }
                                                    to={`${basePath}/${report.id}`}
                                                >
                                                    {report.displayName}
                                                </Link>
                                            </DataTableCell>

                                            <DataTableCell
                                                className={styles.browseCell}
                                                onClick={() => open(report)}
                                            >
                                                <span
                                                    className={
                                                        styles.browseQuiet
                                                    }
                                                >
                                                    {needsSummary(report)}
                                                </span>
                                            </DataTableCell>

                                            <DataTableCell
                                                className={styles.browseCell}
                                                onClick={() => open(report)}
                                            >
                                                {report.createdBy
                                                    ?.displayName || '—'}
                                            </DataTableCell>

                                            <DataTableCell
                                                className={styles.browseCell}
                                                onClick={() => open(report)}
                                            >
                                                {when(report.created) || '—'}
                                            </DataTableCell>

                                            <DataTableCell
                                                className={styles.browseCell}
                                                onClick={() => open(report)}
                                            >
                                                {when(report.lastUpdated) ||
                                                    '—'}
                                            </DataTableCell>

                                            <DataTableCell align="right">
                                                <ReportRowMenu
                                                    report={report}
                                                    onEdit={openEdit}
                                                    onShare={openSharing}
                                                />
                                            </DataTableCell>
                                        </DataTableRow>
                                    ))}
                                </DataTableBody>
                            </DataTable>

                            {rows.length === 0 && (
                                <p className={styles.browseEmpty}>
                                    {isSearching
                                        ? i18n.t(
                                              'No report matches “{{search}}”.',
                                              { search: search.trim() }
                                          )
                                        : i18n.t(
                                              'There are no standard reports yet.'
                                          )}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {dialog?.kind === 'new' && (
                <NewReportDialog onClose={closeDialog} />
            )}

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
