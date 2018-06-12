/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { CheckBox, DropDown } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* App components */
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

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
        };
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

    handleDimensionChange = dimensionsId => (element) => {
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

    fetchDimensionsForDataSet = (dataSetId) => {
        const api = this.props.d2.Api.getApi();
        const url = `dimensions/dataSet/${dataSetId}?fields=id,displayName,items[id,displayName]&order=name:asc`;
        api.get(url).then((response) => {
            const dimensions = response.dimensions || [];
            this.setState({
                dimensions,
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    renderDimensionDropdowns = () => this.state.dimensions.map(dimension => (
        <div key={dimension.id}>
            <span>{dimension.displayName}</span>
            <DropDown
                style={styles.optionDropdown}
                value={this.state.selectedOptionsForDimensions[dimension.id]}
                onChange={this.handleDimensionChange(dimension.id)}
                menuItems={dimension.items}
                includeEmpty
                emptyLabel={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
                hintText={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
            />
        </div>
    ))

    render() {
        return (
            <div>
                <DataSets
                    onChange={this.handleDataSetChange}
                />
                { this.renderDimensionDropdowns() }
                <CheckBox
                    onChange={this.handleSelectedDataSetOnlyChange}
                    value={this.state.selectedDataSetOnly}
                    label={i18n.t(i18nKeys.dataSetReport.selectedDataSetOnlyLabel)}
                />
                <OrganisationUnitsTree />
            </div>
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <DataSetReportForm
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
