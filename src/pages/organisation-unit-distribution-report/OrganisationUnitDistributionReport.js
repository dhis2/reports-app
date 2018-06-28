/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* js-xlsx */
import XLSX from 'xlsx';

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
// import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import globalStyles from '../../styles';
import styles from './OrganisationUnitDistributionReport.style';

class OrganisationUnitDistributionReport extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedGroupSet: null,
            selectedOrgUnit: null,
            loading: false,
        };
    }

    // eslint-disable-next-line
    componentWillReceiveProps(newProps) {
        /* FIXME make this code more readable */
        const newState = {
            showForm: (newProps.hasOwnProperty('showForm') ? newProps.showForm : this.state.showForm),
            reportHtml: (newProps.hasOwnProperty('reportHtml') ? newProps.reportHtml : this.state.reportHtml),
            selectedOrgUnit:
                (newProps.hasOwnProperty('selectedOrgUnit') ? newProps.selectedOrgUnit : this.state.selectedOrgUnit),
            selectedGroupSet:
                (newProps.hasOwnProperty('selectedGroupSet') ? newProps.selectedGroupSet : this.state.selectedGroupSet),
            loading: (newProps.hasOwnProperty('loading') ? newProps.loading : this.state.loading),
        };

        this.setState(newState);
    }

    goToForm = () => {
        this.setState({
            showForm: true,
        });
    }

    exportReportToXls = () => {
        const reportTables = document.querySelectorAll('#report-container table');
        const workbook = XLSX.utils.book_new();
        for (let i = 0; i < reportTables.length; i++) {
            const worksheet = XLSX.utils.table_to_sheet(reportTables[i]);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${i}`);
        }
        XLSX.writeFile(workbook, 'report.xlsx');
    }

    getReport = () => {

    }

    getChart = () => {

    }

    handleOrganisationUnitChange = (selectedOrgUnit) => {
        this.setState({
            selectedOrgUnit,
        });
    }

    handleGroupSetChange = (selectedGroupSet) => {
        this.setState({
            selectedGroupSet,
        });
    }

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
                <Paper style={globalStyles.container}>
                    <div id="org-unit-dist-report-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div style={globalStyles.formLabel}>
                                    {i18n.t(i18nKeys.organisationUnitDistributionReport.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <GroupSets
                                    onChange={this.handleGroupSetChange}
                                />
                            </div>
                        </div>
                        <div style={globalStyles.actionsContainer}>
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
                    { this.state.reportHtml && !this.state.showForm &&
                    <div
                        id="report-container"
                        style={{ display: this.state.reportHtml && !this.state.showForm ? 'block' : 'none' }}
                    >
                        <div style={styles.downloadContainer}>
                            <span
                                style={styles.downloadButton}
                                role="button"
                                tabIndex="0"
                                onClick={this.exportReportToXls}
                            >
                                {i18n.t(i18nKeys.organisationUnitDistributionReport.exportReport)}
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

export default OrganisationUnitDistributionReport;
