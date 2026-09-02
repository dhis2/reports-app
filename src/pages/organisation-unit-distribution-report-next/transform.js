import i18n from '@dhis2/d2-i18n'
import { FONT_FAMILY } from '../../config/style.config.js'

/*
 * The orgUnitAnalytics response, turned into the two things this page shows.
 *
 * The response is a small table: `headers` names the columns, with one of them
 * called `ou`, and `rows` holds arrays of strings in the same order. Values
 * come back as strings, and a group with no units in a given org unit comes
 * back empty rather than as "0".
 *
 * The one thing worth knowing about the shape: asking for `ou=<parentId>`
 * counts every unit in that parent's whole subtree, so the selected unit's own
 * row is the grand total of the rows beneath it, not a peer of them. The
 * current page renders it as an ordinary row sorted last; here it is separated
 * out, because that is what it actually is.
 */

const OU_HEADER = 'ou'

/** Empty cells mean no units, and every count is a whole number. */
const toCount = (cell) => {
    const count = parseInt(cell, 10)
    return Number.isFinite(count) ? count : 0
}

/*
 * Rows carry org unit names rather than ids, so the selected unit's row can
 * only be found by name. A child that shares its parent's name would be
 * mistaken for it — vanishingly rare, and the cost is one row shown as the
 * total instead of beside its siblings.
 */
const sameName = (a, b) => a.toLowerCase() === b.toLowerCase()

/**
 * @param {Object} data - an orgUnitAnalytics response
 * @param {Object} options
 * @param {String} options.orgUnitName - display name of the selected unit,
 *   whose row is the subtree total
 * @returns {{columns: Array, rows: Array, totalRow: ?Object}}
 */
export const toTable = (data, { orgUnitName = '' } = {}) => {
    const headers = data?.headers ?? []

    /*
     * By name rather than by position: the endpoint puts `ou` first today, and
     * nothing here depends on it staying there.
     */
    const ouIndex = Math.max(
        headers.findIndex((header) => header.name === OU_HEADER),
        0
    )

    const columns = headers
        .map((header, index) => ({
            id: header.name,
            label: header.column,
            index,
        }))
        .filter((column) => column.index !== ouIndex)

    const rows = (data?.rows ?? []).map((cells) => {
        const counts = columns.map((column) => toCount(cells[column.index]))

        return {
            name: cells[ouIndex] ?? '',
            counts,
            total: counts.reduce((sum, count) => sum + count, 0),
        }
    })

    const totalIndex = orgUnitName
        ? rows.findIndex((row) => sameName(row.name, orgUnitName))
        : -1

    return {
        columns: columns.map(({ id, label }) => ({ id, label })),
        rows: rows
            .filter((row, index) => index !== totalIndex)
            .sort((a, b) => a.name.localeCompare(b.name)),
        totalRow: totalIndex === -1 ? null : rows[totalIndex],
    }
}

/** A report that ran but found nothing — no columns, or nothing but zeroes. */
export const isEmptyTable = (table) => {
    if (!table || table.columns.length === 0) {
        return true
    }

    const rows = table.totalRow ? [...table.rows, table.totalRow] : table.rows
    return rows.every((row) => row.total === 0)
}

/** How many org units the report covers. */
export const coveredUnitCount = (table) =>
    table?.totalRow
        ? table.totalRow.total
        : (table?.rows ?? []).reduce((sum, row) => sum + row.total, 0)

/*
 * A categorical palette, one colour per group. @dhis2/ui has five hues, so
 * eight series take two tones of some of them; past eight the list repeats,
 * which is the right failure for a chart nobody can read at that point
 * anyway. Ordered for contrast between neighbours, since stacked segments sit
 * against each other.
 */
export const PALETTE = [
    '#147cd7', // blue600
    '#ff8302', // yellow600
    '#00796b', // teal600
    '#c62828', // red600
    '#388e3c', // green600
    '#0d47a1', // blue800
    '#bb460d', // yellow800
    '#004d40', // teal800
]

const colourFor = (index) => PALETTE[index % PALETTE.length]

/*
 * chart.js 2.x, so options are the flat v2 shape (`title`, `legend`,
 * `scales.xAxes`) rather than the v3 `plugins` one.
 */
const baseOptions = (title) => ({
    title: {
        display: Boolean(title),
        text: title,
        fontSize: '16',
        fontFamily: FONT_FAMILY,
    },
    legend: {
        position: 'bottom',
        fontFamily: FONT_FAMILY,
    },
    animation: {
        duration: 180,
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
    },
})

/**
 * The same numbers as the table, drawn.
 *
 * One stacked bar per org unit beneath the selected one, split by group. The
 * selected unit's own row is deliberately left out: it is the total of the
 * bars beside it, so stacking it among them would double the chart's height
 * and say the hierarchy is twice its size.
 *
 * A unit with nothing under it has no bars to draw that way, so it falls back
 * to a bar per group for its own row — which is exactly what the current
 * page's chart shows.
 *
 * @returns {?{data: Object, options: Object}} null when there is nothing to draw
 */
export const toChart = (table, { title = '' } = {}) => {
    if (!table || table.columns.length === 0) {
        return null
    }

    if (table.rows.length > 0) {
        return {
            data: {
                labels: table.rows.map((row) => row.name),
                datasets: table.columns.map((column, columnIndex) => ({
                    label: column.label,
                    backgroundColor: colourFor(columnIndex),
                    borderWidth: 0,
                    data: table.rows.map((row) => row.counts[columnIndex]),
                })),
            },
            options: {
                ...baseOptions(title),
                scales: {
                    xAxes: [{ stacked: true }],
                    yAxes: [
                        {
                            stacked: true,
                            ticks: { beginAtZero: true, precision: 0 },
                        },
                    ],
                },
            },
        }
    }

    if (!table.totalRow) {
        return null
    }

    return {
        data: {
            labels: table.columns.map((column) => column.label),
            datasets: [
                {
                    label: i18n.t('Organisation units'),
                    backgroundColor: table.columns.map((column, index) =>
                        colourFor(index)
                    ),
                    borderWidth: 0,
                    data: table.totalRow.counts,
                },
            ],
        },
        options: {
            ...baseOptions(title),
            legend: { display: false },
            scales: {
                yAxes: [{ ticks: { beginAtZero: true, precision: 0 } }],
            },
        },
    }
}
