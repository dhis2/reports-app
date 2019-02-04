import { REPORTS_ENDPOINT } from './constants'

const fieldsToFetch = [
    'displayName',
    'type',
    'id',
    'reportTable[id,displayName]',
    'access',
]

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {string} nameFilter
 * @returns {string}
 */
const createGetStandardReportsUrl = (page, pageSize, nameFilter) => {
    const parameters = [
        `page=${page}`,
        `pageSize=${pageSize}`,
        `fields=${fieldsToFetch.join(',')}`,
    ]

    if (nameFilter) {
        parameters.push(`filter=displayName:ilike:${nameFilter}`)
    }

    return `${REPORTS_ENDPOINT}?${parameters.join('&')}`
}

export default createGetStandardReportsUrl
