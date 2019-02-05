import { getInstance } from 'd2/lib/d2'
import createGetStandardReportsUrl from './api/standardReports/createGetStandardReportsUrl'
import createDeleteStandardReportUrl from './api/standardReports/createDeleteStandardReportUrl'

let d2
let api

/**
 * Sets d2 and the api
 */
export const init = async () => {
    d2 = await getInstance()
    api = d2.Api.getApi()
    if (process.env.NODE_ENV === 'development') {
        window.d2 = d2
        window.d2Api = api
    }
}
init()

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
 * @return {Promise} Organisation units
 */
export const getOrganisationUnits = () =>
    d2.models.organisationUnits
        .list({
            paging: false,
            level: 1,
            fields: [
                'id',
                'displayName',
                'path',
                'children::isNotEmpty',
                'memberCount',
            ],
        })
        .then(modelCollection => modelCollection.toArray())

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {string} nameFilter
 * @return {Promise}
 */
export const getStandardReports = (page, pageSize, nameFilter) =>
    api.get(createGetStandardReportsUrl(page, pageSize, nameFilter))

/**
 * @param {string} id
 * @return {Promise}
 */
export const deleteStandardReport = id =>
    api.delete(createDeleteStandardReportUrl(id))
