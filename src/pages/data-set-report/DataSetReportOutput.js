import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from '../../components/TabularReport/DownloadOptions'
import ReportTable from '../../components/TabularReport/ReportTable'
import { ReportComment } from '../../components/TabularReport/ReportComment'
import ReportLoader from '../../components/ReportLoader'
import { reportContent } from '../../utils/react/propTypes'
import IframeReport from '../../components/IframeReport'

const DataSetReportOutput = props => (
    <ReportLoader content={props.content} isLoading={props.isLoading}>
        <div className="tabular-report">
            <ReportComment
                comment={props.reportComment}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
            <DownloadOptions fileUrls={props.fileUrls} />
            {props.isHtmlReport ? (
                <IframeReport
                    content={props.content.data}
                    title="dataset-report"
                    withStyle={true}
                />
            ) : (
                !!props.content.length &&
                props.content.map(table => (
                    <ReportTable key={table.title} content={table} />
                ))
            )}
        </div>
    </ReportLoader>
)

DataSetReportOutput.propTypes = {
    isHtmlReport: PropTypes.bool.isRequired,
    content: reportContent.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,
    reportComment: ReportComment.propTypes.comment,
    shareDataSetReportComment:
        ReportComment.propTypes.shareDataSetReportComment,
    setDataSetReportComment: ReportComment.propTypes.setDataSetReportComment,
}

export default DataSetReportOutput
