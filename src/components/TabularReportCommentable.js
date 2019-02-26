import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import { ReportComment } from './TabularReport/ReportComment'
import ReportTable from './TabularReport/ReportTable'

export const TabularReportCommentable = props => {
    if (!props.shouldRender) return null

    return (
        <div id="report-container">
            <DownloadOptions onDownloadXlsClick={props.onDownloadXlsClick} />
            <ReportComment
                comment={props.reportComment}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
            <ReportTable reportHtml={props.reportHtml} />
        </div>
    )
}

TabularReportCommentable.propTypes = {
    shouldRender: PropTypes.bool.isRequired,
    onDownloadXlsClick: DownloadOptions.propTypes.onDownloadXlsClick,
    reportHtml: ReportTable.propTypes.reportHtml,
    reportComment: ReportComment.propTypes.comment,
    shareDataSetReportComment:
        ReportComment.propTypes.shareDataSetReportComment,
    setDataSetReportComment: ReportComment.propTypes.setDataSetReportComment,
}
