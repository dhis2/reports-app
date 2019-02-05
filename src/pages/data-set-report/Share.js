/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/* d2-ui components */
import { InputField, Button } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import { updateFeedbackState } from '../../redux/actions/feedback'

/* App context */
import AppContext from '../../pages/AppContext'

/* i18n */
import i18n from '../../utils/i18n/locales'
import { i18nKeys } from '../../utils/i18n/i18nKeys'

/* utils */
import { ERROR, LOADING, SUCCESS } from '../../utils/feedbackSnackBarTypes'

export class Share extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        updateFeedbackState: PropTypes.func.isRequired,
        dataSetId: PropTypes.string.isRequired,
        period: PropTypes.string.isRequired,
        orgUnitId: PropTypes.string.isRequired,
    }

    constructor() {
        super()

        this.state = {
            comment: '',
        }
    }

    shareComment = () => {
        // eslint-disable-next-line
        const url = `interpretations/dataSetReport/${this.props.dataSetId}?pe=${
            this.props.period
        }&ou=${this.props.orgUnitId}`
        const api = this.props.d2.Api.getApi()

        this.props.updateFeedbackState(true, { type: LOADING })

        const headersRequest = {
            headers: {
                'content-type': 'text/plain',
            },
        }

        api.post(url, this.state.comment, headersRequest)
            .then(() => {
                this.props.updateFeedbackState(true, {
                    type: SUCCESS,
                    message: i18n.t(i18nKeys.messages.interpretationShared),
                })
            })
            .catch(error => {
                const messageError =
                    error && error.message
                        ? error.message
                        : i18n.t(i18nKeys.messages.unexpectedError)

                this.props.updateFeedbackState(true, {
                    type: ERROR,
                    message: messageError,
                })
            })
    }

    handleCommentChange = comment => {
        this.setState({
            comment,
        })
    }

    isSharedActionEnabled() {
        return this.state.comment.trim()
    }

    render() {
        return (
            <div>
                <InputField
                    placeholder={i18n.t(
                        i18nKeys.dataSetReport.sharePlaceholder
                    )}
                    type="text"
                    multiline
                    fullWidth
                    value={this.state.comment}
                    onChange={this.handleCommentChange}
                />
                <Button
                    raised
                    color="primary"
                    onClick={this.shareComment}
                    disabled={!this.isSharedActionEnabled()}
                >
                    {i18n.t(i18nKeys.dataSetReport.share)}
                </Button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
})

export const ConnectedShare = connect(
    null,
    mapDispatchToProps
)(Share)

export default props => (
    <AppContext.Consumer>
        {appContext => <ConnectedShare d2={appContext.d2} {...props} />}
    </AppContext.Consumer>
)
