/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* material-ui */
import { Dialog } from 'material-ui';

/* d2-ui */
import { Button, SelectField } from '@dhis2/d2-ui-core';

/* app components */
import
OrganisationUnitsTree
    from '../../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

/* i18n */
import { i18nKeys } from '../../../i18n';
import i18n from '../../../locales';

/* styles */
import appStyles from '../../../styles';

import { REPORTS_ENDPOINT } from '../standard.report.conf';

class CreateStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        selectedReport: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            organisationUnitId: null,
        };

        this.getReport = this.getReport.bind(this);
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this);
    }

    componentDidMount() {
        this.loadReportParams();
    }

    onChangePeriod = (selectedPeriod) => {
        this.setState({ selectedPeriod });
    }

    getReport = () => {
        console.log('Create Report id: ',
            this.props.selectedReport.id, this.state.organisationUnitId, this.state.selectedPeriod);
    }

    isSet = () => {
        if (this.state.params &&
            (this.state.params.paramOrganisationUnit ||
                this.state.params.paramParentOrganisationUnit ||
                this.state.params.paramGrandParentOrganisationUnit ||
                this.state.params.paramReportingPeriod)) {
            return true;
        }
        return false;
    };

    displayPeriods = () => {
        console.log('##3 Periods: ', this.state.periods);
        if (this.state.periods && this.state.periods.length > 0 &&
            this.state.params && this.state.params.paramReportingPeriod) {
            return (
                <SelectField
                    selector={'periods'}
                    label={i18n.t(i18nKeys.standardReport.reportingPeriod)}
                    items={this.state.periods}
                    value={this.state.selectedPeriod ? this.state.selectedPeriod.id : this.state.periods[0].id}
                    onChange={this.onChangePeriod}
                />
            );
        }
        return null;
    };

    displayOrgUnitTree = () => {
        if (this.state.params && (
            this.state.params.paramOrganisationUnit ||
            this.state.params.paramParentOrganisationUnit ||
            this.state.params.paramGrandParentOrganisationUnit)
        ) {
            return (
                <div style={{ height: 350 }}>
                    <div>
                        {i18n.t(i18nKeys.availableOrganisationUnitsTree.treeLabel)}
                    </div>
                    <OrganisationUnitsTree d2={this.props.d2} onChange={this.organisationUnitOnChange} />
                </div>
            );
        }
        return null;
    };

    // TODO: add report type (needed to generate it) receive from props !! or in params from server
    loadReportParams = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORTS_ENDPOINT}/${this.props.selectedReport.id}/parameters?mode=report`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ ...response }); // params && || periods
                    if (!this.isSet()) {
                        this.getReport();
                    }
                }
            }).catch(() => {
                // TODO:
            }).finally(() => {

            });
        }
    }

    organisationUnitOnChange = (organisationUnitId) => {
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
                onClick={this.getReport}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];
        return (
            <Dialog
                autoScrollBodyContent
                autoDetectWindowHeight
                title={i18n.t(i18nKeys.standardReport.createReportTitle)}
                actions={actions}
                modal
                open={this.props.open}
            >
                {this.displayPeriods()}
                {this.displayOrgUnitTree()}
            </Dialog>
        );
    }
}

export default CreateStdReport;
