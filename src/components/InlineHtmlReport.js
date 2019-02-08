import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './InlineHtmlReport/DownloadOptions'
import Report from './Report'

export const InlineHtmlReport = props => {
    if (!props.shouldRender) return null

    return (
        <div id="report-container">
            <DownloadOptions onDownloadXlsClick={props.onDownloadXlsClick} />
            <Report reportHtml={props.reportHtml} />
        </div>
    )
}

InlineHtmlReport.propTypes = {
    shouldRender: PropTypes.bool.isRequired,
    onDownloadXlsClick: DownloadOptions.propTypes.onDownloadXlsClick,
    reportHtml: Report.propTypes.reportHtml,
}
