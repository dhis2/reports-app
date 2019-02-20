import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './InlineHtmlReport/DownloadOptions'
import { HtmlReportComment } from './InlineHtmlReport/HtmlReportComment'
import Report from './Report'

export const InlineHtmlReportCommentable = props => {
    if (!props.shouldRender) return null

    return (
        <div id="report-container">
            <DownloadOptions onDownloadXlsClick={props.onDownloadXlsClick} />
            <HtmlReportComment
                comment={props.reportComment}
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
    reportComment: HtmlReportComment.propTypes.comment,
    shareDataSetReportComment:
        HtmlReportComment.propTypes.shareDataSetReportComment,
    setDataSetReportComment:
        HtmlReportComment.propTypes.setDataSetReportComment,
}
