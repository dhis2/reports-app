import { CircularProgress } from '@dhis2/d2-ui-core'
import Paper from '@material-ui/core/Paper'
import isEmpty from 'lodash.isempty'
import PropTypes from 'prop-types'
import React from 'react'
import { reportContent } from '../utils/react/propTypes'
import { container } from '../utils/styles/shared.js'

const ReportLoader = ({ isLoading, content, children }) => {
    if (!isLoading && isEmpty(content)) {
        return null
    }

    const childrenToWrap = isLoading ? (
        <div className="report-loader">
            <CircularProgress />
            <style jsx>{`
                div {
                    margin: 48px 0;
                    text-align: center;
                }
            `}</style>
        </div>
    ) : (
        children
    )

    return <Paper className={container.className}>{childrenToWrap}</Paper>
}

ReportLoader.propTypes = {
    children: PropTypes.node.isRequired,
    content: reportContent.isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default ReportLoader
