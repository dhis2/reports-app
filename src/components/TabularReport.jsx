import PropTypes from 'prop-types'
import React from 'react'
import ReportLoader from './ReportLoader.jsx'
import { DownloadOptions } from './TabularReport/DownloadOptions.jsx'
import ReportTable from './TabularReport/ReportTable.jsx'

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
