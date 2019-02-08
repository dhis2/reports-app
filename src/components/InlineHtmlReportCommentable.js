import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './InlineHtmlReport/DownloadOptions'
import { ShareComponent } from './InlineHtmlReport/ShareComponent'
import Report from './Report'

export const InlineHtmlReportCommentable = props => {
    if (!props.shouldRender) return null

    return (
        <div id="report-container">
            <DownloadOptions onDownloadXlsClick={props.onDownloadXlsClick} />
            <ShareComponent
                reportComment={props.reportComment}
                dataSetId={props.dataSetId}
                orgUnitId={props.orgUnitId}
                period={props.period}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
            <Report reportHtml={props.reportHtml} />
        </div>
    )
}

InlineHtmlReportCommentable.propTypes = {
    shouldRender: PropTypes.bool.isRequired,
    onDownloadXlsClick: DownloadOptions.propTypes.onDownloadXlsClick,
    reportHtml: Report.propTypes.reportHtml,
    dataSetId: ShareComponent.propTypes.dataSetId,
    orgUnitId: ShareComponent.propTypes.orgUnitId,
    reportComment: ShareComponent.propTypes.reportComment,
    period: ShareComponent.propTypes.period,
    shareDataSetReportComment:
        ShareComponent.propTypes.shareDataSetReportComment,
    setDataSetReportComment: ShareComponent.propTypes.setDataSetReportComment,
}
