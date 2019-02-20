import { isDevelopment } from './env/isDevelopment'
import {
    standardReportsFields,
    addFilterForName,
    formatStandardReportsResponse,
    mapCollectionToDimensionQueryString,
    mapResponseToArrayOfIds,
} from './api/helpers'
import {
    STANDARD_REPORTS_ENDPOINT,
    DATA_SET_REPORTS_ENDPOINT,
    DATA_SET_DIMENSIONS_ENDPOINT,
    DATA_DIMENSION_SUFFIXES,
    postDataSetReportCommentUrl,
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
        window.d2Api = api
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
export const getPeriodTypes = () =>
    api.get('periodTypes').then(resp => resp.periodTypes)

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
export const getFilteredStandardReports = (page, pageSize, nameFilter) =>
    addFilterForName(nameFilter, d2.models.report)
        .list({ page, pageSize, fields: standardReportsFields })
        .then(formatStandardReportsResponse)

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

export const getDimensions = dataSetId =>
    api.get(`${DATA_SET_DIMENSIONS_ENDPOINT}/${dataSetId}`, {
        fields: ['id', 'displayName', 'items[id,displayName]'].join(','),
        order: 'name:asc',
        paging: false,
    })

/**
 * @param {string} dataSetId
 * @param {string} orgUnitId
 * @param {string} period
 * @param {string} comment
 * @returns {Promise}
 */
export const postDataSetReportComment = (
    dataSetId,
    orgUnitId,
    period,
    comment
) => {
    const endpointUrl = postDataSetReportCommentUrl(
        dataSetId,
        orgUnitId,
        period
    )
    const requestHeaders = { headers: { 'content-type': 'text/plain' } }
    return api.post(endpointUrl, comment, requestHeaders)
}

/**
 * @param {Object} orgUnit
 * @param {string} dataSetId
 * @param {string} period
 * @param {Object} orgUnitOptions
 * @returns {Promise}
 */
export const getReportingRateSummaryReport = async (
    orgUnit,
    dataSetId,
    period,
    orgUnitOptions
) => {
    const orgUnitIds = await getOrgUnitAndChildrenIds(orgUnit)
    const dataDimensions = DATA_DIMENSION_SUFFIXES.map(
        suffix => `${dataSetId}.${suffix}`
    )
    const req = new d2.analytics.request()
        .addDataDimension(dataDimensions)
        .addOrgUnitDimension(orgUnitIds)
        .addPeriodFilter(period)
        .withDisplayProperty('SHORTNAME')

    for (let key in orgUnitOptions) {
        if (orgUnitOptions[key]) {
            req.addDimension(key, orgUnitOptions[key])
        }
    }

    return d2.analytics.aggregate.get(req)
}

/**
 * @param {Object} orgUnit
 * @returns {Promise} - Array of IDs of the orgUnit and its direct descendants
 */
export const getOrgUnitAndChildrenIds = orgUnit => {
    if (orgUnit.children.size) {
        return Promise.resolve([
            orgUnit.id,
            ...mapResponseToArrayOfIds(orgUnit.children),
        ])
    } else {
        return d2.models.organisationUnits
            .get(orgUnit.id, { fields: ['children[id]'] })
            .then(({ children }) => [
                orgUnit.id,
                ...mapResponseToArrayOfIds(children),
            ])
    }
}

/**
 * @returns {Promise}
 */
export const getOrgUnitGroupSets = () =>
    d2.models.organisationUnitGroupSet.list({
        paging: false,
        fields: 'id,displayName',
    })
