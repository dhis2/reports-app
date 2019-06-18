import { isDevelopment } from './env/isDevelopment'
import {
    addFileResourceUrlToResource,
    uploadFile,
    standardReportsFields,
    addFilterForName,
    formatStandardReportsResponse,
    mapCollectionToDimensionQueryString,
    mapResponseToArrayOfIds,
    getAnalyticsFileUrls,
    buildQueryString,
    getFileUrls,
    postDataSetReportCommentUrl,
    getDataSetReportFileUrls,
    sanitizeApiUrl,
} from './api/helpers'
import { isCustomFormType } from './dataSetReport/isCustomFormType'

export const RESOURCE_ENDPOINT = 'documents'
const DATA_DIMENSION_SUFFIXES = [
    'ACTUAL_REPORTS',
    'EXPECTED_REPORTS',
    'REPORTING_RATE',
    'ACTUAL_REPORTS_ON_TIME',
    'REPORTING_RATE_ON_TIME',
]
const STANDARD_REPORTS_ENDPOINT = 'reports'

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
 * @returns {string} context path
 */
export const getContextPath = () => d2.system.systemInfo.contextPath

/**
 * @typedef {Object} Version
 * @property {number} major The major version
 * @property {number} minor The minor version
 * @property {boolean} snapshot Flag to indicate if build is a snapshot
 */

/**
 * @returns {Version} The dhis2-core instance version
 */
export const getSystemVersion = () => d2.system.version

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
 * @param {Array} dataSetOptions
 * @param {Array} orgUnitGroupsOptions
 * @param {string} dataSetId
 * @param {string} orgUnit
 * @param {string} period
 * @param {bool} selectedUnitOnly
 * @returns {Promise}
 */
export const getDataSetReport = options => {
    const endPoint = 'dataSetReport'
    const url = isCustomFormType(options.dataSet.formType)
        ? `${endPoint}/custom`
        : endPoint
    const data = {
        ds: options.dataSet.id,
        pe: options.period,
        ou: options.orgUnit,
        selectedUnitOnly: options.selectedUnitOnly,
        filter: mapCollectionToDimensionQueryString(
            options.dataSetDimensions,
            options.orgUnitGroupsOptions
        ),
    }
    const requestOptions = isCustomFormType(options.dataSet.formType)
        ? { headers: { Accept: 'text/html' } }
        : {}
    const fileUrls = getDataSetReportFileUrls(endPoint, options)

    return api
        .get(url, data, requestOptions)
        .then(response => ({ data: response, fileUrls }))
}

/**
 * @param {string} dataSetId
 * @returns {Promise<array>} The dimensions for a given dataset
 */
export const getDimensions = dataSetId =>
    api
        .get(`dimensions/dataSet/${dataSetId}`, {
            fields: ['id', 'displayName', 'items[id,displayName]'].join(','),
            order: 'name:asc',
            paging: false,
        })
        .then(({ dimensions }) => dimensions)

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
    const requestHeaders = { headers: { 'Content-Type': 'text/plain' } }
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
        .withColumns('dx')
        .withRows('ou')
        .withTableLayout()
        .withHideEmptyRows()
        .withDisplayProperty('SHORTNAME')
        .withIncludeNumDen(false)

    for (let key in orgUnitOptions) {
        if (orgUnitOptions[key]) {
            req.addFilter(key, orgUnitOptions[key])
        }
    }

    // Instead of calling `d2.analytics.aggregate.get(req)`, which spawns two parallel requests,
    // we're just building the .json url from the request instance and call the regular `api.get(url)`,
    // which only spawns a single request
    const extensions = ['json', 'xls', 'csv']
    const [{ url }, ...fileUrls] = getAnalyticsFileUrls(req, extensions)
    return api.get(sanitizeApiUrl(url)).then(data => ({ ...data, fileUrls }))
}

/**
 * @param {Object} orgUnit
 * @returns {Promise} - Array of IDs of the orgUnit and its direct descendants
 */
export const getOrgUnitAndChildrenIds = orgUnit => {
    const children = orgUnit.children.size
        ? Promise.resolve(orgUnit.children)
        : d2.models.organisationUnits
              .get(orgUnit.id, { fields: ['children[id]'] })
              .then(({ children }) => children)

    return children.then(children => [
        orgUnit.id,
        ...mapResponseToArrayOfIds(children),
    ])
}

