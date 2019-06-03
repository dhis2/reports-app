import isEmpty from 'lodash.isempty'
import i18n from '@dhis2/d2-i18n'
import { getTitle } from '../../../utils/dataTransformHelpers'
import createDataTransformCache from '../../../utils/dataTransformCache'
import { FONT_FAMILY, BASE_COLOR } from '../../../config/style.config'

export const cache = createDataTransformCache()

/**
 * @param {Object} state - App state
 * @returns {Object} - Transformed table data that can be consumed by BarChart
 */
export default function getTransformedChartData(state) {
    const data = state.reportData.content

    if (isEmpty(data)) {
        return data
    }

    if (cache.hasValidCacheFor(data)) {
        return cache.getCachedResult()
    }

    const chartData = getChartData(
        getLabels(data.headers),
        getDataPoints(data.rows[0]),
        getTitle(state)
    )

    cache.setCachedResult(data, chartData)
    return chartData
}

function getLabels(headers) {
    return headers.reduce((acc, header, index) => {
        if (index > 0) {
            acc.push(header.column)
        }
        return acc
    }, [])
}

function getDataPoints(cells) {
    return cells.reduce((acc, cell, index) => {
        if (index > 0) {
            acc.push(parseInt(cell, 10))
        }
        return acc
    }, [])
}

function getChartData(labels, data, title) {
    return {
        data: {
            labels,
            datasets: [
                {
                    label: i18n.t('Count'),
                    backgroundColor: `rgba(${BASE_COLOR}, 0.6)`,
                    borderColor: `rgb(${BASE_COLOR})`,
                    borderWidth: 1,
                    hoverBackgroundColor: `rgba(${BASE_COLOR}, 0.8)`,
                    data,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: '16',
                fontFamily: FONT_FAMILY,
            },
            legend: {
                position: 'bottom',
                fontFamily: FONT_FAMILY,
            },
            animation: {
                duration: 180,
            },
        },
    }
}
