import i18n from '@dhis2/d2-i18n'
import { TableRowHead, TableCellHead } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useMetadata, selectors } from '../../shared/index.js'
import { useActiveCell } from '../data-entry-cell/index.js'
import styles from '../table-body.module.css'
import { PaddingCell } from './padding-cell.jsx'
import { TotalHeader } from './total-cells.jsx'

// Computes the span and columns to render in each category-row
// columns are category-options, and needs to be repeated in case of multiple categories
const useCategoryColumns = (categories, numberOfCoCs) => {
    const { data: metadata } = useMetadata()
    return useMemo(() => {
        let catColSpan = numberOfCoCs
        return categories.map((c) => {
            const categoryOptions = selectors.getCategoryOptionsByCategoryId(
                metadata,
                c.id
            )
            const nrOfOptions = c.categoryOptions.length
            // catColSpan should always be equal to nrOfOptions in last iteration
            // unless anomaly with categoryOptionCombo-generation server-side
            if (nrOfOptions > 0 && catColSpan >= nrOfOptions) {
                // calculate colSpan for current options
                // this is the span for each option, not the "total" span of the row
                catColSpan = catColSpan / nrOfOptions
                // when table have multiple categories, options need to be repeated for each disaggregation "above" current-category
                const repeat = numberOfCoCs / (catColSpan * nrOfOptions)

                const columnsToRender = new Array(repeat)
                    .fill(0)
                    .flatMap(() => categoryOptions)

                return {
                    span: catColSpan,
                    columns: columnsToRender,
                    category: c,
                }
            } else {
                console.warn(
                    `Category ${c.displayFormName} malformed. Number of options: ${nrOfOptions}, span: ${catColSpan}`
                )
            }
            return c
        })
    }, [metadata, categories, numberOfCoCs])
}

export const CategoryComboTableBodyHeader = ({
    renderRowTotals,
    paddingCells,
    categoryOptionCombos,
    categories,
    checkTableActive,
    hideRowTotalsDueToNonNumberValueTypes,
}) => {
    const { deId: activeDeId, cocId: activeCocId } = useActiveCell()

    const rowToColumnsMap = useCategoryColumns(
        categories,
        categoryOptionCombos.length
    )

    // Find if this column header includes the active cell's column
    const isHeaderActive = (headerIdx, headerColSpan) => {
        const activeCellColIdx = categoryOptionCombos.findIndex(
            (coc) => activeCocId === coc.id
        )
        const idxDiff = activeCellColIdx - headerIdx * headerColSpan
        return (
            checkTableActive(activeDeId) &&
            idxDiff < headerColSpan &&
            idxDiff >= 0
        )
    }

    return rowToColumnsMap.map((colInfo, colInfoIndex) => {
        const { span, columns, category } = colInfo
        return (
            <TableRowHead key={category.id}>
                <TableCellHead
                    className={styles.categoryNameHeader}
                    colSpan={'1'}
                >
                    {category.displayFormName !== 'default' &&
                        category.displayFormName}
                </TableCellHead>
                {columns.map((co, columnIndex) => {
                    return (
                        <TableCellHead
                            key={columnIndex}
                            className={cx(styles.tableHeader, {
                                [styles.active]: isHeaderActive(
                                    columnIndex,
                                    span
                                ),
                            })}
                            colSpan={span.toString()}
                        >
                            {co.isDefault
                                ? i18n.t('Value')
                                : co.displayFormName ?? co.displayName}
                        </TableCellHead>
                    )
                })}
                {paddingCells.map((_, i) => (
                    <PaddingCell key={i} />
                ))}
                {renderRowTotals && colInfoIndex === 0 && (
                    <>
                        {hideRowTotalsDueToNonNumberValueTypes ? (
                            <PaddingCell key={'total_header_padding'} />
                        ) : (
                            <TotalHeader rowSpan={categories.length} />
                        )}
                    </>
                )}
            </TableRowHead>
        )
    })
}

CategoryComboTableBodyHeader.propTypes = {
    categories: PropTypes.array,
    // Note that this must be the sorted categoryoOptionCombos, eg. in the same order as they are rendered
    categoryOptionCombos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
        })
    ),
    checkTableActive: PropTypes.func,
    hideRowTotalsDueToNonNumberValueTypes: PropTypes.bool,
    paddingCells: PropTypes.array,
    renderRowTotals: PropTypes.bool,
}
