/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { Button, PeriodPicker } from '@dhis2/d2-ui-core';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import Report from '../../components/report/Report';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import styles from '../../styles';

class DataApproval extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    static childContextTypes = {
        d2: PropTypes.object.isRequired,
    }

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
        };
    }

    /* FIXME: right now d2-ui periodPicker forces us to pass d2 through old  context api */
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    // eslint-disable-next-line
    componentWillReceiveProps(newProps) {
        /* FIXME make this code more readable */
        const newState = {
            showForm: (newProps.hasOwnProperty('showForm') ? newProps.showForm : this.state.showForm),
            reportHtml: (newProps.hasOwnProperty('reportHtml') ? newProps.reportHtml : this.state.reportHtml),
            selectedDataSet:
                (newProps.hasOwnProperty('selectedDataSet') ? newProps.selectedDataSet : this.state.selectedDataSet),
            selectedOrgUnit:
                (newProps.hasOwnProperty('selectedOrgUnit') ? newProps.selectedOrgUnit : this.state.selectedOrgUnit),
            selectedPeriodType: (newProps.hasOwnProperty('selectedPeriodType')
                ? newProps.selectedPeriodType : this.state.selectedPeriodType),
            selectedPeriod:
                (newProps.hasOwnProperty('selectedPeriod') ? newProps.selectedPeriod : this.state.selectedPeriod),
            loading: (newProps.hasOwnProperty('loading') ? newProps.loading : this.state.loading),
        };

        this.setState(newState);
    }

    dataSetFilter = dataSet => !!dataSet.workflow;

    goToForm = () => {
        this.setState({
            showForm: true,
        });
    }

    getData = () => {

    }

    handleOrganisationUnitChange = (selectedOrgUnit) => {
        this.setState({
            selectedOrgUnit,
        });
    }

    handleDataSetChange = (selectedDataSet) => {
        this.setState({
            selectedDataSet: selectedDataSet ? selectedDataSet.id : null,
            selectedPeriodType: selectedDataSet ? selectedDataSet.workflow.periodType : null,
        });
    }

    handlePeriodChange = (selectedPeriod) => {
        this.setState({
            selectedPeriod,
        });
    }

    isFormValid() {
        return this.state.selectedOrgUnit &&
            this.state.selectedDataSet &&
            this.state.selectedPeriod;
    }

    isActionEnabled() {
        return this.isFormValid() && !this.state.loading;
    }

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
                                        fields="id,displayName,workflow[id,periodType]"
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

export default DataApproval;
