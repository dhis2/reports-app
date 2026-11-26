const sum = (acc, value) => {
    const b = Number(value) || 0
    return acc + b
}

const calculateColumnTotal = (matrix, column = 0) =>
    matrix.reduce((total, currRow) => sum(total, currRow[column]), 0)

export const calculateColumnTotals = (matrix) =>
    matrix[0]?.map((_, i) => calculateColumnTotal(matrix, i)) || []

export const calculateRowTotal = (matrix, row = 0) => matrix[row].reduce(sum, 0)
