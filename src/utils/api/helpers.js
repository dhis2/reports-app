import { getApi } from '../api'
/**
 * @param {Object} d2 object retrieved by the list() method
 * @return {Array}
 */
const mapResponseToJSArray = model =>
    model.toArray().map(report => report.toJSON())

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
    'reportTable[id,displayName]',
    'access',
]

/**
 * @param {Promise} request
 * @returns {Object}
 */
export const formatStandardReportsResponse = model => ({
    reports: mapResponseToJSArray(model),
    pager: {
        pageSize: model.pager.query.pageSize,
        page: model.pager.page,
        pageCount: model.pager.pageCount,
        total: model.pager.total,
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
export const parseFileUrls = (req, extensions) => {
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
