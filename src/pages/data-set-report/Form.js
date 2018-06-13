/* React */
import React, { PureComponent } from 'react';

/* d2-ui components */
import { CheckBox, Button } from '@dhis2/d2-ui-core';

/* App components */
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets';
import DataSetOptions from '../../components/data-set-dimensions/DataSetDimensions';
import PeriodPickerComponent from '../../components/period-picker-with-period-type/PeriodPickerWithPeriodType';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import styles from '../../styles';
import formStyles from './Form.style';

class DataSetReportForm extends PureComponent {
    constructor() {
        super();

        this.state = {
            selectedDataSet: null,
            selectedDataSetOnly: false,
            selectedOrgUnit: null,
            selectedOptionsForDimensions: {},
            selectedOptionsForOrganisationUnitGroupSets: {},
            showOptions: false,
            selectedPeriod: null,
        };
    }

    getReport = () => {

    }

    toggleShowOptions = () => {
        const newShowOptionsValue = !this.state.showOptions;
        this.setState({
            showOptions: newShowOptionsValue,
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
            <div className="row">
                <div className="col-md-6">
                    <div style={styles.formLabel}>
                        {i18n.t(i18nKeys.dataSetReport.organisationUnitLabel)}
                    </div>
                    <OrganisationUnitsTree />
                    <span
                        style={formStyles.showMoreOptionsButton}
                        role="button"
                        tabIndex="0"
                        onClick={this.toggleShowOptions}
                    >
                        {i18n.t(i18nKeys.dataSetReport.showMoreOptions)}
                    </span>
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
                <div style={styles.actionsContainer}>
                    <Button
                        raised
                        color="primary"
                        onClick={this.getReport}
                    >
                        {i18n.t(i18nKeys.dataSetReport.mainAction)}
                    </Button>
                </div>
            </div>
        );
    }
}

export default DataSetReportForm;
