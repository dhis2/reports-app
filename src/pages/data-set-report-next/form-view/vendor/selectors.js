/*
 * Vendored from aggregate-data-entry-app src/shared/metadata/selectors.js
 * at commit b95d9775. See ../VENDOR.md.
 *
 * Import block rewritten against this app's deps:
 *   - `re-reselect` is not a dependency here, so createCachedSelector comes
 *     from a small local shim with the same semantics.
 *   - the period/org-unit availability selectors that needed
 *     @dhis2/multi-calendar-dates and the shared date module are trimmed off
 *     the end of the file; see the note there.
 *   - `cartesian` lives in ./cartesian.js rather than shared/utils.js.
 * Everything else is unchanged.
 */
import { createSelector } from 'reselect'
import { cartesian } from './cartesian.js'
import { createCachedSelector } from './create-cached-selector.js'
// Helper to group array items by an identifier

const groupBy = (input, getIdentifier) =>
    input.reduce((grouped, item) => {
        const identifier = getIdentifier(item)

        grouped[identifier] = grouped[identifier] ?? []
        grouped[identifier].push(item)

        return grouped
    }, {})

// Simple input selectors

export const getCategories = (metadata) => metadata.categories
export const getCategoryCombos = (metadata) => metadata.categoryCombos

export const getCategoryOptions = (metadata) => metadata.categoryOptions
export const getDataElements = (metadata) => metadata.dataElements
export const getIndicators = (metadata) => metadata.indicators
export const getDataSets = (metadata) => metadata.dataSets
export const getSections = (metadata) => metadata.sections
export const getOptionSets = (metadata) => metadata.optionSets
export const getCompulsoryDataElementOperands = (metadata) =>
    metadata.compulsoryDataElementOperands
// Select by id

export const getCategoryById = (metadata, id) => getCategories(metadata)[id]
export const getCategoryOptionById = (metadata, id) =>
    getCategoryOptions(metadata)[id]
export const getOptionSetById = (metadata, id) => getOptionSets(metadata)[id]
export const getDataSetById = (metadata, id) => getDataSets(metadata)?.[id]
export const getDataElementById = (metadata, id) =>
    getDataElements(metadata)?.[id]

export const getSectionsByDataSetId = (metadata, dataSetId) => {
    const dataSetSections = getDataSetById(metadata, dataSetId)?.sections
    return dataSetSections ?? []
}

export const getCategoryComboById = (metadata, id) =>
    getCategoryCombos(metadata)[id]

/**
 *
 * @param {*} metadata
 * @param {*} categoryComboId
 * @returns categoryOptionCombos in catCombo. Returns null if catCombo with given id does not exist.
 * Returns undefined if catCombo is missing categoryOptionCombos-property, which may happen if
 * categoryCombo is an 'ATTRIBUTE'-combo.
 */
export const getCategoryOptionCombosByCategoryComboId = (
    metadata,
    categoryComboId
) => {
    const catCombo = getCategoryComboById(metadata, categoryComboId)
    return catCombo ? catCombo.categoryOptionCombos : null
}

/**
 * Memoized selectors
 * To clarify why some selectors are memoized and some aren't: only transformations
 * that are cpu intensive, or transformations that result in the selector returning
 * a new reference every time (.map for example) should be memoized.
 *
 * Selectors where a cache size of 1 is sufficient should be memoized with reselect,
 * selectors that should have a cache per parameter (say an id) should use re-reselect.
 */

/**
 * @param {*} metadata
 * @param {string} categoryComboId
 * @param {string} categoryOptionComboId
 */
export const getCategoryOptionCombo = createCachedSelector(
    getCategoryComboById,
    (_, __, categoryOptionComboId) => categoryOptionComboId,
    (categoryCombo, categoryOptionComboId) =>
        categoryCombo?.categoryOptionCombos.find(
            (coc) => coc.id === categoryOptionComboId
        )
)((_, __, categoryOptionComboId) => categoryOptionComboId)

