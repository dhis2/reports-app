import { CircularProgress } from '@dhis2/d2-ui-core'
import isEmpty from 'lodash.isempty'
import PropTypes from 'prop-types'
import React from 'react'
import { reportContent } from '../utils/react/propTypes'
import './ReportLoader/styles.css'

const ReportLoader = ({ isLoading, content, children }) => {
    if (isLoading) {
        return (
            <div className="report-loader">
                <CircularProgress />
            </div>
        )
    }

    if (isEmpty(content)) {
        return null
    }

    return children
}

ReportLoader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    content: reportContent.isRequired,
    children: PropTypes.node.isRequired,
}

export default ReportLoader
