import {
    STANDARD_REPORTS_ENDPOINT,
    DATA_SET_REPORTS_ENDPOINT,
} from './constants'

const standardReportsFields = [
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
export const createGetStandardReportsUrl = (page, pageSize, nameFilter) => {
    const parameters = [
        `page=${page}`,
        `pageSize=${pageSize}`,
        `fields=${standardReportsFields.join(',')}`,
    ]

    if (nameFilter) {
        parameters.push(`filter=displayName:ilike:${nameFilter}`)
    }

    return `${STANDARD_REPORTS_ENDPOINT}?${parameters.join('&')}`
}

/**
 * @param {string} id
 * @return {string}
 */
export const createDeleteStandardReportUrl = id =>
    `${STANDARD_REPORTS_ENDPOINT}/${id}`

export const createGetDataSetReportsUrl = (
    dataSetOptions,
    orgUnitGroupsOptions,
    dataSetId,
    orgUnit,
    period,
    selectedUnitOnly
) => {
    const dimensions = [
        ...Object.keys(dataSetOptions).map(
            dimensionKey => `${dimensionKey}:${dataSetOptions[dimensionKey]}`
        ),
        ...Object.keys(orgUnitGroupsOptions).map(
            orgUnitGroupKey =>
                `${orgUnitGroupKey}:${orgUnitGroupsOptions[orgUnitGroupKey]}`
        ),
    ]

    const parameters = [
        `ds=${dataSetId}`,
        `pe=${period}`,
        `ou=${orgUnit}`,
        `selectedUnitOnly=${selectedUnitOnly}`,
        `dimension=${dimensions}`,
    ]

    return `${DATA_SET_REPORTS_ENDPOINT}?${parameters.join('&')}`
}