export const getCategoryOptionsByCategoryOptionComboId = createCachedSelector(
    (metadata) => metadata,
    (metadata) => getCategoryCombos(metadata),
    (_, categoryOptionComboId) => categoryOptionComboId,
    (metadata, categoryCombosDictionary, categoryOptionComboId) => {
        const categoryCombos = Object.values(categoryCombosDictionary)

        for (const categoryCombo of categoryCombos) {
            const curCategoryOptionCombos =
                categoryCombo?.categoryOptionCombos || []
            for (const curCategoryOptionCombo of curCategoryOptionCombos) {
                if (curCategoryOptionCombo?.id === categoryOptionComboId) {
                    const categoryOptions = Object.values(
                        metadata.categoryOptions
                    )
                    const { categoryOptions: curCategoryOptions } =
                        curCategoryOptionCombo

                    return categoryOptions.filter(({ id }) =>
                        curCategoryOptions.includes(id)
                    )
                }
            }
        }

        return []
    }
)((_, categoryOptionComboId) => categoryOptionComboId)

/**
 * @param {*} metadata
 */
export const getCompulsoryDataElementOperandsSet = createCachedSelector(
    getDataSetById,
    (dataSet) => {
        if (!dataSet || !dataSet.compulsoryDataElementOperands) {
            return new Set()
        }
        return new Set(
            dataSet.compulsoryDataElementOperands?.map(
                (operand) =>
                    `${operand?.dataElement?.id}.${operand?.categoryOptionCombo?.id}`
            )
        )
    }
)((_, dataSetId) => dataSetId)

/**
 * @param {*} metadata
 * @param {string} dataSetId
 * @param {string} sectionId
 */
export const getSectionByDataSetIdAndSectionId = createCachedSelector(
    getSectionsByDataSetId,
    (_, __, sectionId) => sectionId,
    (sections, sectionId) => sections.find((s) => s.id === sectionId)
)((_, dataSetId, sectionId) => `${dataSetId}:${sectionId}`)

/**
 * @param {*} metadata
 * @param {*} categoryComboId
 */
export const getCategoriesByCategoryComboId = createCachedSelector(
    getCategoryComboById,
    getCategories,
    (categoryCombo, categories) =>
        categoryCombo?.categories.map((id) => categories[id])
)((_, categoryComboId) => categoryComboId)

/**
 * @param {*} metadata
 * @param {*} dataSetId
 */
export const getCategoryComboByDataSetId = createCachedSelector(
    getDataSetById,
    getCategoryCombos,
    (_, dataSetId) => dataSetId,
    (dataSet, categoryCombos, dataSetId) => {
        if (!dataSet?.categoryCombo?.id) {
            console.warn(
                `Data set with id ${dataSetId} does not have a category combo`
            )

            return undefined
        }

        const categoryCombo = categoryCombos[dataSet?.categoryCombo?.id]

        if (!categoryCombo) {
            console.warn(
                `Could not find a category combo for data set with id ${dataSetId}`
            )
        }

        return categoryCombo
    }
)((_, dataSetId) => dataSetId)

/**
 * @param {*} metadata
 * @param {*} dataSetId
 */
export const getCategoriesByDataSetId = createCachedSelector(
    (metadata) => metadata,
    getCategoryComboByDataSetId,
    (_, dataSetId) => dataSetId,
    (metadata, categoryCombo, dataSetId) => {
        if (!categoryCombo?.id) {
            console.warn(
                `Could not find categories for data set with id ${dataSetId}`
            )

            return []
        }

        return getCategoriesByCategoryComboId(metadata, categoryCombo.id)
    }
)((_, dataSetId) => dataSetId)

/**
 * @param {*} metadata
 * @param {*} categoryId
 */
export const getCategoryOptionsByCategoryId = createCachedSelector(
    getCategoryById,
    getCategoryOptions,
    (category, categoryOptions) =>
        category.categoryOptions.map((id) => categoryOptions[id])
)((_, categoryId) => categoryId)

/**
 * The categoryCombo for a dataElement can be overridden per dataSet. This selector
 * will apply that override.
 * @param {*} metadata
 * @param {*} dataSetId
 */
