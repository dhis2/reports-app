import i18n from '@dhis2/d2-i18n'
import { selectors } from '../../../shared/index.js'

export const generateMatrixTransposed = (options) => {
    const {
        metadata,
        categoryOptionsDetails,
        sortedCOCs,
        categories,
        dataElements,
        totalRows,
    } = options

    const columnHeaderFields = [...categories, ...dataElements]

    const columnHeaders = [
        [
            ...columnHeaderFields.map((header) => {
                return {
                    id: header?.id,
                    name: header.name,
                    displayFormName: header?.displayFormName,
                    type: 'columnHeader',
                    metadataType: header.valueType ? 'dataElement' : 'category',
                }
            }),
        ],
    ]

    const rowHeaders = []
    sortedCOCs.forEach((categoryOptionCombo, i) => {
        const dataEntryRow = []
        let span = totalRows
        // ids for each category option in the combo, one per category
        const categoryOptionsIds = categoryOptionCombo.categoryOptions

        categoryOptionsIds.forEach((coId, optIndex) => {
            const categoryOption = categoryOptionsDetails.find(
                (cod) => cod.id === coId
            )
            const category = categories[optIndex]
            span = span / category.categoryOptions.length
            // we only want to render the header once "per spanning"-header
            // the last category (span=1, i % 1 === 0) will always render
            if (i % span === 0) {
                dataEntryRow.push({
                    id: categoryOption?.id,
                    displayFormName:
                        categoryOption?.name === 'default'
                            ? i18n.t('Value')
                            : categoryOption?.displayName,
                    rowSpan: span,
                    type: 'rowHeader',
                })
            }
        })

        dataElements.forEach((de) => {
            const dataElement = selectors.getDataElementById(metadata, de.id)
            dataEntryRow.push({
                id: de.id,
                displayName: de.displayName,
                rowSpan: 1,
                type: 'de',
                dataElement,
                coc: selectors.getCategoryOptionCombo(
                    metadata,
                    dataElement.categoryCombo.id,
                    categoryOptionCombo.id
                ),
            })
        })
        rowHeaders.push(dataEntryRow)
    })

    return { columnHeaders, rowHeaders }
}
