/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
/* material-ui */
import { Dialog } from 'material-ui';
/* app components */
import { Button } from '@dhis2/d2-ui-core';
import {
    AvailableOrganisationUnitsTree,
} from '../../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
/* i18n */
import { i18nKeys } from '../../../i18n';
import i18n from '../../../locales';
/* styles */
import appStyles from '../../../styles';

class CreateStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            organisationUnitId: null,
        };

        this.createReport = this.createReport.bind(this);
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this);
    }

    componentWillMount() {
        this.loadOrgUnit();
    }

    loadOrgUnit() {
        // console.log('Load Org Unit Tree id:', this.props.id);
        this.props.id = this.props.id;
    }

    createReport() {
        // console.log('Create Report id: ', this.props.id, this.state.organisationUnitId);
        this.props.id = this.props.id;
    }

    organisationUnitOnChange(organisationUnitId) {
        this.setState({ organisationUnitId });
    }

    render() {
        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={this.props.onRequestClose}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
            </Button>,
            <Button
                style={appStyles.dialogBtn}
                onClick={this.props.onRequestClose}
            >
                {i18n.t(i18nKeys.buttons.downloadAsExcel)}
            </Button>,
            <Button
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                onClick={this.createReport}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];
        return (
            <Dialog
                title={i18n.t(i18nKeys.standardReport.createReport.title)}
                actions={actions}
                modal={Boolean(true)}
                open={this.props.open}
            >
                <div style={{ height: '500px' }}>
                    <div>
                        {i18n.t(i18nKeys.availableOrganisationUnitsTree.treeLabel)}
                    </div>
                    <AvailableOrganisationUnitsTree d2={this.props.d2} onChange={this.organisationUnitOnChange} />
                </div>
            </Dialog>
        );
    }
}

export default CreateStdReport;
