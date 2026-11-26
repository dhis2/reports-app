import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableFoot,
    DataTableHead,
    DataTableRow,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './OrgUnitDistReportNext.module.css'

/* Kept in step with the width rules in OrgUnitDistReportNext.module.css. */
const NAME_COLUMN_WIDTH = 260
const VALUE_COLUMN_WIDTH = 100

/**
 * The distribution as a table: one row per org unit directly beneath the one
 * you asked about, one column per group in the group set, and a Total column.
 *
 * The selected unit's own row is the count over its whole subtree, so it sits
 * in the table's foot as the total rather than among the rows it totals.
 */
export const DistributionTable = ({ table }) => {
    /* The Total column is ours, so it is counted on top of the columns. */
    const columnCount = table.columns.length + 1

    return (
        <div
            className={styles.tableScroll}
            style={{
                '--table-min-width': `${
                    NAME_COLUMN_WIDTH + columnCount * VALUE_COLUMN_WIDTH
                }px`,
            }}
        >
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader align="left">
                            {i18n.t('Organisation unit')}
                        </DataTableColumnHeader>
                        {table.columns.map((column) => (
                            <DataTableColumnHeader
                                key={column.id}
                                align="right"
                            >
                                {column.label}
                            </DataTableColumnHeader>
                        ))}
                        <DataTableColumnHeader align="right">
                            {i18n.t('Total')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>

                <DataTableBody>
                    {table.rows.map((row) => (
                        <DataTableRow key={row.name}>
                            <DataTableCell align="left">
                                {row.name}
                            </DataTableCell>
                            {row.counts.map((count, index) => (
                                <DataTableCell
                                    key={table.columns[index].id}
                                    align="right"
                                >
                                    <span className={styles.figure}>
                                        {count === 0 ? '–' : count}
                                    </span>
                                </DataTableCell>
                            ))}
                            <DataTableCell align="right">
                                <span
                                    className={`${styles.figure} ${styles.rowTotal}`}
                                >
                                    {row.total}
                                </span>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>

                {table.totalRow && (
                    <DataTableFoot>
                        <DataTableRow>
                            <DataTableCell align="left">
                                {/*
                                 * "All of Bo" only says something when there
                                 * are rows above it that are part of Bo. A
                                 * unit with nothing under it is the whole
                                 * report on its own, so it goes by its name.
                                 */}
                                <span className={styles.totalLabel}>
                                    {table.rows.length > 0
                                        ? i18n.t('All of {{name}}', {
                                              name: table.totalRow.name,
                                          })
                                        : table.totalRow.name}
                                </span>
                            </DataTableCell>
                            {table.totalRow.counts.map((count, index) => (
                                <DataTableCell
                                    key={table.columns[index].id}
                                    align="right"
                                >
                                    <span
                                        className={`${styles.figure} ${styles.rowTotal}`}
                                    >
                                        {count}
                                    </span>
                                </DataTableCell>
                            ))}
                            <DataTableCell align="right">
                                <span
                                    className={`${styles.figure} ${styles.rowTotal}`}
                                >
                                    {table.totalRow.total}
                                </span>
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableFoot>
                )}
            </DataTable>
        </div>
    )
}

DistributionTable.propTypes = {
    table: PropTypes.shape({
        columns: PropTypes.array.isRequired,
        rows: PropTypes.array.isRequired,
        totalRow: PropTypes.object,
    }).isRequired,
}
