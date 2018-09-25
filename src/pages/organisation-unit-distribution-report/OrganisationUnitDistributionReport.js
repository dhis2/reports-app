/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* js-xlsx */
import XLSX from 'xlsx';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../actions/feedback';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import GroupSets from '../../components/group-sets-dropdown/GroupSetsDropdown';
import Report from '../../components/report/Report';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import styles from '../../styles';

export default class OrganisationUnitDistributionReport extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedGroupSet: null,
            selectedOrgUnit: null,
            loading: false,
            imageUrl: null,
        };
    }

    goToForm = () => {
        this.setState({
            showForm: true,
        });
    };

    handleChartLoaded = () => {
        this.setState({ loading: false });
        this.props.updateFeedbackState(
            true,
            {
                type: SUCCESS,
                message: i18n.t(i18nKeys.messages.chartGenerated),
            },
        );
    };

    handleChartLoadingError = () => {
        this.manageError();
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
        // eslint-disable-next-line
        const url = `organisationUnits/${this.state.selectedOrgUnit}/distributionReport?groupSetId=${this.state.selectedGroupSet}`;
        const api = this.props.d2.Api.getApi();

        api.get(url).then((response) => {
            this.setState({ reportHtml: response, imageUrl: null, showForm: false, loading: false });
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

    getChart = () => {
        const api = this.props.d2.Api.getApi();
        const timestamp = new Date().getTime();

        // eslint-disable-next-line
        const imageUrl = `${api.baseUrl}/organisationUnits/${this.state.selectedOrgUnit}/distributionChart.png?groupSetId=${this.state.selectedGroupSet}&t=${timestamp}`;

        this.setState({ reportHtml: null, imageUrl, showForm: false, loading: true });
        this.props.updateFeedbackState(true, { type: LOADING });
    };

    handleOrganisationUnitChange = (selectedOrgUnit) => {
        this.setState({
            selectedOrgUnit,
        });
    };

    handleGroupSetChange = (selectedGroupSet) => {
        this.setState({
            selectedGroupSet,
        });
    };

    isFormValid() {
        return this.state.selectedOrgUnit && this.state.selectedGroupSet;
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
                    { i18n.t(i18nKeys.organisationUnitDistributionReport.header) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div id="org-unit-dist-report-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div style={styles.formLabel}>
                                    {i18n.t(i18nKeys.organisationUnitDistributionReport.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <div id="group-sets-selection">
                                    <GroupSets
                                        onChange={this.handleGroupSetChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="actions" style={styles.actionsContainer}>
                            <Button
                                style={styles.actionButton}
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(i18nKeys.organisationUnitDistributionReport.getReportAction)}
                            </Button>
                            <Button
                                style={styles.actionButton}
                                raised
                                color="accent"
                                onClick={this.getChart}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(i18nKeys.organisationUnitDistributionReport.getChartAction)}
                            </Button>
                        </div>
                    </div>
                    { !this.state.showForm &&
                    <div
                        id="report-container"
                        style={{ display: !this.state.showForm ? 'block' : 'none' }}
                    >
                        {this.state.reportHtml &&
                            <div id="download-options-container" style={styles.downloadContainer}>
                                <span
                                    style={styles.downloadButton}
                                    role="button"
                                    tabIndex="0"
                                    onClick={this.exportReportToXls}
                                >
                                    {i18n.t(i18nKeys.organisationUnitDistributionReport.exportReport)}
                                </span>
                            </div>
                        }
                        { this.state.reportHtml &&
                            <Report reportHtml={this.state.reportHtml} />
                        }
                        { this.state.imageUrl &&
                            <img
                                onLoad={this.handleChartLoaded}
                                onError={this.handleChartLoadingError}
                                alt={i18n.t(i18nKeys.organisationUnitDistributionReport.getChartAction)}
                                src={this.state.imageUrl}
                            />
                        }
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

export const ConnectedOrganisationUnitDistributionReport = connect(
    null,
    mapDispatchToProps,
)(OrganisationUnitDistributionReport);
