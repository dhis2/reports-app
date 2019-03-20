import isEmpty from 'lodash.isempty'
import createDataTransformCache from '../../../utils/dataTransformCache'
import { isHtmlReport } from '../../../utils/dataSetReport/isHtmlReport'

export const cache = createDataTransformCache()

export default function getTransformedTableData(state) {
    const content = state.reportData.content

    if (isEmpty(content) || isHtmlReport(content)) {
        return content
    }

    if (cache.hasValidCacheFor(content)) {
        return cache.getCachedResult()
    }

    const tables = content.data.map(transformTableData)

    cache.setCachedResult(content, tables)
    return tables
}

function transformTableData(data) {
    return {
        title: data.title,
        headers: data.headers.map(h => h.column),
        rows: data.rows.map(cells => cells.map(x => (!!x || x === 0 ? x : ''))),
    }
}
