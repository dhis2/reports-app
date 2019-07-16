import { FILE_RESOURCES_ENDPOINT } from './constants'
import { getApi } from '../api'

/**
 * @param {Object} d2 ModelCollection instance
 * @return {Array<string>}
 */
export const mapResponseToArrayOfIds = model =>
    model.toArray().map(({ id }) => id)

/**
 * @param {string} name
 * @param {Object} model
 * @return {Object} The model with the filter if it wasn't an empty string otherwise the model without the filter
 */
export const addFilterForName = (name, model) =>
    !name
        ? model
        : model
              .filter()
              .on('displayName')
              .ilike(name)

/**
 * Required fields for displaying the standard reports
 */
export const standardReportsFields = [
    'displayName',
    'type',
    'id',
    'reportTable[id,displayName,reportParams,relativePeriods]',
    'reportParams',
    'relativePeriods',
    'access',
]

/**
 * @param {Promise} request
 * @returns {Object}
 */
export const formatStandardReportsResponse = reportsCollection => ({
    reports: reportsCollection.toArray().map(reportModel => ({
        ...reportModel.toJSON(),
        // The JSON representation of a reportModel is missing
        // some of the reportTable properties such as reportParams
        reportTable: reportModel.reportTable,
    })),
    pager: {
        pageSize: reportsCollection.pager.query.pageSize,
        page: reportsCollection.pager.page,
        pageCount: reportsCollection.pager.pageCount,
        total: reportsCollection.pager.total,
    },
})

/**
 * @param {...Object} collections
 * @returns {string[]}
 */
export const mapCollectionToDimensionQueryString = (...collections) =>
    collections.reduce(
        (dimensionQueryString, collection) => [
            ...dimensionQueryString,
            ...Object.keys(collection).map(key => `${key}:${collection[key]}`),
        ],
        []
    )
/**
 * @param {Object} req - D2 AnalyticsRequest instance
 * @param {Array<String>} extensions - File extensions needed
 * @returns {Object} - An object containing the download links for the requested file extensions
 */
export const getAnalyticsFileUrls = (req, extensions) => {
    const query = req.buildQuery()
    const suffix = Object.keys(query).reduce(
        (suffix, key) => (suffix += `&${key}=${query[key]}`),
        ''
    )
    const jsonUrl = `${getApi().baseUrl}/${req.buildUrl()}${suffix}`

    return extensions.reduce((fileUrls, extension) => {
        fileUrls.push({
            extension,
            url: jsonUrl.replace('analytics.json?', `analytics.${extension}?`),
        })
        return fileUrls
    }, [])
}

export const sanitizeApiUrl = url => {
    // Because dev envs use an absolute path, but deployed instances a relative one
    // And because `d2.get` will prepend "/api" for relative paths, we need to remove
    // "api/" from the string for relative paths
    return url.includes('../api') ? url.replace('../api', '..') : url
}

export const getDataSetReportFileUrls = (resourceUrl, options) => {
    const mergedFilters = {
        ...options.dataSetDimensions,
        ...options.orgUnitGroupsOptions,
    }
    const baseQueryStr = buildQueryString({
        ds: options.dataSet.id,
        pe: options.period,
        ou: options.orgUnit,
        selectedUnitOnly: options.selectedUnitOnly,
    })
    const filterQueryStr = Object.keys(mergedFilters)
        .map(key => `filter=${key}:${mergedFilters[key]}`)
        .join('&')
    const fullQueryStr = filterQueryStr
        ? `${baseQueryStr}&${filterQueryStr}`
        : baseQueryStr

    return getFileUrls(resourceUrl, fullQueryStr, ['xls', 'pdf'])
}

/**
 * @param {Object} api
 * @param {File} file
 * @returns {Promise}
 */
export const uploadFile = (api, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('domain', 'DOCUMENT')

    return api.post(FILE_RESOURCES_ENDPOINT, formData)
}

/**
 * @param {Object} resource
 * @param {File} file
 * @returns {Object}
 */
export const addFileResourceUrlToResource = (resource, file) => ({
    ...resource,
    url: file.id || resource.url,
})

/**
 * @param {String} endpoint
 * @param {string} queryString
 * @param {Array<String>} extensions - file extensions to produce
 * @returns {Array} - Array of objects with extension and url properties
 */
export const getFileUrls = (endPoint, queryString, extensions) =>
    extensions.map(extension => ({
        extension,
        url: `${getApi().baseUrl}/${endPoint}.${extension}?${queryString}`,
    }))

/**
 * Takes an object and returns a query string
 * For arrays it will create a semi-colon-delimited string
 * @param {Object} o - object to base the queryString upon
 * @example
 * buildQueryString({a: 'yeah', b: ['u', 1]})
 * // returns 'a=yeah&b=u;1'
 * @returns {String} - query string
 */
export const buildQueryString = o => {
    return Object.keys(o)
        .reduce((acc, key) => {
            const value = Array.isArray(o[key]) ? o[key].join(';') : o[key]
            acc.push(`${key}=${value}`)
            return acc
        }, [])
        .join('&')
}

// Url creaters
export const postDataSetReportCommentUrl = (dataSetId, orgUnitId, period) =>
    `interpretations/dataSetReport/${dataSetId}?pe=${period}&ou=${orgUnitId}`
