/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { Button, PeriodPicker } from '@dhis2/d2-ui-core';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../actions/feedback';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import Report from '../../components/report/Report';
import DataApprovalStatusContainer from './DataApprovalStatus';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import styles from '../../styles';

export default class DataApproval extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    static childContextTypes = {
        d2: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedDataSet: null,
            selectedOrgUnit: null,
            selectedPeriod: null,
            selectedPeriodType: null,
            loading: false,
            dataApprovalLevels: [],
        };
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        const d2 = this.props.d2;
        d2.models.dataApprovalLevel.list({
            paging: false,
        }).then((dataApprovalLevelsResponse) => {
            this.setState({
                dataApprovalLevels: dataApprovalLevelsResponse.toArray(),
            });
        }).catch((error) => {
            this.manageError(error);
        });
    }

    dataSetFilter = dataSet => !!dataSet.workflow;

    goToForm = () => {
        this.setState({
            showForm: true,
        });
    };

    getData = () => {
        this.setState({ loading: true });
        this.props.updateFeedbackState(true, { type: LOADING });

        const api = this.props.d2.Api.getApi();

        // eslint-disable-next-line
        const url = `dataSetReport?ds=${this.state.selectedDataSet.id}&pe=${this.state.selectedPeriod}&ou=${this.state.selectedOrgUnit}`;
        api.get(url).then((response) => {
            this.setState({ reportHtml: response, showForm: false, loading: false });
            this.props.updateFeedbackState(
                true,
                {
                    type: SUCCESS,
                    message: i18n.t(i18nKeys.messages.reportGenerated),
                },
            );
        }).catch((error) => {
            this.manageError(error);
        });
    };

    handleOrganisationUnitChange = (selectedOrgUnit) => {
        this.setState({
            selectedOrgUnit,
        });
    };

    handleDataSetChange = (selectedDataSet) => {
        this.setState({
            selectedDataSet,
            selectedPeriodType: selectedDataSet ? selectedDataSet.workflow.periodType : null,
        });
    };

    handlePeriodChange = (selectedPeriod) => {
        this.setState({
            selectedPeriod,
        });
    };

    isApprovalStatusEnabled = () =>
        !this.state.showForm &&
        this.state.selectedDataSet &&
        this.state.selectedPeriod &&
        this.state.selectedOrgUnit;

    isFormValid = () =>
        this.state.selectedOrgUnit &&
        this.state.selectedDataSet &&
        this.state.selectedDataSet.id &&
        this.state.selectedPeriod;

    isActionEnabled = () => this.isFormValid() && !this.state.loading;

    render() {
        return (
            <div>
                <h1>
                    { !this.state.showForm &&
                    <span
                        id="back-button"
                        style={styles.backButton}
                        className="material-icons"
                        role="button"
                        tabIndex="0"
                        onClick={this.goToForm}
                    >
                                arrow_back
                    </span>
                    }
                    { i18n.t(i18nKeys.dataApproval.header) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div id="data-approval-status">
                        {this.isApprovalStatusEnabled() &&
                            <DataApprovalStatusContainer
                                dataSet={this.state.selectedDataSet}
                                periodId={this.state.selectedPeriod}
                                organisationUnitId={this.state.selectedOrgUnit}
                            />
                        }
                    </div>
                    <div id="data-approval-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div style={styles.formLabel}>
                                    {i18n.t(i18nKeys.dataApproval.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <div id="data-set-selection">
                                    <DataSets
                                        fields="id,displayName,workflow[id,periodType],categoryCombo[id,displayName]"
                                        filter={this.dataSetFilter}
                                        onChange={this.handleDataSetChange}
                                    />
                                </div>
                                {this.state.selectedDataSet &&
                                    <div id="report-period">
                                        <div style={styles.formLabel}>
                                            {i18n.t(i18nKeys.dataApproval.reportPeriodLabel)}
                                        </div>
                                        <PeriodPicker
                                            periodType={this.state.selectedPeriodType}
                                            onPickPeriod={this.handlePeriodChange}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        <div id="main-action-button" style={styles.actionsContainer}>
                            <Button
                                raised
                                color="primary"
                                onClick={this.getData}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(i18nKeys.dataApproval.mainAction)}
                            </Button>
                        </div>
                    </div>
                    {this.state.reportHtml && !this.state.showForm &&
                    <div
                        id="report-container"
                        style={{ display: this.state.reportHtml && !this.state.showForm ? 'block' : 'none' }}
                    >
                        <Report reportHtml={this.state.reportHtml} />
                    </div>
                    }
                </Paper>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
});

export const ConnectedDataApproval = connect(
    null,
    mapDispatchToProps,
)(DataApproval);
