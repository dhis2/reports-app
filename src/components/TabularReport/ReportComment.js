import i18n from '@dhis2/d2-i18n'
import { InputField, Button } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'

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
        <style jsx>{`
            div > div {
                margin: 16px 0;
            }
        `}</style>
    </div>
)

ReportComment.propTypes = {
    comment: PropTypes.string.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
}
