/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

/* material-ui */
import { Dialog } from 'material-ui';

/* d2-ui */
import { Button, TextField, SelectField, CheckBox, SvgIcon, InputField } from '@dhis2/d2-ui-core';

/* styles */
import appStyles from '../../../styles';
import styles from './AddEditStdReport.style';
import {
    relativePeriods, NONE, CACHE_STRATEGIES, REPORT_TABLES_ENDPOINT, REPORT_TYPES, REPORTS_ENDPOINT, TYPES,
} from '../standard.report.conf';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

const initialState = {
    report: {
        name: null,
        cacheStrategy: CACHE_STRATEGIES[1].id, // default RESPECT_SYSTEM_SETTING
        type: TYPES.JASPER_REPORT_TABLE, // default JASPER_REPORT_TABLE
        designContent: null,
        reportTable: NONE,
        reportParams: {
            paramReportingPeriod: false,
            paramOrganisationUnit: false,
        },
        relativePeriods: {
            // days
            thisDay: false,
            yesterday: false,
            last3Days: false,
            last7Days: false,
            last14Days: false,
            // weeks
            thisWeek: false,
            lastWeek: false,
            last4Weeks: false,
            last12Weeks: false,
            last52Weeks: false,
            weeksThisYear: false,
            // month
            thisMonth: false,
            lastMonth: false,
            last3Months: false,
            last6Months: false,
            last12Months: false,
            monthsThisYear: false,
            // bi-motnhs
            thisBimonth: false,
            lastBimonth: false,
            last6BiMonths: false,
            biMonthsThisYear: false,
            // quartes
            thisQuarter: false,
            lastQuarter: false,
            last4Quarters: false,
            quartersThisYear: false,
            // six-months
            sixMonths: false,
            thisSixMonth: false,
            lastSixMonth: false,
            last2SixMonths: false,
            // financial years
            financialYears: false,
            thisFinancialYear: false,
            lastFinancialYear: false,
            last5FinancialYears: false,
            // years
            years: false,
            thisYear: false,
            lastYear: false,
            last5Years: false,
        },
    },
    selectedFileToUpload: null,
};

class AddEditStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        selectedReport: PropTypes.object,
        updateAppState: PropTypes.func.isRequired,
    };

    static defaultProps = {
        selectedReport: null,
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => JSON.parse(JSON.stringify(initialState));

    componentDidMount() {
        this.loadReportTables();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedReport) {
            this.loadSelectedReport(nextProps.selectedReport);
        }
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

    onChangeCheck = (event) => {
        this.state.report.relativePeriods[event.target.id] = !this.state.report.relativePeriods[event.target.id];
        this.forceUpdate();
    };

    onChangeFileTemplate = (event) => {
        const that = this;
        const reader = new FileReader();
        if (event.target.files[0]) {
            reader.readAsText(event.target.files[0]);
            this.setState({ selectedFileToUpload: event.target.files[0] });
        } else {
            this.setState({ selectedFileToUpload: null, report: { ...this.state.report, designContent: null } });
        }
        // FIXME: Handle errors
        reader.onload = (evt) => {
            if (evt.target.readyState !== 2) return;
            if (evt.target.error) {
                alert('Error while reading fileeee.');
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
                reportParams: { ...this.state.report.reportParams, paramOrganisationUnit: event.target.checked },
            },
        });
    };

    getAuxLink = () => {
        const api = this.props.d2.Api.getApi();
        const type = this.state.report.type === TYPES.HTML ? 'html' : 'jasper';
        let url;
        let label;
        if (this.state.report.id) {
            label = i18n.t(i18nKeys.standardReport.getCurrentDesign);
            url = `${api.baseUrl}/${REPORTS_ENDPOINT}/${this.state.report.id}/design`;
        } else {
            label = this.state.report.type === TYPES.HTML ?
                i18n.t(i18nKeys.standardReport.getHTMLTemplate) :
                i18n.t(i18nKeys.standardReport.getJasperTemplate);
            url = `${api.baseUrl}/${REPORTS_ENDPOINT}/templates/${type}`;
        }
        return (
            <a href={url} target="_blank">
                {label}
            </a>
        );
    };

    /* close dialog */
    close = (refreshList) => {
        this.setState(this.getInitialState());
        this.props.onRequestClose(refreshList);
    };

    /* load report tables to use is select */
    loadReportTables = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORT_TABLES_ENDPOINT}?paging=false&fields=:id,name`;
        if (api) {
            this.props.updateAppState({
                pageState: {
                    loading: true,
                },
            });
            api.get(url).then((response) => {
                if (response) {
                    this.props.updateAppState({
                        pageState: {
                            loading: false,
                        },
                    });
                    this.setState({ reportTables: [NONE, ...response.reportTables] });
                }
            }).catch(() => {
                // TODO:
            });
        }
    };

    /* load report info to edit it */
    loadSelectedReport = (report) => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORTS_ENDPOINT}/${report.id}`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({
                        ...this.state,
                        report: {
                            ...response,
                        },
                    });
                }
            }).catch(() => {
                // TODO:
            });
        }
    };

    /* create report */
    createReport = () => {
        if (this.ifFormValid()) {
            const api = this.props.d2.Api.getApi();
            if (api) {
                if (this.state.report.type !== TYPES.JASPER_REPORT_TABLE) {
                    delete this.state.report.reportTable;
                }
                this.props.updateAppState({
                    pageState: {
                        loading: true,
                    },
                });
                // Edit report
                if (this.state.report.id) {
                    const url = `${REPORTS_ENDPOINT}/${this.state.report.id}`;
                    api.update(url, this.state.report).then((response) => {
                        if (response) {
                            this.props.updateAppState({
                                pageState: {
                                    loading: false,
                                },
                            });
                            this.close(true);
                        }
                    }).catch(() => {
                        // TODO:
                    });
                // Create report
                } else {
                    api.post(REPORTS_ENDPOINT, this.state.report).then((response) => {
                        if (response) {
                            this.props.updateAppState({
                                pageState: {
                                    loading: false,
                                },
                            });
                            this.close(true);
                        }
                    }).catch(() => {
                        // TODO:
                    });
                }
            }
        }
    };

    ifFormValid = () => {
        if (this.validateGenericFields()) {
            if (this.state.report.type === TYPES.JASPER_REPORT_TABLE && this.state.report.reportTable.id === NONE.id) {
                return false;
            }
            return true;
        }
        return false;
    };

    validateGenericFields = () => {
        if (this.state.report.name && this.state.report.designContent) {
            return true;
        }
        return false;
    };

    showSection = () => {
        //  If JASPER_REPORT_TABLE
        if (this.state.report.type !== TYPES.JASPER_REPORT_TABLE) {
            return styles.sectionBox;
        }
        return { display: 'none' };
    };

    render() {
        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={() => this.close(false)}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
            </Button>,
            <Button
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                disabled={!this.ifFormValid()}
                onClick={this.createReport}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];

        return (
            <Dialog
                autoDetectWindowHeight
                autoScrollBodyContent
                title={i18n.t(i18nKeys.standardReport.addNewReportTitle)}
                actions={actions}
                modal
                contentStyle={styles.dialog}
                open={this.props.open}
            >
                <div style={styles.dialogContentContainer}>
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
                                value={this.state.report.name || ''}
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
                            <div style={styles.uploadFileInput}>
                                <SvgIcon
                                    icon={'Add'}
                                    style={styles.uploadFileInputIcon}
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
                            <div style={styles.getTemplateLink}>
                                {this.getAuxLink()}
                            </div>
                            {/* report table */}
                            <SelectField
                                selector={'displayName'}
                                style={
                                    {
                                        ...styles.width100,
                                        ...(this.state.report.type !== TYPES.JASPER_REPORT_TABLE ?
                                            { display: 'none' } : ''),
                                    }
                                }
                                label={i18n.t(i18nKeys.standardReport.reportTableLabel)}
                                items={this.state.reportTables}
                                value={this.state.report.reportTable ? this.state.report.reportTable.id : NONE.id}
                                onChange={this.onChangeReportTable}
                            />
                        </div>
                    </div>
                    {/* relative periods  */}
                    <div className={'row'} style={this.showSection()}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.relativePeriods)}
                        </div>
                        <div className="row" style={styles.relativePeriodsRow}>
                            {relativePeriods.map(relativePeriod => (
                                <div key={relativePeriod.label} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                    <h4>{relativePeriod.label}</h4>
                                    {
                                        relativePeriod.periods.map(period => (
                                            <CheckBox
                                                id={period.id}
                                                key={period.id}
                                                label={period.name}
                                                checked={this.state.report.relativePeriods[period.id]}
                                                onChange={this.onChangeCheck}
                                            />
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* report parameters */}
                    <div className={'row'} style={this.showSection()}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.reportParameters)}
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox
                                id={'reportingPeriodCB'}
                                label={i18n.t(i18nKeys.standardReport.reportingPeriod)}
                                checked={this.state.report.reportParams.paramReportingPeriod}
                                onChange={this.onChangeCbReportingPeriod}
                            />
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox
                                id={'paramOrganisationUnitCB'}
                                label={i18n.t(i18nKeys.standardReport.reportingOrganisationUnit)}
                                checked={this.state.report.reportParams.paramOrganisationUnit}
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

export default AddEditStdReport;
