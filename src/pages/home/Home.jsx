import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputField, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
 * searched and sorted by the same controls — the heading is the only thing
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
 * of the grid and offered as the link beside the custom reports heading.
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

const SORT = {
    NAME: 'name',
    NAME_DESC: 'name-desc',
    RECENT: 'recent',
}

const readShowPlugins = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

const byName = (a, b) => a.name.localeCompare(b.name)

/* One search and one sort, applied to each grid in turn. */
const arrange = (cards, term, sort) => {
    const filtered = term
        ? cards.filter(
              (card) =>
                  card.name.toLowerCase().includes(term) ||
                  card.description?.toLowerCase().includes(term)
          )
        : cards

    return [...filtered].sort((a, b) => {
        if (sort === SORT.NAME_DESC) {
            return byName(b, a)
        }

        if (sort === SORT.RECENT) {
            /* Never opened sorts to the bottom, alphabetically among itself —
             * an empty timestamp is smaller than any date. */
            if (a.lastUsed === b.lastUsed) {
                return byName(a, b)
            }

            return a.lastUsed > b.lastUsed ? -1 : 1
        }

        return byName(a, b)
    })
}

const Home = () => {
    const [showPlugins] = useState(readShowPlugins)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(SORT.NAME)

    /*
     * Read once, on arrival: a grid that reshuffled itself under the cursor
     * because a report was opened in another tab would be worse than one
     * that is a moment out of date.
     */
    const [lastUsed] = useState(readLastUsed)

    const reportsResult = useDataQuery(REPORTS_QUERY)

    /* Both kinds of card, in the same shape, so the search and the sort never
     * have to know which grid they are working on. */
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
                description: report.createdBy?.displayName
                    ? i18n.t('Designed by {{name}}', {
                          name: report.createdBy.displayName,
                      })
                    : i18n.t('Standard report'),
                path: `${standardReportPath}/${report.id}`,
                lastUsed: lastUsed[report.id] || '',
            })),
        [reportsResult.data, lastUsed]
    )

    const term = search.trim().toLowerCase()
    const isSearching = Boolean(term)

    const visibleBuiltIn = useMemo(
        () => arrange(builtIn, term, sort),
        [builtIn, term, sort]
    )
    const visibleCustom = useMemo(
        () => arrange(custom, term, sort),
        [custom, term, sort]
    )

    const shown = visibleBuiltIn.length + visibleCustom.length
    const total = builtIn.length + custom.length

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
                            <p
                                className={styles.description}
                                data-test="section-description"
                            >
                                {card.description}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )

    return (
        <div id="menu-grid-id" className={styles.page}>
            <header className={styles.intro}>
                <h1 className={styles.title}>{i18n.t('Reports')}</h1>
            </header>

            {/* Search at the start of the row, sort at the end: one acts on
             * what is in the grids, the other on how they are laid out. */}
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <InputField
                        dense
                        type="search"
                        value={search}
                        onChange={({ value }) => setSearch(value)}
                        placeholder={i18n.t('Search reports')}
                    />
                </div>

                {/*
                 * Only while searching. A permanent count is a number nobody
                 * asked for; a count under a search is the answer to "did
                 * that find anything".
                 */}
                {isSearching && (
                    <p className={styles.count}>
                        {i18n.t('{{count}} of {{total}} reports', {
                            count: shown,
                            total,
                        })}
                    </p>
                )}

                {/* A plain label beside the select, rather than the field's
                 * own label above it, so the control sits on the same line as
                 * the search box. */}
                <div className={styles.sort}>
                    <span className={styles.sortLabel}>
                        {i18n.t('Sort by')}
                    </span>
                    <div className={styles.sortSelect}>
                        <SingleSelect
                            dense
                            selected={sort}
                            onChange={({ selected }) => setSort(selected)}
                        >
                            <SingleSelectOption
                                value={SORT.NAME}
                                label={i18n.t('Name (A–Z)')}
                            />
                            <SingleSelectOption
                                value={SORT.NAME_DESC}
                                label={i18n.t('Name (Z–A)')}
                            />
                            <SingleSelectOption
                                value={SORT.RECENT}
                                label={i18n.t('Recently used')}
                            />
                        </SingleSelect>
                    </div>
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
                            {i18n.t('Custom reports')}
                        </h2>
                        {/* The standard report list, which has the columns and
                         * the actions this grid deliberately does not. */}
                        <Link
                            className={styles.groupLink}
                            to={standardReportPath}
                        >
                            {i18n.t('Manage standard reports')}
                        </Link>
                    </div>
                    {cardsFor(visibleCustom)}
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
