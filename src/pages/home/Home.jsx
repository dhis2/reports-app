import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, IconSearch16, InputField, Pagination } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { navGroups } from '../../components/shell/navigation.js'
import {
    COLD_CHAIN_FRIDGE_LOG_SECTION_KEY,
    MALARIA_WEEKLY_BULLETIN_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
    sections,
} from '../../config/sections.config.js'
import { DEMO_REPORTS } from '../standard-report-next/demoReports.js'
import { readLastUsed } from '../standard-report-next/lastUsed.js'
import { REPORTS_QUERY } from '../standard-report-next/queries.js'
import styles from './Home.module.css'

/*
 * The landing page. One card per report, under two headings that answer
 * "where did this report come from": the ones the app itself builds, and the
 * ones someone on the instance designed. Both kinds are cards and both are
 * searched by the same control — the heading is the only thing
 * that separates them, because it is the only real difference from here.
 *
 * The built-in list comes from the same navigation source as the breadcrumb,
 * so the two can never disagree.
 */
const items = navGroups.flatMap((group) => group.items)

/* Prototype only — the two "report plugin" stand-ins are kept out of the
 * grid unless the stored preference below asks for them, so a demo starts
 * with just the core reports. They sit with the built-in reports, being
 * report types rather than saved designs. */
const PLUGIN_KEYS = [
    COLD_CHAIN_FRIDGE_LOG_SECTION_KEY,
    MALARIA_WEEKLY_BULLETIN_SECTION_KEY,
]

/*
 * The standard report section itself is not a report — it is the list of
 * them, and every report on it already has a card below. So it is left out
 * of the grid and offered as the link beside the standard reports heading.
 */
const BUILT_IN_EXCLUDED = [STANDARD_REPORT_NEXT_SECTION_KEY]

/*
 * Whether the plugin cards are shown is a per-viewer preference, read from
 * local storage. There is no control for it on the page: a demo turns it on
 * from the console, and everyone else never sees the stand-ins.
 */
const STORAGE_KEY = 'reports-app:home:show-plugins'

/* Every standard report gets its own card, linking straight to the report
 * rather than to the list that would have found it. */
const standardReportPath = sections[STANDARD_REPORT_NEXT_SECTION_KEY].path

/*
 * Standard reports are the one group that can grow without limit — they are
 * whatever the instance happens to have designed — so that grid is paged
 * while the built-in one, a fixed handful, is not.
 *
 * Fifty is the real page size: roughly the point at which the grid stops
 * being something you scan and starts being something you scroll past. The
 * size select is there for instances where a wider page is genuinely easier
 * to search by eye.
 *
 * DEMO ONLY — the default is five so the pager is visible on a database with
 * a handful of reports. Put this back to 50 and drop '5' from the sizes
 * before this is anything but a prototype.
 */
const DEFAULT_PAGE_SIZE = 5
const PAGE_SIZES = ['5', '25', '50', '100']

const readShowPlugins = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

const byName = (a, b) => a.name.localeCompare(b.name)

/* One search, applied to each grid in turn, names in order. */
const arrange = (cards, term) => {
    const filtered = term
        ? cards.filter(
              (card) =>
                  card.name.toLowerCase().includes(term) ||
                  card.description?.toLowerCase().includes(term)
          )
        : cards

    return [...filtered].sort(byName)
}

