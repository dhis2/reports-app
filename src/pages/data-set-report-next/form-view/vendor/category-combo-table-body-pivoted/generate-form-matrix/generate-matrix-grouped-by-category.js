export const generateMatrixGroupedByCategory = (options, groupedBy) => {
    const columnHeaders = generateColumnHeaders(options, groupedBy)

    // the category options that make part of the coc are defined in the field parentCategoryOptions
    const columnCategoryOptions = columnHeaders
        .flat()
        .flat()
        .filter((col) => col.parentCategoryOptions?.length)

    const rowHeaders = generateRowHeaders(
        options,
        groupedBy,
        columnCategoryOptions
    )
    return { columnHeaders, rowHeaders }
}

const generateRowHeaders = (
    options,
    groupedBy = [],
    columnCategoryOptions = []
) => {
    const { categoryOptionsDetails, sortedCOCs, categories, dataElements } =
        options

    const rowCategories = categories.filter((cat) => groupedBy.includes(cat.id))

    const rows = []
    const addedDataElements = {}
    dataElements.forEach((de) => {
        rowCategories.forEach((category) => {
            category.categoryOptions.forEach((rowCategoryOption) => {
                const dataEntryRow = []
                if (!addedDataElements[de.id]) {
                    dataEntryRow.push({
                        id: de.id,
                        displayFormName: de.displayFormName,
                        type: 'rowHeader',
                        rowSpan: rowCategories.reduce(
                            (acc, item) => acc * item.categoryOptions.length,
                            1
                        ),
                        metadataType: 'dataElement',
                    })
                    addedDataElements[de.id] = true
                }

                const match = categoryOptionsDetails.find(
                    (cod) => cod.id === rowCategoryOption
                )

                dataEntryRow.push({
                    id: match?.id,
                    displayFormName:
                        match?.displayFormName ?? match?.displayName,
                    type: 'rowHeader',
                    metadataType: 'categoryOption',
                })

                columnCategoryOptions.forEach((colCategoryOption) => {
                    const categoryOptionsToMatch = [
                        ...colCategoryOption.parentCategoryOptions,
                        rowCategoryOption,
                    ]

                    const matchedCoc = sortedCOCs.find((coc) => {
                        return categoryOptionsToMatch.every((catOption) =>
                            coc.categoryOptions.includes(catOption)
                        )
                    })

                    dataEntryRow.push({
                        id: de.id + matchedCoc?.id,
                        type: 'de',
                        dataElement: de,
                        coc: matchedCoc,
                        metadataType: 'categoryOptionCombo',
                    })
                })

                rows.push(dataEntryRow)
            })
        })
    })

    return rows
}

const generateColumnHeaders = (options, groupedBy) => {
    const { categoryOptionsDetails, categories } = options

    const columnHeaderFields = [
        ...categories.filter((cat) => !groupedBy.includes(cat.id)),
    ]

    const transposedCategories = categories.filter((cat) =>
        groupedBy.includes(cat.id)
    )

    const columnCategories = categories.filter(
        (cat) => !groupedBy.includes(cat.id)
    )

    const columnHeaders = []

    const largestOptionsLength =
        columnCategories[columnCategories.length - 1]?.categoryOptions.length *
        (columnCategories.length > 1
            ? columnCategories[0]?.categoryOptions.length
            : 1)
    const fullRowSpan = columnCategories.length * 2 // one row for category, one for category options

    if (columnHeaderFields.length === 1) {
        const [firstCategory] = columnHeaderFields
        const categoryTitle = {
            id: firstCategory?.id,
            displayFormName: firstCategory?.displayFormName,
            type: 'columnHeader',
            metadataType: 'category',
            // colSpan: largestOptionsLength,
        }
        const emptyPadding = {
            id: -1 /** todo: unique id */,
            type: 'empty',
            colSpan:
                (categories.length - columnHeaderFields.length) * 2 -
                transposedCategories.length,
        }

        columnHeaders.push([
            { ...emptyPadding, colSpan: emptyPadding.colSpan + 1 },
            {
                ...categoryTitle,
                colSpan: firstCategory.categoryOptions?.length,
            },
        ])
        const categoryOptions = [
            emptyPadding,
            {
                id: transposedCategories[0]?.id,
                displayFormName: transposedCategories[0]?.displayFormName,
                type: 'columnHeader',
                metadataType: 'category',
                // colSpan: categories.length,
                // rowSpan: fullRowSpan,
            },
        ]
        firstCategory.categoryOptions?.forEach((co) => {
            const optionMatch = categoryOptionsDetails.find(
                (cod) => cod.id === co
            )
            categoryOptions.push({
                id: optionMatch?.id,
                displayFormName:
                    optionMatch?.displayFormName ?? optionMatch.displayName,
                type: 'columnHeader',
                metadataType: 'categoryOption',
                parentCategoryOptions: [co],
            })
        })
        columnHeaders.push(categoryOptions)
        return columnHeaders
    }

    columnHeaderFields.forEach((categoryHeader, categoryIndex) => {
        const lastCategory = categoryIndex === columnHeaderFields.length - 1

        // category title
        const categoryTitle = {
            id: categoryHeader?.id,
            displayFormName: categoryHeader?.displayFormName,
            type: 'columnHeader',
            metadataType: 'category',
            // colSpan: largestOptionsLength,
        }

        const categoryOptionsRow = []
        categoryOptionsRow.push(
            {
                id: -1 /** todo: unique id */,
                type: 'empty',
                colSpan:
                    (categories.length - columnHeaderFields.length) * 2 -
                    transposedCategories.length,
            },
            categoryTitle
        )

        // Repeat for each of the previous row category options
        const repeat =
            columnHeaderFields[categoryIndex - 1]?.categoryOptions?.length ?? 1

        for (let i = 0; i < repeat; i++) {
            categoryHeader.categoryOptions?.forEach((co) => {
                const optionMatch = categoryOptionsDetails.find(
                    (cod) => cod.id === co
                )

                const colSpan =
                    largestOptionsLength /
                    categoryHeader.categoryOptions.length /
                    repeat

                // todo: this logic is hardcoded to two levels max - update
                const parentCo =
                    columnHeaderFields[categoryIndex - 1]?.categoryOptions[i]
                const parentCategoryOptions = !lastCategory
                    ? []
                    : parentCo
                    ? [co, parentCo]
                    : [co]

                categoryOptionsRow.push({
                    id: optionMatch?.id,
                    displayFormName:
                        optionMatch?.displayFormName ??
                        optionMatch?.displayName,
                    type: 'columnHeader',
                    metadataType: 'categoryOption',
                    colSpan,
                    parentCategoryOptions,
                })
            })
        }

        columnHeaders.push(categoryOptionsRow)
    })

    columnHeaders.push([
        {
            id: -1 /** todo: unique id */,
            type: 'empty',
            colSpan:
                (categories.length - columnHeaderFields.length) * 2 -
                transposedCategories.length,
            // rowSpan: fullRowSpan,
        },
        {
            id: transposedCategories[0]?.id,
            displayFormName:
                transposedCategories[0]?.displayFormName ??
                transposedCategories[0]?.displayName,
            type: 'columnHeader',
            metadataType: 'category',
            // colSpan: categories.length,
            // rowSpan: fullRowSpan,
        },
        {
            id: -1 /** todo: unique id */,
            type: 'empty',
            colSpan: fullRowSpan,
            // rowSpan: fullRowSpan,
        },
    ])

    return columnHeaders
}
