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

import { REPORTS_ENDPOINT, REPORT_MODE, GET_REPORT_AS_ENDPOINT, TYPES } from '../standard.report.conf';

class CreateStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        selectedReport: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        onGetHtmlReport: PropTypes.func,
        open: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        onGetHtmlReport: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedOrgUnitId: null,
            selectedPeriod: null,
        };
    }

    componentDidMount() {
        this.loadReportParams(REPORT_MODE.REPORT);
    }

    onChangePeriod = (selectedPeriod) => {
        this.setState({ selectedPeriod });
    };

    onChangeOrgUnit = (selectedOrgUnitId) => {
        this.setState({ selectedOrgUnitId });
    };

    getReport = () => {
        const api = this.props.d2.Api.getApi();
        const typeEndpoint = this.props.selectedReport.type === TYPES.HTML ?
            GET_REPORT_AS_ENDPOINT.HTML : GET_REPORT_AS_ENDPOINT.PDF;
        let url = `${REPORTS_ENDPOINT}/${this.props.selectedReport.id}/${typeEndpoint}?t=${new Date().getTime()}`;
        if (this.state.selectedOrgUnitId) {
            url = `${url}&ou=${this.state.selectedOrgUnitId}`;
        }
        if (this.state.selectedPeriod) {
            url = `${url}&pe=${this.state.selectedPeriod.id}`;
        }
        if (this.props.selectedReport.type === TYPES.HTML) {
            // this.props.onGetHtmlReport(`${api.baseUrl}/${url}`);
            api.get(url).then((response) => {
                this.props.onGetHtmlReport(response);
            }).catch(() => {
                // TODO:
                // this.manageError(error);
            });
        } else {
            window.open(`${api.baseUrl}/${url}`);
        }
    };

    loadReportParams = (reportMode) => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORTS_ENDPOINT}/${this.props.selectedReport.id}/parameters?mode=${reportMode}`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ ...response }); // params && || periods
                }
            }).catch(() => {
                // TODO:
            }).finally(() => {

            });
        }
    };

    isSet = () => !!(this.state.params && (this.state.params.paramReportingPeriod || this.isOrganisationUnitSet()));

    isOrganisationUnitSet = () => !!(this.state.params.paramOrganisationUnit ||
        this.state.params.paramParentOrganisationUnit ||
        this.state.params.paramGrandParentOrganisationUnit);

    displayPeriods = () => {
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
        if (this.state.params && this.isOrganisationUnitSet()) {
            return (
                <div style={{ height: 350 }}>
                    <div>
                        {i18n.t(i18nKeys.availableOrganisationUnitsTree.treeLabel)}
                    </div>
                    <OrganisationUnitsTree d2={this.props.d2} onChange={this.onChangeOrgUnit} />
                </div>
            );
        }
        return null;
    };

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
                {i18n.t(i18nKeys.buttons.getReport)}
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
