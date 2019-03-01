import React from 'react'
import PropTypes from 'prop-types'
import { InputField, Button } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'

const isCommentingActionEnabled = comment => comment.trim()
const actionButtonPlaceholder = i18n.t('Share')
const inputFieldPlaceholder = i18n.t(
    'Write a comment, question or interpretation of this report'
)

export const ReportComment = props => (
    <div id="share-component">
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
                disabled={!isCommentingActionEnabled(props.comment)}
            >
                {actionButtonPlaceholder}
            </Button>
        </div>
    </div>
)

ReportComment.propTypes = {
    comment: PropTypes.string.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
}
