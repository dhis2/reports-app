import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DataSetReportNext.module.css'

/**
 * Reshape the report response for rendering.
 *
 * `GET /api/dataSetReport` returns a top-level array, one entry per form
 * section, each shaped:
 *   { title, subtitle, headers: [{ column, name, meta, hidden, type }],
 *     rows: [[...]], width, height, ... }
 *
 * Three things in `headers` that the current page throws away by keeping only
 * `column`, and which are worth having:
 *   - `meta`   true for label columns, false for value columns. Drives
 *              alignment properly, rather than assuming column 0 is the label.
 *   - `hidden` columns the server says not to show.
 *   - `subtitle` per table, e.g. "Sierra Leone July 2025" — free context.
 *
 * Empty cells arrive as null, and numbers arrive as strings.
 */
export const transformTables = (tables = []) =>
    tables.map((table, index) => {
        const visible = (table.headers || [])
            .map((header, position) => ({ header, position }))
            .filter(({ header }) => !header.hidden)

        return {
            id: `section-${index}`,
            title: table.title,
            subtitle: table.subtitle,
            headers: visible.map(({ header }) => ({
                label: header.column || header.name,
                isLabel: Boolean(header.meta),
            })),
            rows: (table.rows || []).map((cells) =>
                visible.map(({ position }) => {
                    const cell = cells[position]
                    return cell || cell === 0 ? cell : ''
                })
            ),
        }
    })

/* Kept in step with the width rules in DataSetReportNext.module.css. */
const LABEL_COLUMN_WIDTH = 260
const VALUE_COLUMN_WIDTH = 100

/** A row whose value columns are all empty: the form has it, nobody used it. */
const isEmptyRow = (cells, headers) =>
    cells.every((cell, index) => headers[index]?.isLabel || cell === '')

export const countValues = (tables) =>
    tables.reduce(
        (total, table) =>
            total +
            table.rows.filter((cells) => !isEmptyRow(cells, table.headers))
                .length,
        0
    )

const ReportTable = ({ table }) => {
    const rows = table.rows

    return (
        <section className={styles.section} id={table.id}>
            <h2 className={styles.sectionTitle}>{table.title}</h2>

            {/*
             * Column widths are driven from here because the table uses
             * table-layout:fixed — see the note in the stylesheet for why.
             */}
            <div
                className={styles.tableScroll}
                style={{
                    '--table-min-width': `${
                        LABEL_COLUMN_WIDTH +
                        Math.max(table.headers.length - 1, 0) *
                            VALUE_COLUMN_WIDTH
                    }px`,
                }}
            >
                <DataTable>
                    <DataTableHead>
                        <DataTableRow>
                            {table.headers.map((header, index) => (
                                <DataTableColumnHeader
                                    key={`h-${table.id}-${index}`}
                                    align={header.isLabel ? 'left' : 'right'}
                                >
                                    {header.label}
                                </DataTableColumnHeader>
                            ))}
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {rows.map((cells, rowIndex) => (
                            <DataTableRow key={`r-${table.id}-${rowIndex}`}>
                                {cells.map((cell, cellIndex) => {
                                    const isLabel =
                                        table.headers[cellIndex]?.isLabel

                                    return (
                                        <DataTableCell
                                            key={`c-${table.id}-${rowIndex}-${cellIndex}`}
                                            align={isLabel ? 'left' : 'right'}
                                            bordered
                                        >
                                            {isLabel ? (
                                                cell
                                            ) : (
                                                <span className={styles.figure}>
                                                    {cell === '' ? '–' : cell}
                                                </span>
                                            )}
                                        </DataTableCell>
                                    )
                                })}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </div>
        </section>
    )
}

ReportTable.propTypes = {
    table: PropTypes.object.isRequired,
}

export const ReportTables = ({ tables }) => (
    <>
        {tables.map((table) => (
            <ReportTable key={table.id} table={table} />
        ))}
    </>
)

ReportTables.propTypes = {
    tables: PropTypes.array.isRequired,
}
