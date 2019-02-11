import React from 'react'
import PropTypes from 'prop-types'
import { InputField, Button } from '@dhis2/d2-ui-core'
import i18n from '../../utils/i18n/locales'

const isSharedActionEnabled = comment => comment.trim()
const actionButtonPlaceholder = i18n.t('Share')
const inputFieldPlaceholder = i18n.t(
    'Write a comment, question or interpretation of this report'
)

const Share = props => (
    <div>
        <InputField
            placeholder={inputFieldPlaceholder}
            type="text"
            multiline
            fullWidth
            value={props.comment}
            onChange={props.setDataSetReportComment}
        />
        <Button
            raised
            color="primary"
            onClick={props.shareDataSetReportComment}
            disabled={!isSharedActionEnabled(props.comment)}
        >
            {actionButtonPlaceholder}
        </Button>
    </div>
)

Share.propTypes = {
    dataSetId: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    orgUnitId: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
}

export default Share
