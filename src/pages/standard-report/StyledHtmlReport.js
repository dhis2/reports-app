import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import HtmlReport from './HtmlReport'

const StyledReportData = ({ reportData }) => (
    <Paper
        style={{
            display: reportData ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <HtmlReport html={reportData} />
    </Paper>
)

StyledReportData.propTypes = {
    reportData: PropTypes.string,
}

StyledReportData.defaultProps = {
    reportData: null,
}

export default StyledReportData
