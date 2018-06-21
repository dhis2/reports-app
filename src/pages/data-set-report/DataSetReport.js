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
import Report from './Report';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import styles from '../Page.style';
import formStyles from './Form.style';

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
        };

        this.setState(newState);
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
        });

        const api = this.props.d2.Api.getApi();
        const dataSetOptions = Object.keys(this.state.selectedOptionsForDimensions)
            .map(dimensionKey => `${dimensionKey}:${this.state.selectedOptionsForDimensions[dimensionKey]}`);
        const orgUnitGroupsOptions = Object.keys(this.state.selectedOptionsForOrganisationUnitGroupSets)
            .map(dimensionKey =>
                `${dimensionKey}:${this.state.selectedOptionsForOrganisationUnitGroupSets[dimensionKey]}`,
            );
        const dimensions = [...dataSetOptions, ...orgUnitGroupsOptions];

        // eslint-disable-next-line
        const url = `dataSetReport?ds=${this.state.selectedDataSet}&pe=${this.state.selectedPeriod}&ou=${this.state.selectedOrgUnit}&selectedUnitOnly=${this.state.selectedDataSetOnly}&dimension=${dimensions}`;
        api.get(url).then((response) => {
            this.props.updateAppState({
                pageState: {
                    reportHtml: response,
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
        <div style={this.state.showOptions ? formStyles.showOptions : formStyles.hideOptions}>
            <OrganisationUnitGroupOptions
                values={this.state.selectedOptionsForOrganisationUnitGroupSets}
                onChange={this.handleOrganisationUnitGroupSetChange}
            />
        </div>
    )

    render() {
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.dataSetReport.header) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={{ display: this.state.showForm ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div style={styles.formLabel}>
                                    {i18n.t(i18nKeys.dataSetReport.organisationUnitLabel)}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                                <span
                                    style={formStyles.showMoreOptionsButton}
                                    role="button"
                                    tabIndex="0"
                                    onClick={this.toggleShowOptions}
                                >
                                    {i18n.t(i18nKeys.dataSetReport.showMoreOptions)}
                                </span>
                                {this.renderExtraOptions()}
                                <div style={styles.actionsContainer}>
                                    <Button
                                        raised
                                        color="primary"
                                        onClick={this.getReport}
                                    >
                                        {i18n.t(i18nKeys.dataSetReport.mainAction)}
                                    </Button>
                                    <Button
                                        raised
                                        color="accent"
                                        onClick={this.exportReportToXls}
                                    >
                                        {i18n.t(i18nKeys.dataSetReport.exportReport)}
                                    </Button>
                                </div>
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
                    </div>
                    { this.state.reportHtml &&
                        <div id="report-container">
                            <Report reportHtml={this.state.reportHtml} />
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}

export default DataSetReport;
