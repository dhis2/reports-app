import { pipe } from 'lodash/fp'
import { isDevelopment } from './env/isDevelopment'
import {
    addFilterForName,
    getStandardReports,
    formatStandardReportsResponse,
    mapCollectionToDimensionQueryString,
} from './api/helpers'
import {
    STANDARD_REPORTS_ENDPOINT,
    DATA_SET_REPORTS_ENDPOINT,
} from './api/constants'

let d2
let api

/**
 * Sets d2 and the api
 */
export const initApi = d2Instance => {
    d2 = d2Instance
    api = d2.Api.getApi()

    if (isDevelopment()) {
        window.d2 = d2
    }
}

/**
 * @return {Object} d2 instance
 */
export const getD2 = () => d2

/**
 * @return {Object} d2 api instance
 */
export const getApi = () => api

/**
 * @return {Promise} Period types
 */
export const getPeriodTypes = () => api.get('periodTypes')

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {string} nameFilter
 * @return {Promise}
 */
export const getFilteredStandardReports = (page, pageSize, nameFilter) =>
    pipe(
        addFilterForName(nameFilter),
        getStandardReports(page, pageSize),
        formatStandardReportsResponse
    )(d2.models.report)

/**
 * @param {string} id
 * @return {Promise}
 */
export const deleteStandardReport = id =>
    api.delete(`${STANDARD_REPORTS_ENDPOINT}/${id}`)

export const getDataSetReports = (
    dataSetOptions,
    orgUnitGroupsOptions,
    dataSetId,
    orgUnit,
    period,
    selectedUnitOnly
) =>
    api.get(DATA_SET_REPORTS_ENDPOINT, {
        ds: dataSetId,
        pe: period,
        ou: orgUnit,
        selectedUnitOnly,
        dimensions: mapCollectionToDimensionQueryString(
            dataSetOptions,
            orgUnitGroupsOptions
        ),
    })
