import PropTypes from 'prop-types'
import React from 'react'
import ReportLoader from '../../components/ReportLoader.js'
import { DownloadOptions } from '../../components/TabularReport/DownloadOptions.js'
import { ReportComment } from '../../components/TabularReport/ReportComment.js'
import ReportTable from '../../components/TabularReport/ReportTable.js'
import { reportContent } from '../../utils/react/propTypes.js'
import HtmlReport from '../standard-report/HtmlReport.js'

const DataSetReportOutput = (props) => (
    <ReportLoader content={props.content} isLoading={props.isLoading}>
        <div className="tabular-report">
            <ReportComment
                comment={props.reportComment}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
            <DownloadOptions fileUrls={props.fileUrls} />
            {props.isHtmlReport ? (
                <HtmlReport html={props.content.data} />
            ) : (
                !!props.content.length &&
                props.content.map((table) => (
                    <ReportTable key={table.title} content={table} />
                ))
            )}
        </div>
    </ReportLoader>
)

DataSetReportOutput.propTypes = {
    content: reportContent.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isHtmlReport: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    reportComment: ReportComment.propTypes.comment,
    setDataSetReportComment: ReportComment.propTypes.setDataSetReportComment,
    shareDataSetReportComment:
        ReportComment.propTypes.shareDataSetReportComment,
}

export default DataSetReportOutput
