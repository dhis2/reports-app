import PropTypes from 'prop-types'
import React from 'react'
import ReportLoader from './ReportLoader'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import ReportTable from './TabularReport/ReportTable'

const TabularReport = ({ content, isLoading, fileUrls }) => (
    <ReportLoader content={content} isLoading={isLoading}>
        <div className="tabular-report">
            <DownloadOptions fileUrls={fileUrls} />
            <ReportTable content={content} />
        </div>
    </ReportLoader>
)

TabularReport.propTypes = {
    content: PropTypes.object.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default TabularReport
