/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Paper } from 'material-ui';

/* d2-ui components */
import { CheckBox, Button } from '@dhis2/d2-ui-core';

/* js-xlsx */
import XLSX from 'xlsx';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* App components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets';
import DataSetOptions from '../../components/data-set-dimensions/DataSetDimensions';
import PeriodPickerComponent from '../../components/period-picker-with-period-type/PeriodPickerWithPeriodType';
import ShareComment from './Share';
import Report from '../../components/report/Report';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import globalStyles from '../../styles';
import styles from './DataSetReport.style';

class DataSetReport extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedDataSet: null,
            selectedDataSetOnly: false,
            selectedOrgUnit: null,
            selectedOptionsForDimensions: {},
            selectedOptionsForOrganisationUnitGroupSets: {},
            showOptions: false,
            selectedPeriod: null,
            comment: '',
            loading: false,
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
            selectedDataSetOnly:
                (newProps.hasOwnProperty('selectedDataSetOnly') ?
                    newProps.selectedDataSetOnly : this.state.selectedDataSetOnly),
            selectedOrgUnit:
                (newProps.hasOwnProperty('selectedOrgUnit') ? newProps.selectedOrgUnit : this.state.selectedOrgUnit),
            selectedOptionsForDimensions:
                (newProps.hasOwnProperty('selectedOptionsForDimensions') ?
                    newProps.selectedOptionsForDimensions : this.state.selectedOptionsForDimensions),
            selectedOptionsForOrganisationUnitGroupSets:
                (newProps.hasOwnProperty('selectedOptionsForOrganisationUnitGroupSets') ?
                    newProps.selectedOptionsForOrganisationUnitGroupSets :
                    this.state.selectedOptionsForOrganisationUnitGroupSets),
            showOptions: (newProps.hasOwnProperty('showOptions') ? newProps.showOptions : this.state.showOptions),
            selectedPeriod:
                (newProps.hasOwnProperty('selectedPeriod') ? newProps.selectedPeriod : this.state.selectedPeriod),
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
        this.props.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.messages.loading),
            },
            pageState: {
                loading: true,
            },
        });

        const api = this.props.d2.Api.getApi();
        const dataSetOptions = Object.keys(this.state.selectedOptionsForDimensions)
            .map(dimensionKey => `${dimensionKey}:${this.state.selectedOptionsForDimensions[dimensionKey]}`);
        const orgUnitGroupsOptions = Object.keys(this.state.selectedOptionsForOrganisationUnitGroupSets)
            .map(orgUnitGroupKey =>
                `${orgUnitGroupKey}:${this.state.selectedOptionsForOrganisationUnitGroupSets[orgUnitGroupKey]}`,
            );
        const dimensions = [...dataSetOptions, ...orgUnitGroupsOptions];

        // eslint-disable-next-line
        const url = `dataSetReport?ds=${this.state.selectedDataSet}&pe=${this.state.selectedPeriod}&ou=${this.state.selectedOrgUnit}&selectedUnitOnly=${this.state.selectedDataSetOnly}&dimension=${dimensions}`;
        api.get(url).then((response) => {
            this.props.updateAppState({
                pageState: {
                    reportHtml: response,
                    showForm: false,
                    loading: false,
                },
                showSnackbar: true,
                snackbarConf: {
                    type: SUCCESS,
                    message: i18n.t(i18nKeys.messages.reportGenerated),
                },
            });
        }).catch((error) => {
            this.manageError(error);
        });
    }

    toggleShowOptions = () => {
        const newShowOptionsValue = !this.state.showOptions;
        this.setState({
            showOptions: newShowOptionsValue,
        });
    }

    handleOrganisationUnitChange = (selectedOrgUnit) => {
        this.setState({
            selectedOrgUnit,
        });
    }

    handleDataSetChange = (selectedDataSet) => {
        /* update selected data set and reset options */
        this.setState({
            selectedDataSet,
            selectedOptionsForDimensions: {},
        });
    }

    handleDimensionChange = (dimensionsId, event) => {
        // copy of current selections
        const selectedOptionsForDimensions = { ...this.state.selectedOptionsForDimensions };
        selectedOptionsForDimensions[dimensionsId] = event.target.value;

        this.setState({
            selectedOptionsForDimensions,
        });
    }

    handlePeriodChange = (selectedPeriod) => {
        this.setState({
            selectedPeriod,
        });
    }

    handleSelectedDataSetOnlyChange = (event, selectedDataSetOnly) => {
        this.setState({
            selectedDataSetOnly,
        });
    }

    handleOrganisationUnitGroupSetChange = (organisationUnitGroupSetId, event) => {
        // copy of current selections
        const selectedOptionsForOrganisationUnitGroupSets = {
            ...this.state.selectedOptionsForOrganisationUnitGroupSets,
        };
        selectedOptionsForOrganisationUnitGroupSets[organisationUnitGroupSetId] = event.target.value;

        this.setState({
            selectedOptionsForOrganisationUnitGroupSets,
        });
    }

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
                    i18nKeys.dataSetReport.showFewOptions : i18nKeys.dataSetReport.showMoreOptions)}
            </span>
            <div id="extra-options" style={this.state.showOptions ? styles.showOptions : styles.hideOptions}>
                <OrganisationUnitGroupOptions
                    values={this.state.selectedOptionsForOrganisationUnitGroupSets}
                    onChange={this.handleOrganisationUnitGroupSetChange}
                />
            </div>
        </div>
    )

    isFormValid() {
        return this.state.selectedOrgUnit && this.state.selectedDataSet && this.state.selectedPeriod;
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
                    { i18n.t(i18nKeys.dataSetReport.header) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={globalStyles.container}>
                    <div id="data-set-report-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div style={globalStyles.formLabel}>
                                    {i18n.t(i18nKeys.dataSetReport.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                                {this.renderExtraOptions()}
                            </div>
                            <div className="col-md-6">
                                <DataSets
                                    onChange={this.handleDataSetChange}
                                />
                                {this.state.selectedDataSet &&
                                <DataSetOptions
                                    dataSetId={this.state.selectedDataSet}
                                    values={this.state.selectedOptionsForDimensions}
                                    onChange={this.handleDimensionChange}
                                />
                                }
                                <PeriodPickerComponent
                                    label={i18n.t(i18nKeys.dataSetReport.reportPeriodLabel)}
                                    onChange={this.handlePeriodChange}
                                />
                                <CheckBox
                                    onChange={this.handleSelectedDataSetOnlyChange}
                                    value={this.state.selectedDataSetOnly}
                                    label={i18n.t(i18nKeys.dataSetReport.selectedDataSetOnlyLabel)}
                                />
                            </div>
                        </div>
                        <div style={globalStyles.actionsContainer}>
                            <Button
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(i18nKeys.dataSetReport.mainAction)}
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
                                    {i18n.t(i18nKeys.dataSetReport.exportReport)}
                                </span>
                            </div>
                            <ShareComment
                                dataSetId={this.state.selectedDataSet}
                                period={this.state.selectedPeriod}
                                orgUnitId={this.state.selectedOrgUnit}
                            />
                            <Report reportHtml={this.state.reportHtml} />
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}

export default DataSetReport;
