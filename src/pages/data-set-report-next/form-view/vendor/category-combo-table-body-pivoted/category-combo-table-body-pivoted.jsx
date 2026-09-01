import { TableRow, TableCell, TableCellHead } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useMetadata, selectors } from '../../shared/index.js'
import { DataEntryCell, DataEntryField } from '../data-entry-cell/index.js'
import { getFieldId } from '../get-field-id.jsx'
import { TableBodyHiddenByFiltersRow } from '../table-body-hidden-by-filter-row.jsx'
import styles from '../table-body.module.css'
import { generateFormMatrix } from './generate-form-matrix/index.js'

/**
 * This component is based on the CategoryComboTableBody, and the two should be consolidate eventually.
 * Some of the reasons for the separate component:
 * - data elements are baked into CategoryComboTableBody as rows. With pivoting, we need flexibility in defining what's a row and what's a column that wasn't easy to implement there
 * - This reliance on data elements extends to functionality such as search filters, which is disabled here as we don't have rows of data elements anymore in a pivoted table (they could be columns or rows)
 * - row headers are more complicated in this structure as they can have categories and category options
 *
 * ToDo(pivot): The plan is that - after that pivoting core functionality is finalised - to have a look at both components and consolidate them.
 * https://dhis2.atlassian.net/browse/LIBS-584
 *
 */
export const PivotedCategoryComboTableBody = React.memo(
    function PivotedCategoryComboTableBody({
        categoryCombo,
        dataElements,
        greyedFields,
        filterText,
        globalFilterText,
        /*
        maxColumnsInSection,
        renderRowTotals,
        renderColumnTotals,*/
        displayOptions,
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

        const categoryOptionsDetails = categories
            .map((c) => {
                const headerOptions = selectors.getCategoryOptionsByCategoryId(
                    metadata,
                    c.id
                )
                return [...headerOptions]
            })
            .flat()

        const filterCOCBySearch = (elementName) => {
            const search =
                displayOptions.pivotMode !== 'move_categories' &&
                filterText.toLowerCase()
            return search ? elementName.toLowerCase().includes(search) : true
        }

        const filterDataElementsBySearch = (elementName) => {
            // local search should always work on rows - so disable localSearch when transposed (filterCOCBySearch would do the filter)
            const localSearch =
                displayOptions.pivotMode === 'move_categories' &&
                filterText.toLowerCase()
            const globalSearch = globalFilterText.toLowerCase()
            return localSearch || globalSearch
                ? (localSearch &&
                      elementName.toLowerCase().includes(localSearch)) ||
                      (globalSearch &&
                          elementName.toLowerCase().includes(globalSearch))
                : true
        }

        const filteredDataElements = dataElements.filter((de) =>
            filterDataElementsBySearch(de.displayFormName)
        )
        const filteredSortedCOCS = sortedCOCs.filter((coc) =>
            filterCOCBySearch(coc.displayName)
        )

        const options = {
            metadata,
            categoryOptionsDetails,
            sortedCOCs: filteredSortedCOCS,
            totalRows: sortedCOCs.length,
            categories,
            dataElements: filteredDataElements,
        }

        const rowsMatrix = generateFormMatrix(options, displayOptions)

        const hiddenItemsCount =
            displayOptions.pivotMode === 'move_categories'
                ? dataElements.length - filteredDataElements.length
                : sortedCOCs.length - filteredSortedCOCS.length

        return (
            <>
                {rowsMatrix.map((row, id /** todo: find suitable id */) => {
                    return (
                        <TableRow
                            key={id}
                            className={classNames({
                                [styles.sectionRowCollapsed]: collapsed,
                            })}
                        >
                            {row.map((fieldInRow) => {
                                if (
                                    fieldInRow.type === 'columnHeader' ||
                                    fieldInRow.type === 'rowHeader'
                                ) {
                                    return (
                                        <TableCellHead
                                            key={fieldInRow.id}
                                            className={classNames(
                                                [
                                                    styles.pivotedHeader,
                                                    styles.noWrap,
                                                    styles[
                                                        fieldInRow.metadataType
                                                    ],
                                                ],
                                                {
                                                    [styles.dataElementRowHeader]:
                                                        fieldInRow.metadataType ===
                                                        'dataElement',
                                                }
                                            )}
                                            colSpan={fieldInRow.colSpan}
                                            rowSpan={fieldInRow.rowSpan}
                                        >
                                            {fieldInRow.name !== 'default' &&
                                                fieldInRow.displayFormName}
                                        </TableCellHead>
                                    )
                                }

                                if (fieldInRow.type === 'empty') {
                                    return (
                                        <TableCell
                                            className={[
                                                styles.categoryNameHeader,
                                                styles.noWrap,
                                            ]}
                                            key={fieldInRow.id}
                                            colSpan={fieldInRow.colSpan}
                                            rowSpan={fieldInRow.rowSpan}
                                        />
                                    )
                                }

                                if (fieldInRow.type === 'de') {
                                    return (
                                        <DataEntryCell key={fieldInRow.id}>
                                            <DataEntryField
                                                dataElement={
                                                    fieldInRow.dataElement
                                                }
                                                categoryOptionCombo={
                                                    fieldInRow.coc
                                                }
                                                disabled={greyedFields?.has(
                                                    getFieldId(
                                                        fieldInRow.dataElement
                                                            .id,
                                                        fieldInRow.coc.id
                                                    )
                                                )}
                                            />
                                        </DataEntryCell>
                                    )
                                }
                                // should never get here
                                return <>unsupported field</>
                            })}
                        </TableRow>
                    )
                })}
                {hiddenItemsCount > 0 && (
                    <TableBodyHiddenByFiltersRow
                        hiddenItemsCount={hiddenItemsCount}
                    />
                )}
            </>
        )
    }
)

PivotedCategoryComboTableBody.propTypes = {
    categoryCombo: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    collapsed: PropTypes.bool,
    dataElements: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayFormName: PropTypes.string,
            headerCombo: PropTypes.shape({
                id: PropTypes.string,
            }),
            valueType: PropTypes.string,
        })
    ),
    displayOptions: PropTypes.shape({
        afterSectionText: PropTypes.string,
        beforeSectionText: PropTypes.string,
        pivotMode: PropTypes.oneOf(['move_categories', 'pivot']),
        pivotedCategory: PropTypes.string,
    }),
    filterText: PropTypes.string,
    /** Greyed fields is a Set where .has(fieldId) is true if that field is greyed/disabled */
    globalFilterText: PropTypes.string,
    greyedFields: PropTypes.instanceOf(Set),
}
