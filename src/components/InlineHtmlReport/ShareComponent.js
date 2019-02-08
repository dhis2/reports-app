import React from 'react'
import PropTypes from 'prop-types'
import ShareComment from './Share'

export const ShareComponent = props => (
    <div id="share-component">
        <ShareComment
            comment={props.reportComment}
            dataSetId={props.dataSetId}
            period={props.period}
            orgUnitId={props.orgUnitId}
            shareDataSetReportComment={props.shareDataSetReportComment}
            setDataSetReportComment={props.setDataSetReportComment}
        />
    </div>
)

ShareComponent.propTypes = {
    reportComment: PropTypes.string.isRequired,
    dataSetId: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
}