export const getDataElementsByDataSetId = createCachedSelector(
    getDataElements,
    getDataSetById,
    (dataElements, dataSet) => {
        if (!dataSet?.dataSetElements) {
            // To stay consistent with the way this selector behaved previously
            return undefined
        }

        return dataSet.dataSetElements.map((dataSetElement) => {
            const dataElement = dataElements[dataSetElement.dataElement.id]

            const categoryCombo =
                dataSetElement.categoryCombo ?? dataElement.categoryCombo

            return {
                ...dataElement,
                categoryCombo,
            }
        })
    }
)((_, dataSetId) => dataSetId)

/**
 * The categoryCombo for a dataElement can be overridden per dataSet. This selector
 * will apply that override. Returning dataElements in Alphabetically order of displayFormName
 * @param {*} metadata
 * @param {*} dataSetId
 */
export const getDataElementsByDataSetIdSorted = createSelector(
    getDataElementsByDataSetId,
    (dataElements) =>
        [...dataElements].sort((dataElementA, dataElementB) =>
            dataElementA.displayFormName?.localeCompare(
                dataElementB.displayFormName
            )
        )
)

/**
 * @param {*} metadata
 * @param {*} dataSetId
 */
export const getIndicatorsByDataSetId = createCachedSelector(
    getIndicators,
    getDataSetById,
    (indicators, dataSet) =>
        dataSet?.indicators.map((id) => indicators[id]) || []
)((_, dataSetId) => dataSetId)

/**
 * This selector needs the dataSetId so it can use the getDataElementsByDataSetId selector,
 * which will apply the correct categoryCombo overrides.
 * @param {*} metadata
 * @param {*} dataSetId
 * @param {*} sectionId
 */
export const getDataElementsBySection = createCachedSelector(
    getSectionByDataSetIdAndSectionId,
    getDataElementsByDataSetId,
    (section, dataElements) =>
        section.dataElements.map((id) =>
            dataElements.find((de) => de.id === id)
        )
)((_, dataSetId, sectionId) => `${dataSetId}:${sectionId}`)

/**
 * @param {*} metadata
 * @param {*} dataSetId
 * @param {*} sectionId
 */
export const getIndicatorsByDataSetIdAndSectionId = createCachedSelector(
    getSectionByDataSetIdAndSectionId,
    getIndicators,
    (section, indicators) => {
        if (!section) {
            return []
        }

        return section.indicators.map((id) => indicators[id])
    }
)((_, dataSetId, sectionId) => `${dataSetId}:${sectionId}`)

/**
 * Returns an array of objects with dataElements and their associated categoryCombos.
 * This keeps the defined dataElement order given, and groups neighbouring elements with the
 * same categoryCombo in the same group. This is used in form-sections
 * when `section.disableDataElementAutoGroup`is true
 * @param {*} metadata
 * @param {*} dataElements - a list of dataElement -objects (result of getDataElementsBySection)
 */
export const getGroupedDataElementsByCatComboInOrder = createSelector(
    (_, dataElements) => dataElements,
    getCategoryCombos,
    (dataElements, categoryCombos) => {
        const grouped = []

        dataElements.forEach((de, i) => {
            const previousDe = dataElements[i - 1]
            const lastGroup = grouped[grouped.length - 1]
            const matchingId =
                previousDe?.categoryCombo.id === de.categoryCombo.id

            if (!lastGroup || !matchingId) {
                grouped.push({
                    dataElements: [de],
                    categoryCombo: categoryCombos[de.categoryCombo.id],
                })
            } else {
                lastGroup.dataElements.push(de)
            }
        })

        return grouped
    }
)

/**
 * Returns an array of objects with dataElements and their associated categoryCombos. Unlike
 * getGroupedDataElementsByCatComboInOrder, this selector will group all dataElements with the
 * same categoryComboId together.
 * @param {*} metadata
 * @param {*} dataElements
 */
