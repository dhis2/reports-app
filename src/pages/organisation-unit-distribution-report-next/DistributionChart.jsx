import PropTypes from 'prop-types'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import styles from './OrgUnitDistReportNext.module.css'

/**
 * The distribution as stacked bars.
 *
 * `maintainAspectRatio: false` in the chart options means the canvas takes
 * the height it is given, so the box around it has to have one — chart.js
 * would otherwise collapse it to nothing.
 */
export const DistributionChart = ({ chart }) => (
    <div className={styles.chartBox}>
        <Bar data={chart.data} options={chart.options} />
    </div>
)

DistributionChart.propTypes = {
    chart: PropTypes.shape({
        data: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
    }).isRequired,
}
