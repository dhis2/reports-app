import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import ReportTable from './TabularReport/ReportTable'
import { CircularProgress } from '@dhis2/d2-ui-core'
import isEmpty from 'lodash.isempty'
import './TabularReport/styles.css'
import { ReportComment } from './TabularReport/ReportComment'

export const TabularReportCommentable = props => {
    if (props.isLoading) {
        return (
            <div className="tabular-report__loader">
                <CircularProgress />
            </div>
        )
    }

    if (isEmpty(props.content)) {
        return null
    }

    return (
        <div id="report-container">
            <DownloadOptions fileUrls={props.fileUrls} />
            <ReportComment
                comment={props.reportComment}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
            <ReportTable content={props.content} />
        </div>
    )
}

TabularReportCommentable.propTypes = {
    content: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,

    reportComment: ReportComment.propTypes.comment,
    shareDataSetReportComment:
        ReportComment.propTypes.shareDataSetReportComment,
    setDataSetReportComment: ReportComment.propTypes.setDataSetReportComment,
}
