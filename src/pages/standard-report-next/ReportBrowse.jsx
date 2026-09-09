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
    Pagination,
} from '@dhis2/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { ReportBreadcrumb } from '../../components/shell/ReportBreadcrumb.jsx'
import {
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import { DEMO_REPORTS } from './demoReports.js'
import { ME_QUERY, REPORTS_QUERY } from './queries.js'
import { exactTime, timeAgo } from './relativeTime.js'
import { DeleteReportDialog, SharingDialog } from './ReportActionDialogs.jsx'
import { ReportRowActions } from './ReportRowActions.jsx'
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
    UPDATED: 'lastUpdated',
}

/* Who wrote the report. `createdBy` is the author and never changes hands,
 * which is what a list is for — sharing's `owner` is about who may change the
 * report, and is an id rather than a name. */
const authorName = (report) => report.createdBy?.displayName || ''

const sortValue = (report, column) => {
    switch (column) {
        case COLUMNS.CREATED_BY:
            return authorName(report).toLowerCase()
        case COLUMNS.UPDATED:
            return report.lastUpdated || ''
        default:
            return (report.displayName || '').toLowerCase()
    }
}

const nextDirection = (direction) => (direction === 'asc' ? 'desc' : 'asc')

/*
 * The list is held whole in memory, so paging it is a matter of showing less
 * of it at a time rather than asking the server for more. Same sizes as the
 * cards on the landing page, so the two lists of the same reports behave
 * alike.
 *
 * DEMO ONLY — the default is five so the pager is visible on a database with
 * a handful of reports. Put this back to 50 and drop '5' from the sizes
 * before this is anything but a prototype.
 */
const DEFAULT_PAGE_SIZE = 5
const PAGE_SIZES = ['5', '25', '50', '100']

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
    /* The demo designs sit in the list alongside the instance's own reports. */
    const reports = useMemo(
        () => [
            ...DEMO_REPORTS,
            ...(reportsResult.data?.reports?.reports ?? []),
        ],
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
    /*
     * By name. Nothing the server knows about a report says which one you
     * came here for, so the list opens in the order you can scan.
     */
    const [sort, setSort] = useState({
        column: COLUMNS.NAME,
        direction: 'asc',
    })

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

    const [dialog, setDialog] = useState(null)
    const closeDialog = useCallback(() => setDialog(null), [])
    /* Editing is a page of its own, not a dialog: the form is long, and it
     * deserves a URL you can come back to. */
    const openEdit = useCallback(
        (subject) => history.push(`${basePath}/${subject.id}/edit`),
        [history]
    )
    const openSharing = useCallback(
        (subject) => setDialog({ kind: 'sharing', report: subject }),
        []
    )
    const openDelete = useCallback(
        (subject) => setDialog({ kind: 'delete', report: subject }),
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

    /*
     * Clamped rather than trusted: a search that narrows the list under the
     * page you were on has to land on the last real page instead of an empty
     * table.
     */
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
    const currentPage = Math.min(page, pageCount)

    /*
     * Shown once the list is longer than the smallest page it could be cut
     * into, rather than longer than the current page: picking 100 on a list
     * of sixty would otherwise take the pager away with it and leave no way
     * back to a shorter page.
     */
    const showPager = rows.length > Math.min(pageSize, Number(PAGE_SIZES[0]))

    const pagedRows = useMemo(
        () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [rows, currentPage, pageSize]
    )

    const open = (report) => history.push(`${basePath}/${report.id}`)

    /* Reordering the whole list makes the page you were on meaningless, so
     * sorting starts again from the top — as does a new search. */
    const onSort = (column) => {
        setPage(1)
        setSort((current) => ({
            column,
            direction:
                current.column === column
                    ? nextDirection(current.direction)
                    : 'asc',
        }))
    }

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
                <ReportBreadcrumb leaf={i18n.t('Manage standard reports')} />
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
                                onChange={({ value }) => {
                                    setSearch(value)
                                    setPage(1)
                                }}
                                placeholder={i18n.t('Search by name')}
                            />
                        </div>

                        {/*
                         * At the far end of the row that governs the list,
                         * not in the page's bar: it acts on the list, and the
                         * bar above belongs to the page.
                         */}
                        {canCreate && (
                            <div className={styles.browseNew}>
                                <Button
                                    small
                                    onClick={() =>
                                        history.push(`${basePath}/new`)
                                    }
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
                                        {header(
                                            COLUMNS.CREATED_BY,
                                            i18n.t('Created by'),
                                            '180px'
                                        )}
                                        {header(
                                            COLUMNS.UPDATED,
                                            i18n.t('Last updated'),
                                            '140px'
                                        )}
                                        <DataTableColumnHeader width="290px">
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
                                    {pagedRows.map((report) => (
                                        <DataTableRow
                                            key={report.id}
                                            className={styles.browseRow}
                                            onClick={() => open(report)}
                                        >
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
                                            >
                                                {authorName(report) || '—'}
                                            </DataTableCell>

                                            <DataTableCell
                                                className={styles.browseCell}
                                            >
                                                {when(report.lastUpdated) ||
                                                    '—'}
                                            </DataTableCell>

                                            <DataTableCell
                                                align="right"
                                                /* The actions are their own
                                                 * targets, not a way into
                                                 * the report. */
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                            >
                                                <ReportRowActions
                                                    report={report}
                                                    onView={open}
                                                    onEdit={openEdit}
                                                    onShare={openSharing}
                                                    onDelete={openDelete}
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

                    {/*
                     * Outside the scrolling area, so the pager stays where it
                     * is while the table moves under it — a control that
                     * scrolled away from the rows it governs would be a
                     * control you have to go and find.
                     */}
                    {!reportsResult.loading &&
                        !reportsResult.error &&
                        showPager && (
                            <div className={styles.browsePager}>
                                <Pagination
                                    className={styles.browsePagination}
                                    page={currentPage}
                                    pageSize={pageSize}
                                    pageCount={pageCount}
                                    pageLength={pagedRows.length}
                                    total={rows.length}
                                    pageSizes={PAGE_SIZES}
                                    onPageChange={setPage}
                                    onPageSizeChange={(size) => {
                                        setPageSize(size)
                                        /* The first row of the old page is not on
                                         * the same page at a new size, so a resize
                                         * starts again from the top. */
                                        setPage(1)
                                    }}
                                />
                            </div>
                        )}
                </section>
            </div>

            {dialog?.kind === 'sharing' && dialog.report && (
                <SharingDialog report={dialog.report} onClose={closeDialog} />
            )}

            {dialog?.kind === 'delete' && dialog.report && (
                <DeleteReportDialog
                    report={dialog.report}
                    onClose={closeDialog}
                />
            )}
        </div>
    )
}
