import { curry } from 'lodash/fp'
import {
    STANDARD_REPORTS_ENDPOINT,
    DATA_SET_REPORTS_ENDPOINT,
} from './constants'

/**
 * @param {Object} d2 object retrieved by the list() method
 * @return {Array}
 */
const mapResponseToJSArray = model =>
    model.toArray().map(report => report.toJSON())
/**
 * @param {string} name
 * @param {Object} model
 * @return {Object} The model with the filter if it wasn't an empty string otherwise the model without the filter
 */
export const addFilterForName = curry((name, model) =>
    !name
        ? model
        : model
              .filter()
              .on('displayName')
              .ilike(name)
)

/**
 * Required fields for displaying the standard reports
 */
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
 * @param {Object} model
 * @return {Promise} The request
 */
export const getStandardReports = curry((page, pageSize, model) =>
    model.list({ page, pageSize, fields: standardReportsFields })
)

/**
 * @param {Promise} request
 * @return {Object}
 */
export const formatStandardReportsResponse = request =>
    request.then(model => ({
        reports: mapResponseToJSArray(model),
        pager: {
            pageSize: model.pager.query.pageSize,
            page: model.pager.page,
            pageCount: model.pager.pageCount,
            total: model.pager.total,
        },
    }))

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
