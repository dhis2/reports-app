/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { Button, DropDown } from '@dhis2/d2-ui-core';

/* js-xlsx */
import XLSX from 'xlsx';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../redux/actions/feedback';

/* i18n */
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets';
import PeriodPickerComponent from '../../components/period-picker-with-period-type/PeriodPickerWithPeriodType';
import Report from '../../components/report/Report';

/* utils */
import { getDocsUrl } from '../../utils/getDocsUrl';
import { LOADING, SUCCESS } from '../../utils/feedbackSnackBarTypes';

/* styles */
import styles from '../../styles';

const BASED_ON_OPTIONS = [
    {
        id: 'registration',
        displayName: i18n.t(i18nKeys.reportingRateSummary.basedOnCompleteOptionLabel),
    },
    {
        id: 'compulsory',
        displayName: i18n.t(i18nKeys.reportingRateSummary.basedOnCompulsoryOptionLabel),
    },
];

export default class ReportingRateSummary extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedDataSet: null,
            selectedOrgUnit: null,
            selectedOptionsForOrganisationUnitGroupSets: {},
            showOptions: false,
            selectedPeriod: null,
            selectedCriteria: BASED_ON_OPTIONS[0].id,
            loading: false,
        };
    }

    goToForm = () => {
        this.setState({
            showForm: true,
        });
    };

    exportReportToXls = () => {
        const reportTables = document.querySelectorAll('#report-container table');
        const workbook = XLSX.utils.book_new();
        for (let i = 0; i < reportTables.length; i++) {
            const worksheet = XLSX.utils.table_to_sheet(reportTables[i]);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${i}`);
        }
        XLSX.writeFile(workbook, 'report.xlsx');
    };

    getReport = () => {
        this.setState({ loading: true });
        this.props.updateFeedbackState(true, { type: LOADING });

        const api = this.props.d2.Api.getApi();
        const groupUids = Object.keys(this.state.selectedOptionsForOrganisationUnitGroupSets)
            .map(orgUnitGroupKey => this.state.selectedOptionsForOrganisationUnitGroupSets[orgUnitGroupKey]);
        const dataSetId = this.state.selectedDataSet ? this.state.selectedDataSet.id : null;

        // eslint-disable-next-line
        const url = `organisationUnits/${this.state.selectedOrgUnit}/rateSummary?ds=${dataSetId}&pe=${this.state.selectedPeriod}&criteria=${this.state.selectedCriteria}&groupUids=${groupUids}`;
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

    toggleShowOptions = () => {
        const newShowOptionsValue = !this.state.showOptions;
        this.setState({
            showOptions: newShowOptionsValue,
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
        });
    };

    handlePeriodChange = (selectedPeriod) => {
        this.setState({
            selectedPeriod,
        });
    };

    handleOrganisationUnitGroupSetChange = (organisationUnitGroupSetId, event) => {
        // copy of current selections
        const selectedOptionsForOrganisationUnitGroupSets = {
            ...this.state.selectedOptionsForOrganisationUnitGroupSets,
        };
        selectedOptionsForOrganisationUnitGroupSets[organisationUnitGroupSetId] = event.target.value;

        this.setState({
            selectedOptionsForOrganisationUnitGroupSets,
        });
    };

    handleCriteriaChange = (event) => {
        const selectedCriteria = event.target.value;
        this.setState({
            selectedCriteria,
        });
    };

    renderExtraOptions = () => (
        <div>
            <span
                id="extra-options-action"
                style={styles.showMoreOptionsButton}
                role="button"
                tabIndex="0"
                onClick={this.toggleShowOptions}
            >
                {i18n.t(this.state.showOptions ?
                    i18nKeys.reportingRateSummary.showFewOptions : i18nKeys.reportingRateSummary.showMoreOptions)}
            </span>
            <div id="extra-options" style={this.state.showOptions ? styles.showOptions : styles.hideOptions}>
                <OrganisationUnitGroupOptions
                    values={this.state.selectedOptionsForOrganisationUnitGroupSets}
                    onChange={this.handleOrganisationUnitGroupSetChange}
                />
            </div>
        </div>
    );

    isFormValid() {
        return this.state.selectedOrgUnit &&
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
                    { i18n.t(i18nKeys.reportingRateSummary.header) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div id="report-rate-summary-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <div style={styles.formLabel}>
                                    {i18n.t(i18nKeys.reportingRateSummary.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                                {this.renderExtraOptions()}
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <div id="criteria-selection">
                                    <span style={styles.formLabel}>
                                        {i18n.t(i18nKeys.reportingRateSummary.basedOnLabel)}
                                    </span>
                                    <DropDown
                                        fullWidth
                                        value={this.state.selectedCriteria}
                                        onChange={this.handleCriteriaChange}
                                        menuItems={BASED_ON_OPTIONS}
                                    />
                                </div>
                                <div id="data-set-selection">
                                    <DataSets
                                        onChange={this.handleDataSetChange}
                                    />
                                </div>
                                <div id="report-period">
                                    <PeriodPickerComponent
                                        label={i18n.t(i18nKeys.reportingRateSummary.reportPeriodLabel)}
                                        onChange={this.handlePeriodChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="main-action-button" style={styles.actionsContainer}>
                            <Button
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(i18nKeys.reportingRateSummary.mainAction)}
                            </Button>
                        </div>
                    </div>
                    {this.state.reportHtml && !this.state.showForm &&
                        <div
                            id="report-container"
                            style={{ display: this.state.reportHtml && !this.state.showForm ? 'block' : 'none' }}
                        >
                            <div id="download-options-container" style={styles.downloadContainer}>
                                <span
                                    style={styles.downloadButton}
                                    role="button"
                                    tabIndex="0"
                                    onClick={this.exportReportToXls}
                                >
                                    {i18n.t(i18nKeys.dataSetReport.exportReport)}
                                </span>
                            </div>
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

export const ConnectedReportingRateSummary = connect(
    null,
    mapDispatchToProps,
)(ReportingRateSummary);
