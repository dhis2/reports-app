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
