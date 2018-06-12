/* React */
import React, { PureComponent } from 'react';

/* d2-ui components */
import { CheckBox, Button } from '@dhis2/d2-ui-core';

/* App components */
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets';
import DataSetOptions from '../../components/data-set-dimensions/DataSetDimensions';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import styles from './Form.style';

class DataSetReportForm extends PureComponent {
    constructor() {
        super();

        this.state = {
            selectedDataSet: null,
            selectedDataSetOnly: false,
            selectedOrgUnit: null,
            dimensions: [],
            selectedOptionsForDimensions: {},
            organisationUnitGroupSets: [],
            selectedOptionsForOrganisationUnitGroupSets: {},
            showOptions: false,
        };
    }

    getReport = () => {

    }

    cancelReport = () => {

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
            dimensions: [],
            selectedOptionsForDimensions: {},
        });
    }

    handleDimensionChange = (dimensionsId, element) => {
        // copy of current selections
        const selectedOptionsForDimensions = { ...this.state.selectedOptionsForDimensions };
        selectedOptionsForDimensions[dimensionsId] = element.target.value;

        this.setState({
            selectedOptionsForDimensions,
        });
    }

    handleSelectedDataSetOnlyChange = (event, value) => {
        this.setState({
            selectedDataSetOnly: value,
        });
    }

    handleOrganisationUnitGroupSetChange = (organisationUnitGroupSetId, element) => {
        // copy of current selections
        const selectedOptionsForOrganisationUnitGroupSets = {
            ...this.state.selectedOptionsForOrganisationUnitGroupSets,
        };
        selectedOptionsForOrganisationUnitGroupSets[organisationUnitGroupSetId] = element.target.value;

        this.setState({
            selectedOptionsForOrganisationUnitGroupSets,
        });
    }

    renderExtraOptions = () => (
        <div style={this.state.showOptions ? styles.showOptions : styles.hideOptions}>
            <OrganisationUnitGroupOptions
                values={this.state.selectedOptionsForOrganisationUnitGroupSets}
                onChange={this.handleOrganisationUnitGroupSetChange}
            />
        </div>
    )

    render() {
        return (
            <div>
                <DataSets
                    onChange={this.handleDataSetChange}
                />
                { this.state.selectedDataSet &&
                    <DataSetOptions
                        dataSetId={this.state.selectedDataSet}
                        values={this.state.selectedOptionsForDimensions}
                        onChange={this.handleDimensionChange}
                    />
                }
                <CheckBox
                    onChange={this.handleSelectedDataSetOnlyChange}
                    value={this.state.selectedDataSetOnly}
                    label={i18n.t(i18nKeys.dataSetReport.selectedDataSetOnlyLabel)}
                />
                <OrganisationUnitsTree />
                <span
                    style={styles.showMoreOptionsButton}
                    role="button"
                    tabIndex="0"
                    onClick={this.toggleShowOptions}
                >
                    {i18n.t(i18nKeys.dataSetReport.showMoreOptions)}
                </span>
                {this.renderExtraOptions()}
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
                    onClick={this.cancelReport}
                >
                    {i18n.t(i18nKeys.dataSetReport.cancelAction)}
                </Button>
            </div>
        );
    }
}

export default DataSetReportForm;
