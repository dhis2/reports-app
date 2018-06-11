/* React */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

/* d2-ui components */
import { CheckBox } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* App components */
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown';
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export class DataSetReportForm extends PureComponent {
    /*
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }
    */
    constructor() {
        super();

        this.state = {
            selectedDataSet: null,
            selectedDataSetOnly: false,
            selectedOrgUnit: null,
        };
    }

    render() {
        return (
            <div>
                <DataSets />
                <CheckBox
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
