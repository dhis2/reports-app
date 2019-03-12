import isEmpty from 'lodash.isempty'
import i18n from '@dhis2/d2-i18n'
import { getTitle, createGrid } from '../../../utils/dataTransformHelpers'
import createDataTransformCache from '../../../utils/dataTransformCache'

const FONT_FAMILY = "'Roboto', sans-serif"
const BASE_COLOR = '39, 102, 150' // DHIS2 blue

export const cache = createDataTransformCache()

export default function getTransformedChartData(state) {
    const data = state.reportData.content

    if (isEmpty(data)) {
        return data
    }

    if (cache.hasValidCacheFor(data)) {
        return cache.getCachedResult()
    }

    const { columns } = createGrid(data)
    const labels = columns.map(column => column.name)
    const dataPoints = getDataPoints(state, columns)
    const title = getTitle(state)
    const chartData = getChartData(labels, dataPoints, title)

    cache.setCachedResult(data, chartData)
    return chartData
}

function getDataPoints(state, columns) {
    const selectedOrgUnitID = state.organisationUnits.selected.id
    const accumulator = columns.reduce((acc, column) => {
        acc[column.id] = 0
        return acc
    }, {})
    const lookup = state.reportData.content.rows.reduce((acc, row) => {
        const [orgUnitId, columnId, value] = row
        if (orgUnitId === selectedOrgUnitID) {
            acc[columnId] += parseInt(value, 10)
        }
        return acc
    }, accumulator)

    return columns.map(column => lookup[column.id])
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
