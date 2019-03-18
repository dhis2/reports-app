import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import ReportTable from './TabularReport/ReportTable'
import ReportLoader from './ReportLoader'
import './TabularReport/styles.css'

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
    isLoading: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,
}

export default TabularReport
