import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import HtmlReport from './HtmlReport'

const StyledHtmlReport = ({ htmlReport }) => (
    <Paper
        style={{
            display: htmlReport ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <HtmlReport html={htmlReport} />
    </Paper>
)

StyledHtmlReport.propTypes = {
    htmlReport: PropTypes.string,
}

StyledHtmlReport.defaultProps = {
    htmlReport: null,
}

export default StyledHtmlReport
