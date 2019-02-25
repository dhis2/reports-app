import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import Report from './Report'

export const TabularReport = props => {
    if (!props.shouldRender) return null

    return (
        <div id="report-container">
            <DownloadOptions onDownloadXlsClick={props.onDownloadXlsClick} />
            <Report reportHtml={props.reportHtml} />
        </div>
    )
}

TabularReport.propTypes = {
    shouldRender: PropTypes.bool.isRequired,
    onDownloadXlsClick: DownloadOptions.propTypes.onDownloadXlsClick,
    reportHtml: Report.propTypes.reportHtml,
}
