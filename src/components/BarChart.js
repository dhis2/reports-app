import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from '@dhis2/d2-ui-core'
import isEmpty from 'lodash.isempty'
import { Bar } from 'react-chartjs-2'

const BarChart = ({ content, isLoading }) => {
    if (isLoading) {
        return (
            <div className="tabular-report__loader">
                <CircularProgress />
            </div>
        )
    }

    if (isEmpty(content)) {
        return null
    }

    return (
        <div className="chart">
            <Bar data={content.data} options={content.options} />
        </div>
    )
}

BarChart.propTypes = {
    content: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default BarChart
