import { TableBody, TableCell, TableRow } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import { selectors, useMetadata, NUMBER_TYPES } from '../../shared/index.js'
import { DataEntryCell, DataEntryField } from '../data-entry-cell/index.js'
import { getFieldId } from '../get-field-id.jsx'
import { TableBodyHiddenByFiltersRow } from '../table-body-hidden-by-filter-row.jsx'
import styles from '../table-body.module.css'
import { CategoryComboTableBodyHeader } from './category-combo-table-body-header.jsx'
import { DataElementCell } from './data-element-cell.jsx'
import { ColumnTotals, RowTotal } from './total-cells.jsx'

export const CategoryComboTableBody = React.memo(
    function CategoryComboTableBody({
        categoryCombo,
        dataElements,
        filterText,
        globalFilterText,
        greyedFields,
        maxColumnsInSection,
        renderRowTotals,
        renderColumnTotals,
        collapsed,
    }) {
        const { data: metadata } = useMetadata()

        const categories = selectors.getCategoriesByCategoryComboId(
            metadata,
            categoryCombo.id
        )

        const sortedCOCs = selectors.getSortedCoCsByCatComboId(
            metadata,
            categoryCombo.id
        )

        const checkTableActive = useCallback(
            (activeDeId) => dataElements.some(({ id }) => id === activeDeId),
            [dataElements]
        )

        const paddingCells =
            maxColumnsInSection > 0
                ? new Array(maxColumnsInSection - sortedCOCs.length).fill(0)
                : []

        const filteredDeIds = new Set()
        // filter out elements that do not match filterText
        dataElements.forEach((de) => {
            const name = de.displayFormName.toLowerCase()
            if (
                (filterText && !name.includes(filterText.toLowerCase())) ||
                (globalFilterText &&
                    !name.includes(globalFilterText.toLowerCase()))
            ) {
                filteredDeIds.add(de.id)
            }
        })
        const hiddenItemsCount = filteredDeIds.size

        const {
            hasNonNumberValueType: hideColumnTotalsDueToNonNumberValueType,
            allAreNonNumberValueType: hideRowTotalsDueToNonNumberValueTypes,
        } = useMemo(() => {
            const hasNonNumberValueType = dataElements
                .map(({ valueType }) => valueType)
                .some((valueType) => !NUMBER_TYPES.includes(valueType))
            const allAreNonNumberValueType = dataElements
                .map(({ valueType }) => valueType)
                .every((valueType) => !NUMBER_TYPES.includes(valueType))
            return { hasNonNumberValueType, allAreNonNumberValueType }
        }, [dataElements])

        return (
            <TableBody
                className={cx({
                    [styles.sectionRowCollapsed]: collapsed,
                })}
            >
                <CategoryComboTableBodyHeader
                    categoryOptionCombos={sortedCOCs}
                    categories={categories}
                    renderRowTotals={renderRowTotals}
                    hideRowTotalsDueToNonNumberValueTypes={
                        hideRowTotalsDueToNonNumberValueTypes
                    }
                    paddingCells={paddingCells}
                    checkTableActive={checkTableActive}
                />
                {dataElements.map((de, i) => {
                    const hidden = filteredDeIds.has(de.id)
                    return (
                        <TableRow
                            dataTest={cx('dhis2-dataentry-tableinputrow', {
                                ['dhis2-dataentry-tableinputrow-hidden']:
                                    hidden,
                            })}
                            key={de.id}
                            className={cx({ [styles.hidden]: hidden })}
                        >
                            <DataElementCell dataElement={de} />
                            {sortedCOCs.map((coc) => (
                                <DataEntryCell key={coc.id}>
                                    <DataEntryField
                                        dataElement={de}
                                        categoryOptionCombo={coc}
                                        disabled={greyedFields?.has(
                                            getFieldId(de.id, coc.id)
                                        )}
                                    />
                                </DataEntryCell>
                            ))}
                            {paddingCells.map((_, i) => (
                                <PaddingCell
                                    key={i}
                                    className={styles.tableCell}
                                />
                            ))}
                            {renderRowTotals && (
                                <>
                                    {NUMBER_TYPES.includes(de.valueType) ? (
                                        <RowTotal
                                            dataElements={dataElements}
                                            categoryOptionCombos={sortedCOCs}
                                            row={i}
                                        />
                                    ) : (
                                        <PaddingCell
                                            key={'total_replacement_padding'}
                                            className={styles.tableCell}
                                        />
                                    )}
                                </>
                            )}
                        </TableRow>
                    )
                })}
                {renderColumnTotals &&
                    !hideColumnTotalsDueToNonNumberValueType && (
                        <ColumnTotals
                            paddingCells={paddingCells}
                            renderTotalSum={
                                renderRowTotals && renderColumnTotals
                            }
                            dataElements={dataElements}
                            categoryOptionCombos={sortedCOCs}
                        />
                    )}
                {hiddenItemsCount > 0 && (
                    <TableBodyHiddenByFiltersRow
                        hiddenItemsCount={hiddenItemsCount}
                    />
                )}
            </TableBody>
        )
    }
)

CategoryComboTableBody.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    collapsed: PropTypes.bool,
    dataElements: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            categoryCombo: PropTypes.shape({
                id: PropTypes.string,
            }),
            displayFormName: PropTypes.string,
            valueType: PropTypes.string,
        })
    ),
    filterText: PropTypes.string,
    globalFilterText: PropTypes.string,
    /** Greyed fields is a Set where .has(fieldId) is true if that field is greyed/disabled */
    greyedFields: PropTypes.instanceOf(Set),
    maxColumnsInSection: PropTypes.number,
    renderColumnTotals: PropTypes.bool,
    renderRowTotals: PropTypes.bool,
}

const PaddingCell = () => (
    <TableCell
        className={styles.paddingCell}
        dataTest="dhis2-dataentry-paddingcell"
    ></TableCell>
)
