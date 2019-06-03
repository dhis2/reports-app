import { CircularProgress } from '@dhis2/d2-ui-core'
import isEmpty from 'lodash.isempty'
import PropTypes from 'prop-types'
import React from 'react'
import { reportContent } from '../utils/react/propTypes'

const ReportLoader = ({ isLoading, content, children }) => {
    if (isLoading) {
        return (
            <div className="report-loader">
                <CircularProgress />
                <style jsx>{`
                    div {
                        margin: 48px 0;
                        text-align: center;
                    }
                `}</style>
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
