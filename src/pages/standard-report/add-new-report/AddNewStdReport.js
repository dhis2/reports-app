/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

/* material-ui */
import { Dialog } from 'material-ui';

/* d2-ui */
import { Button, TextField, SelectField, CheckBox, SvgIcon, InputField } from '@dhis2/d2-ui-core';

/* styles */
import appStyles from '../../../styles';
import styles from './AddNewStdReport.style';
import {
    CACHE_STRATEGIES, REPORT_TABLES_ENDPOINT, REPORT_TYPES, REPORTS_ENDPOINT,
} from '../standard.report.conf';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

const initialState = {
    report: {
        name: '',
        cacheStrategy: CACHE_STRATEGIES[0].id,
        type: REPORT_TYPES[0].id,
        designContent: null,
        reportTable: {
            name: '[ None ]',
            id: 'none',
        },
        reportParams: {
            paramGrandParentOrganisationUnit: false,
            paramReportingPeriod: false,
            paramOrganisationUnit: false,
            paramParentOrganisationUnit: false,
        },
    },
    selectedFileToUpload: null,
};

class AddNewReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.loadReportTables();
    }

    /* Handle form changes */
    onChangeName = (name) => {
        this.setState({ report: { ...this.state.report, name } });
    };

    onChangeType = (type) => {
        this.setState({ report: { ...this.state.report, type: type.id } });
    };

    onChangeCacheStrategy = (strategy) => {
        this.setState({ report: { ...this.state.report, cacheStrategy: strategy.id } });
    };

    onChangeReportTable = (table) => {
        this.setState({ report: { ...this.state.report, reportTable: { id: table.id } } });
    };

    onChangeFileTemplate = (event) => {
        const that = this;
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        this.setState({ selectedFileToUpload: event.target.files[0] });
        // FIXME: Handle errors
        reader.onload = (evt) => {
            if (evt.target.readyState !== 2) return;
            if (evt.target.error) {
                alert('Error while reading file.');
                return;
            }
            const designContent = evt.target.result;
            that.setState({
                report: { ...that.state.report, designContent },
            });
        };
    };

    onChangeCbReportingPeriod = (event) => {
        this.setState({
            report: {
                ...this.state.report,
                reportParams: { ...this.state.report.reportParams, paramReportingPeriod: event.target.checked },
            },
        });
    };

    onChangeCbOrgUnit = (event) => {
        this.setState({
            report: {
                ...this.state.report,
                reportParams: { ...this.state.report.reportParams, paramOrgUnit: event.target.checked },
            },
        });
    };

    close = (refreshList) => {
        this.setState(initialState);
        this.props.onRequestClose(refreshList);
    };

    /* load data */
    loadReportTables = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORT_TABLES_ENDPOINT}?paging=false&fields=:id,name`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ reportTables: [{ name: '[ None ]', id: 'none' }, ...response.reportTables] });
                }
            }).catch(() => {
                // TODO:
            });
        }
    };

    /* create report */
    createReport = () => {
        console.log('############### STATE: ', this.state);
        if (this.ifFormValid) {
            const api = this.props.d2.Api.getApi();
            if (api) {
                api.post(REPORTS_ENDPOINT, this.state.report).then((response) => {
                    if (response) {
                        console.log('#### ADD NEW REPORT RESPONSE: ', response);
                        this.close(true);
                    }
                }).catch(() => {
                    // TODO:
                });
            }
        }
    };

    ifFormValid = () => true;

    render() {
        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={this.close}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
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
                autoDetectWindowHeight={Boolean(true)}
                autoScrollBodyContent={Boolean(true)}
                title={i18n.t(i18nKeys.standardReport.addNewReportTitle)}
                actions={actions}
                modal={Boolean(true)}
                open={this.props.open}
            >
                <div style={{ paddingTop: '5px' }}>
                    <span className={'row'} style={styles.rightsMessage}>
                        {i18n.t(i18nKeys.standardReport.reportRightsMessage)}
                    </span>
                    {/* details */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.details)}
                        </div>
                        <div className={'col-xs-12'} style={styles.sectionContent}>
                            {/* report name */}
                            <InputField
                                fullWidth
                                name="name"
                                label={i18n.t(i18nKeys.standardReport.nameLabel)}
                                value={this.state.report.name}
                                onChange={this.onChangeName}
                            />
                            {/* report type */}
                            <SelectField
                                style={styles.width100}
                                name={'reportType'}
                                label={i18n.t(i18nKeys.standardReport.typeLabel)}
                                items={REPORT_TYPES}
                                value={this.state.report.type}
                                onChange={this.onChangeType}
                            />
                            {/* design file hidden file input */}
                            <input
                                style={{ display: 'none' }}
                                type="file"
                                ref={(fileInput) => { this.fileInput = fileInput; }}
                                onChange={this.onChangeFileTemplate}
                            />
                            {/* design file - file input interface */}
                            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                <SvgIcon
                                    icon={'Add'}
                                    style={{ position: 'absolute', right: 14, bottom: 15, width: 20, height: 20 }}
                                />
                                <TextField
                                    readOnly
                                    fullWidth
                                    floatingLabelFixed
                                    name={'fileName'}
                                    hintText={i18n.t(i18nKeys.standardReport.noFileChosen)}
                                    floatingLabelText={i18n.t(i18nKeys.standardReport.designFileLabel)}
                                    value={this.state.selectedFileToUpload ? this.state.selectedFileToUpload.name : ''}
                                    onClick={() => this.fileInput.click()}
                                />
                            </div>
                            {/* get report template */}
                            <div style={{ width: '100%', textAlign: 'right' }}>
                                {
                                    this.state.report.type === 'HTML' ? (
                                        <a href={'http://www.google.com'}>
                                            {i18n.t(i18nKeys.standardReport.getHTMLTemplate)}
                                        </a>
                                    ) : (
                                        <a href={'http://www.google.com'}>
                                            {i18n.t(i18nKeys.standardReport.getJasperTemplate)}
                                        </a>
                                    )
                                }
                            </div>
                            {/* report table */}
                            <SelectField
                                selector={'displayName'}
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.reportTableLabel)}
                                items={this.state.reportTables}
                                value={this.state.report.reportTable.id}
                                onChange={this.onChangeReportTable}
                            />
                        </div>
                    </div>
                    {/* relative periods  */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.relativePeriods)}
                        </div>
                    </div>
                    {/* report parameters */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.reportParameters)}
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox
                                label={i18n.t(i18nKeys.standardReport.reportingPeriod)}
                                onChange={this.onChangeCbReportingPeriod}
                            />
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox
                                label={i18n.t(i18nKeys.standardReport.reportingOrganisationUnit)}
                                onChange={this.onChangeCbOrgUnit}
                            />
                        </div>
                    </div>
                    {/* settings */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.settings)}
                        </div>
                        {/* cache strategy */}
                        <div className={'col-xs-12'} style={styles.sectionContent}>
                            <SelectField
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.cacheStrategy)}
                                items={CACHE_STRATEGIES}
                                value={this.state.report.cacheStrategy}
                                onChange={this.onChangeCacheStrategy}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default AddNewReport;
