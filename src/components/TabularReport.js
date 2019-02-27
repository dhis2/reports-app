import React from 'react'
import PropTypes from 'prop-types'
import { DownloadOptions } from './TabularReport/DownloadOptions'
import ReportTable from './TabularReport/ReportTable'
import { CircularProgress } from '@dhis2/d2-ui-core'
import isEmpty from 'lodash.isempty'
import './TabularReport/styles.css'

const TabularReport = ({ content, isLoading, fileUrls }) => {
    if (isLoading) {
        return (
            <div className="tabular-report__loader">
                <CircularProgress />
            </div>
        )
    }

    if (isEmpty(content)) {
        return null
    }

    return (
        <div className="tabular-report">
            <DownloadOptions fileUrls={fileUrls} />
            <ReportTable content={content} />
        </div>
    )
}

TabularReport.propTypes = {
    content: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,
}

export default TabularReport
