import { generateMatrixGroupedByCategory } from './generate-matrix-grouped-by-category.js'
import { generateMatrixTransposed } from './generate-matrix-transposed.js'

export const generateFormMatrix = (options, displayOptions) => {
    const groupedBy =
        displayOptions.pivotMode === 'move_categories'
            ? [displayOptions.pivotedCategory]
            : []
    const transposedOnly = displayOptions.pivotMode === 'pivot'

    const transposeMethod = transposedOnly
        ? generateMatrixTransposed
        : generateMatrixGroupedByCategory

    const { rowHeaders, columnHeaders } = transposeMethod(options, groupedBy)
    return [...columnHeaders, ...rowHeaders]
}
