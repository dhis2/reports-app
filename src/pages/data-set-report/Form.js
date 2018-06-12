/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { CheckBox, Button } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* App components */
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets';
import DataSetDimensions from '../../components/data-set-dimensions/DataSetDimensions';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* styles */
import styles from './Form.style';

export class DataSetReportForm extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

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

        if (selectedDataSet) {
            this.fetchDimensionsForDataSet(selectedDataSet);
        }
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

    fetchDimensionsForDataSet = (dataSetId) => {
        const api = this.props.d2.Api.getApi();
        const url =
            `dimensions/dataSet/${dataSetId}?fields=id,displayName,items[id,displayName]&order=name:asc&paging=false`;
        api.get(url).then((response) => {
            const dimensions = response.dimensions || [];
            this.setState({
                dimensions,
            });
        }).catch(() => {
            // TODO Manage error
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
                <DataSetDimensions
                    dimensions={this.state.dimensions}
                    values={this.state.selectedOptionsForDimensions}
                    onChange={this.handleDimensionChange}
                />
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

export default props => (
    <AppContext.Consumer>
        {appContext => (
            <DataSetReportForm
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
