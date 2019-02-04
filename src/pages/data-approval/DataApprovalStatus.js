/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import { Dialog } from 'material-ui';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* utils */
import {
    DataApprovalStatusEnum,
    DataApprovalActionsEnum,
    isReadyForApprove,
    isReadyForUnapprove,
    isReadyForAcceptance,
    isReadyForUnacceptance,
} from './dataApproval.conf';

/* styles */
import appStyles from '../../styles';

const styles = {
    notificationBar: {
        width: '100%',
        display: 'block',
        backgroundColor: '#f1f1f1',
        paddingTop: 8,
        paddingBottom: 8,
        textAlign: 'center',
        marginBottom: 16,
    },
};

export class DataApprovalStatus extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        dataSet: PropTypes.string.isRequired,
        periodId: PropTypes.string.isRequired,
        organisationUnitId: PropTypes.string.isRequired,
        onError: PropTypes.func.isRequired,
    };

    static resetState = {
        status: DataApprovalStatusEnum.NONE,
        mayApprove: false,
        mayUnapprove: false,
        mayAccept: false,
        mayUnaccept: false,
        showConfirm: false,
        action: null,
    };

    static closeDialogState = {
        showConfirm: false,
        action: null,
    };

    constructor() {
        super();
        this.state = DataApprovalStatus.resetState;
    }

    componentDidMount() {
        this.fetchApprovalStatus();
    }

    fetchApprovalStatus = () => {
        const { dataSet, periodId, organisationUnitId, d2 } = this.props;
        const url = `dataApprovals?ds=${dataSet.id}&pe=${periodId}&ou=${organisationUnitId}`;
        d2.Api.getApi().get(url).then((approvalResponse) => {
            this.httpResponseToState(approvalResponse);
        }).catch((error) => {
            this.props.onError(error);
        });
    };

    httpResponseToState = (approvalResponse) => {
        this.setState({
            status: approvalResponse.state,
            mayApprove: approvalResponse.mayApprove,
            mayUnapprove: approvalResponse.mayUnapprove,
            mayAccept: approvalResponse.mayAccept,
            mayUnaccept: approvalResponse.mayUnaccept,
        });
    };

    showConfirmAction = action => () => {
        this.setState({
            showConfirm: true,
            action,
        });
    };

    closeDialog = () => {
        this.setState({ ...DataApprovalStatus.closeDialogState });
    };

    handlerForCurrentAction = () => {
        switch (this.state.action) {
            case DataApprovalActionsEnum.APPROVE:
                return this.approve;
            case DataApprovalActionsEnum.UNAPPROVE:
                return this.unapprove;
            case DataApprovalActionsEnum.ACCEPT:
                return this.accept;
            case DataApprovalActionsEnum.UNACCEPT:
                return this.unaccept;
            default:
                return null;
        }
    };

    confirmDialogActions = () => [
        <Button
            color="primary"
            onClick={this.closeDialog}
        >
            {i18n.t(i18nKeys.dataApproval.confirmDialog.cancel)}
        </Button>,
        <Button
            color="primary"
            onClick={this.handlerForCurrentAction()}
        >
            {i18n.t(i18nKeys.dataApproval.confirmDialog.confirm)}
        </Button>,
    ];

    approve = () => {
        const { dataSet, periodId, organisationUnitId, d2 } = this.props;
        const url =
            `dataApprovals?ds=${dataSet.id}&pe=${periodId}&ou=${organisationUnitId}`;
        d2.Api.getApi().post(url).then(() => {
            this.fetchApprovalStatus();
        }).catch((error) => {
            this.props.onError(error);
        })
            .finally(() => {
                this.closeDialog();
            });
    };

    unapprove = () => {
        const { dataSet, periodId, organisationUnitId, d2 } = this.props;
        const url =
            `dataApprovals?ds=${dataSet.id}&pe=${periodId}&ou=${organisationUnitId}`;
        d2.Api.getApi().delete(url).then(() => {
            this.fetchApprovalStatus();
        }).catch((error) => {
            this.props.onError(error);
        })
            .finally(() => {
                this.closeDialog();
            });
    };

    accept = () => {
        const { dataSet, periodId, organisationUnitId, d2 } = this.props;
        const url =
            `dataAcceptances?ds=${dataSet.id}&pe=${periodId}&ou=${organisationUnitId}`;
        d2.Api.getApi().post(url).then(() => {
            this.fetchApprovalStatus();
        }).catch((error) => {
            this.props.onError(error);
        })
            .finally(() => {
                this.closeDialog();
            });
    };

    unaccept = () => {
        const { dataSet, periodId, organisationUnitId, d2 } = this.props;
        const url =
            `dataAcceptances?ds=${dataSet.id}&pe=${periodId}&ou=${organisationUnitId}`;
        d2.Api.getApi().delete(url).then(() => {
            this.fetchApprovalStatus();
        }).catch((error) => {
            this.props.onError(error);
        })
            .finally(() => {
                this.closeDialog();
            });
    };

    render() {
        return (
            <div>
                <span
                    style={styles.notificationBar}
                >
                    {`${i18n.t(i18nKeys.dataApproval.approvalStatusLabel)}:
                    ${i18n.t(i18nKeys.dataApproval.statusNotifications[this.state.status])}`}
                </span>
                <div id="approvalActions" >
                    { isReadyForApprove(this.state) &&
                    <Button
                        style={appStyles.actionButton}
                        raised
                        color="primary"
                        onClick={this.showConfirmAction(DataApprovalActionsEnum.APPROVE)}
                    >
                        {i18n.t(i18nKeys.dataApproval.buttonLabels.approve)}
                    </Button>
                    }
                    { isReadyForUnapprove(this.state) &&
                    <Button
                        style={appStyles.actionButton}
                        raised
                        color="primary"
                        onClick={this.showConfirmAction(DataApprovalActionsEnum.UNAPPROVE)}
                    >
                        {i18n.t(i18nKeys.dataApproval.buttonLabels.unapprove)}
                    </Button>
                    }
                    { isReadyForAcceptance(this.state) &&
                    <Button
                        style={appStyles.actionButton}
                        raised
                        color="primary"
                        onClick={this.showConfirmAction(DataApprovalActionsEnum.ACCEPT)}
                    >
                        {i18n.t(i18nKeys.dataApproval.buttonLabels.accept)}
                    </Button>
                    }
                    { isReadyForUnacceptance(this.state) &&
                    <Button
                        style={appStyles.actionButton}
                        raised
                        color="primary"
                        onClick={this.showConfirmAction(DataApprovalActionsEnum.UNACCEPT)}
                    >
                        {i18n.t(i18nKeys.dataApproval.buttonLabels.unaccept)}
                    </Button>
                    }
                </div>
                <Dialog
                    title={i18n.t(i18nKeys.dataApproval.confirmDialog.title)}
                    actions={this.confirmDialogActions()}
                    modal={false}
                    open={this.state.showConfirm}
                    onRequestClose={this.closeDialog}
                >
                    {i18n.t(i18nKeys.dataApproval.confirmActionNotifications[this.state.action])}
                </Dialog>
            </div>
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <DataApprovalStatus
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