export const getGroupedDataElementsByCatCombo = createSelector(
    (_, dataElements) => dataElements,
    getCategoryCombos,
    (dataElements, categoryCombos) => {
        // Group dataElements by their categoryCombo id
        const grouped = groupBy(dataElements, (de) => de.categoryCombo.id)

        // Map to an array and include the associated categoryCombo
        return Object.entries(grouped).map(
            ([categoryComboId, dataElements]) => ({
                dataElements,
                categoryCombo: categoryCombos[categoryComboId],
            })
        )
    }
)

export const getNrOfColumnsInCategoryCombo = createCachedSelector(
    getCategoriesByCategoryComboId,
    (categories) => {
        if (!categories) {
            // It returns the number of columns, not the number of
            // categoryOptions or categories, and there should always be 1
            // column to render. In case of missing references, it will just
            // render a padding-cell
            return 1
        }

        return categories
            .map(({ categoryOptions }) => categoryOptions.length)
            .reduce((total, curr) => total * curr)
    }
)((_, categoryComboId) => categoryComboId)

/**
 * Tries to find the categoryOptionCombo with the given categoryOptions within a category
 * combination.
 * @param {*} metadata
 * @param {*} categoryComboId
 * @param {*} categoryOptionIds
 */
export const getCoCByCategoryOptions = createCachedSelector(
    getCategoryOptionCombosByCategoryComboId,
    (_, categoryComboId) => categoryComboId,
    (_, __, categoryOptionIds) => categoryOptionIds,
    (categoryOptionCombos, categoryComboId, categoryOptionIds) => {
        const targetIds = categoryOptionIds

        for (const coc of categoryOptionCombos) {
            const currentIds = coc.categoryOptions
            const sameLength = targetIds.length === currentIds.length
            const sameIds = targetIds.every((id) => currentIds.includes(id))

            if (sameLength && sameIds) {
                // coc.categoryOptions are a set on the server, so the order is not guaranteed
                // so we replace the categoryOptions with the targetIds, which should be in correct order
                return { ...coc, categoryOptions: targetIds }
            }
        }

        console.warn(
            `Could not find categoryOptionCombo for catCombo ${categoryComboId}, with categoryOptions: ${categoryOptionIds.join()}`
        )

        return null
    }
)((_, categoryComboId) => categoryComboId)

/**
 * @param {*} metadata
 * @param {*} categoryComboId
 * @returns {Array.<Array.<string>>} An array with arrays of categoryOption-ids
 */
export const getComputedCategoryOptionIdsByCatComboId = createCachedSelector(
    getCategoriesByCategoryComboId,
    (categories) => {
        const optionsIdLists =
            categories?.map((cat) => cat.categoryOptions) || []
        return cartesian(optionsIdLists)
    }
)((_, categoryComboId) => categoryComboId)

/**
 * The `categoryOptionCombos` of a `categoryCombo` is a Set, and therefore
 * unordered. To be able to render the cocs (eg. an entry field) in the correct
 * order (same order as the table-header), we need to compute the
 * categoryOptionCombos client side. This is basically a `cartesian-product` of
 * all the `categoryOptions` in all `categories` in the `categoryCombo`.
 *
 * @param {*} metadata
 * @param {*} categoryComboId
 */
export const getSortedCoCsByCatComboId = createCachedSelector(
    (metadata) => metadata,
    (_, categoryComboId) => categoryComboId,
    getComputedCategoryOptionIdsByCatComboId,
    (metadata, categoryComboId, categoryOptionIdsForCoC) =>
        categoryOptionIdsForCoC.map((categoryOptionIds) =>
            getCoCByCategoryOptions(
                metadata,
                categoryComboId,
                categoryOptionIds
            )
        )
)((_, categoryComboId) => categoryComboId)

/*
 * Trimmed here. Everything after this point upstream
 * (isOptionWithinPeriod, isOptionAssignedToOrgUnit,
 * getCategoriesWithOptionsWithinPeriodWithOrgUnit,
 * getApplicableDataInputPeriod, getAllAssignedOrgUnits,
 * getDataSetsByOrgUnitId) decides whether a category option is open for entry
 * in a given period and org unit. A report renders what was recorded, not what
 * may be entered, so none of it is reachable from the layout components — and
 * dropping it removes a dependency on `moment` and the shared date module.
 */
