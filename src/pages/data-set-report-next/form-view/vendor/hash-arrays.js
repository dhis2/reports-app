export const hashById = (array, key) =>
    array.reduce((acc, curr) => {
        if (key === 'dataSets') {
            if (curr?.organisationUnits?.length) {
                acc[curr.id] = curr
            }
        } else {
            acc[curr.id] = curr
        }

        return acc
    }, {})

export const hashArraysInObject = (result, hashFunction = hashById) =>
    Object.keys(result).reduce((acc, currKey) => {
        const prop = result[currKey]
        if (Array.isArray(prop)) {
            acc[currKey] = hashFunction(result[currKey], currKey)
        } else {
            acc[currKey] = prop
        }
        return acc
    }, {})
