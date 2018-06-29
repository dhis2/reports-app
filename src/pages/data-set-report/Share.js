/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { InputField, Button } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* utils */
import { ERROR, LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

export class Share extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        updateAppState: PropTypes.func.isRequired,
        dataSetId: PropTypes.string.isRequired,
        period: PropTypes.string.isRequired,
        orgUnitId: PropTypes.string.isRequired,
    }

    constructor() {
        super();

        this.state = {
            comment: '',
        };
    }

    shareComment = () => {
        // eslint-disable-next-line
        const url = `interpretations/dataSetReport/${this.props.dataSetId}?pe=${this.props.period}&ou=${this.props.orgUnitId}`;
        const api = this.props.d2.Api.getApi();

        this.props.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.messages.loading),
            },
        });

        const headersRequest = {
            headers: {
                'content-type': 'text/plain',
            },
        };

        api.post(url, this.state.comment, headersRequest).then(() => {
            this.props.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: SUCCESS,
                    message: i18n.t(i18nKeys.messages.interpretationShared),
                },
            });
        }).catch((error) => {
            const messageError = error && error.message ?
                error.message :
                i18n.t(i18nKeys.messages.unexpectedError);

            this.props.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: ERROR,
                    message: messageError,
                },
            });
        });
    }

    handleCommentChange = (comment) => {
        this.setState({
            comment,
        });
    }

    isSharedActionEnabled() {
        return this.state.comment.trim();
    }

    render() {
        return (
            <div>
                <InputField
                    placeholder={i18n.t(i18nKeys.dataSetReport.sharePlaceholder)}
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
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <Share
                d2={appContext.d2}
                updateAppState={appContext.updateAppState}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