const Home = () => {
    const history = useHistory()
    const location = useLocation()
    const [showPlugins] = useState(readShowPlugins)

    /*
     * The search lives in the URL — ?q= — so a set of results is linkable and
     * comes back with the back button after opening one of them. Typing
     * replaces the entry rather than pushing one, so back leaves the page
     * instead of walking a keystroke at a time.
     */
    const search = new URLSearchParams(location.search).get('q') || ''

    const setSearch = (value) => {
        const params = new URLSearchParams(location.search)

        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }

        /* A new search is a new set of results, so it starts at its first
         * page rather than at whichever page the last search was left on. */
        params.delete('page')

        const query = params.toString()
        history.replace(
            query ? `${location.pathname}?${query}` : location.pathname
        )
    }

    /*
     * The page number rides in the URL beside the search, for the same
     * reason: a link to these results should come back to the same screen.
     * Like the search it replaces the history entry, so back leaves the page
     * rather than walking through every page you stepped over.
     */
    const requestedPage =
        Number(new URLSearchParams(location.search).get('page')) || 1

    const setPage = (value) => {
        const params = new URLSearchParams(location.search)

        if (value > 1) {
            params.set('page', String(value))
        } else {
            params.delete('page')
        }

        const query = params.toString()
        history.replace(
            query ? `${location.pathname}?${query}` : location.pathname
        )
    }

    /* The size is a viewing preference rather than part of the result set, so
     * it stays out of the URL. */
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

    /*
     * Read once, on arrival: a grid that reshuffled itself under the cursor
     * because a report was opened in another tab would be worse than one
     * that is a moment out of date.
     */
    const [lastUsed] = useState(readLastUsed)

    const reportsResult = useDataQuery(REPORTS_QUERY)

    /* Both kinds of card, in the same shape, so the search never has to know
     * which grid it is working on. */
    const builtIn = useMemo(
        () =>
            items
                .filter(
                    (item) =>
                        !BUILT_IN_EXCLUDED.includes(item.key) &&
                        (showPlugins || !PLUGIN_KEYS.includes(item.key))
                )
                .map((item) => {
                    const { info } = sections[item.key]

                    return {
                        id: item.key,
                        name: info.label,
                        description: item.question || info.description,
                        path: item.path,
                        lastUsed: lastUsed[item.key] || '',
                    }
                }),
        [showPlugins, lastUsed]
    )

    const custom = useMemo(
        () =>
            [
                ...DEMO_REPORTS,
                ...(reportsResult.data?.reports?.reports ?? []),
            ].map((report) => ({
                id: report.id,
                name: report.displayName,
                /* The name is the whole card — who made it is list detail. */
                description: '',
                path: `${standardReportPath}/${report.id}`,
                lastUsed: lastUsed[report.id] || '',
            })),
        [reportsResult.data, lastUsed]
    )

    const term = search.trim().toLowerCase()
    const isSearching = Boolean(term)

    const visibleBuiltIn = useMemo(
        () => arrange(builtIn, term),
        [builtIn, term]
    )
    const visibleCustom = useMemo(() => arrange(custom, term), [custom, term])

    /*
     * Clamped rather than trusted: ?page=99 on a two-page list, or a search
     * that narrows the list under the page you were on, must land on the last
     * real page instead of an empty grid.
     */
    const pageCount = Math.max(1, Math.ceil(visibleCustom.length / pageSize))
    const page = Math.min(Math.max(1, Math.floor(requestedPage)), pageCount)

    /*
     * Shown once the list is longer than the smallest page it could be cut
     * into, rather than longer than the current page: picking 100 on a list
     * of sixty would otherwise take the pager away with it and leave no way
     * back to a shorter page.
     */
    const showPager =
        visibleCustom.length > Math.min(pageSize, Number(PAGE_SIZES[0]))

    const pagedCustom = useMemo(
        () => visibleCustom.slice((page - 1) * pageSize, page * pageSize),
        [visibleCustom, page, pageSize]
    )

    const shown = visibleBuiltIn.length + visibleCustom.length

    const cardsFor = (cards) => (
        <div className={styles.grid}>
            {cards.map((card) => (
                <Link
                    key={card.id}
                    to={card.path}
                    className={styles.cardLink}
                    data-test="menu-element"
                >
                    <div className={styles.card}>
                        <div className={styles.body}>
                            <h3 className={styles.name}>{card.name}</h3>
                            {card.description && (
                                <p
                                    className={styles.description}
                                    data-test="section-description"
                                >
                                    {card.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )

    return (
        <div id="menu-grid-id" className={styles.page}>
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <InputField
                        dense
                        type="search"
                        prefixIcon={<IconSearch16 />}
                        value={search}
                        onChange={({ value }) => setSearch(value)}
                        placeholder={i18n.t('Search reports')}
                    />
                </div>
            </div>

            {/* A heading with nothing under it says a group is empty when it
             * is only filtered out, so both groups go with their cards. */}
            {visibleBuiltIn.length > 0 && (
                <section className={styles.group}>
                    <div className={styles.groupHeader}>
                        <h2 className={styles.groupTitle}>
                            {i18n.t('Built-in reports')}
                        </h2>
                    </div>
                    {cardsFor(visibleBuiltIn)}
                </section>
            )}

            {visibleCustom.length > 0 && (
                <section className={styles.group}>
                    <div className={styles.groupHeader}>
                        <h2 className={styles.groupTitle}>
                            {i18n.t('Standard reports')}
                        </h2>
                        {/* The standard report list, which has the columns and
                         * the actions this grid deliberately does not. */}
                        <Button
                            small
                            className={styles.groupAction}
                            onClick={() => history.push(standardReportPath)}
                        >
                            {i18n.t('Manage')}
                        </Button>
                    </div>
                    {cardsFor(pagedCustom)}

                    {showPager && (
                        <div className={styles.pager}>
                            <Pagination
                                className={styles.pagination}
                                page={page}
                                pageSize={pageSize}
                                pageCount={pageCount}
                                pageLength={pagedCustom.length}
                                total={visibleCustom.length}
                                pageSizes={PAGE_SIZES}
                                onPageChange={setPage}
                                onPageSizeChange={(size) => {
                                    setPageSize(size)
                                    /* The first row of the old page is not
                                     * on the same page at a new size, so a
                                     * resize starts again from the top. */
                                    setPage(1)
                                }}
                            />
                        </div>
                    )}
                </section>
            )}

            {isSearching && shown === 0 && (
                <p className={styles.empty}>
                    {i18n.t('No reports match “{{term}}”.', {
                        term: search.trim(),
                    })}
                </p>
            )}
        </div>
    )
}

export default Home
