import PropTypes from 'prop-types'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import ReportLoader from './ReportLoader.js'

const BarChart = ({ content, isLoading }) => (
    <ReportLoader content={content} isLoading={isLoading}>
        <div className="chart">
            <Bar data={content.data} options={content.options} />
        </div>
    </ReportLoader>
)

BarChart.propTypes = {
    content: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default BarChart