/**
 * @returns {Promise}
 */
export const getOrgUnitGroupSets = () =>
    d2.models.organisationUnitGroupSet.list({
        paging: false,
        fields: 'id,displayName,organisationUnitGroups[id,displayName]',
    })

/**
 * @param {Object} orgUnit
 * @param {string} groupSetId
 * @returns {Promise}
 */
export const getOrgUnitDistReport = async (
    orgUnit,
    groupSetId,
    shouldShowChart
) => {
    const orgUnitIds = shouldShowChart
        ? orgUnit.id
        : await getOrgUnitAndChildrenIds(orgUnit)

    const endPoint = 'orgUnitAnalytics'
    const queryString = buildQueryString({
        ou: orgUnitIds,
        ougs: groupSetId,
        columns: groupSetId,
    })
    const relativeUrl = `${endPoint}?${queryString}`
    const fileUrls = getFileUrls(endPoint, queryString, ['xls', 'pdf'])

    return api.get(relativeUrl).then(response => ({ ...response, fileUrls }))
}

/**
 * @returns {Promise}
 */
export const getResources = (page, pageSize, search) => {
    const requestData = {
        page,
        pageSize,
        fields: 'displayName,id,url,external,access',
    }

    if (search) {
        requestData.filter = `displayName:ilike:${search}`
    }

    return api.get(RESOURCE_ENDPOINT, requestData)
}

/**
 * @returns {Promise}
 */
export const deleteResource = resourceId =>
    api.delete(`${RESOURCE_ENDPOINT}/${resourceId}`)

/**
 * @returns {Promise}
 */
export const getStandardReportTables = () =>
    api.get('reportTables', { paging: false, fields: 'id,name' })

/**
 * @param {Object} report
 * @returns {Promise}
 */
export const postStandardReport = report =>
    api.post(STANDARD_REPORTS_ENDPOINT, report)

/**
 * @param {Object} report
 * @returns {Promise}
 */
export const updateStandardReport = report =>
    api.update(`${STANDARD_REPORTS_ENDPOINT}/${report.id}`, report)

/**
 * @returns {Promise}
 */
export const getDataSetOptions = () =>
    d2.models.dataSet
        .list({ paging: false, fields: 'id,displayName,formType' })
        .then(response => response.toArray())

/**
 * @param {Object} api
 * @param {Object} resource
 * @returns {Promise}
 */
export const postDocument = (api, resource) =>
    api.post(RESOURCE_ENDPOINT, resource)

/**
 * @param {Object} api
 * @param {string} resourceId
 * @param {Object} resource
 * @returns {Promise}
 */
export const putDocument = (api, resourceId, resource) =>
    api.update(`${RESOURCE_ENDPOINT}/${resourceId}`, resource)

/**
 * @param {Object} resource
 * @param {File} [file] - an optional file
 * @returns {Promise}
 */
export const postResource = (resource, file = null) =>
    file
        ? uploadFile(api, file)
              .then(({ response }) =>
                  Promise.resolve(
                      addFileResourceUrlToResource(
                          resource,
                          response.fileResource
                      )
                  )
              )
              .then(resource => postDocument(api, resource))
        : postDocument(api, resource)

/**
 * @param {Object} resource
 * @param {File} [file] - an optional file
 * @returns {Promise}
 */
export const putResource = (resourceId, resource, file = null) =>
    file
        ? uploadFile(api, file)
              .then(({ response }) =>
                  Promise.resolve(
                      addFileResourceUrlToResource(
                          resource,
                          response.fileResource
                      )
                  )
              )
              .then(resource => putDocument(api, resourceId, resource))
        : putDocument(api, resourceId, resource)

/**
 * =================================
 * Standard report
 * =================================
 */

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
 * @returns {Promise}
 */
export const getStandardReportDetails = id =>
    api.get(`${STANDARD_REPORTS_ENDPOINT}/${id}`)

/**
 * @param {string} id
 * @return {Promise}
 */
export const deleteStandardReport = id =>
    api.delete(`${STANDARD_REPORTS_ENDPOINT}/${id}`)

/**
 * @param {string} id
 * @returns {Promise}
 */
export const getStandardReportHtmlReport = (id, requestBody) =>
    api.get(`reports/${id}/data.html`, {
        t: new Date().getTime(),
        ...requestBody,
    })
