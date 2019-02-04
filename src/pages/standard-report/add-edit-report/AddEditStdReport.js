/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

/* material-ui */
import { Dialog } from 'material-ui';
import SelectFieldMui from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/* d2-ui */
import { Button, TextField, SelectField, CheckBox, SvgIcon, InputField } from '@dhis2/d2-ui-core';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../../redux/actions/feedback';

/* styles */
import appStyles from '../../../styles';
import styles from './AddEditStdReport.style';

/* app conf */
import {
    relativePeriods, NONE, CACHE_STRATEGIES, REPORT_TABLES_ENDPOINT, REPORT_TYPES, REPORTS_ENDPOINT, TYPES,
} from '../standard.report.conf';

/* utils */
import { LOADING } from '../../../utils/feedbackSnackBarTypes';

/* i18n */
import i18n from '../../../utils/i18n/locales';
import { i18nKeys } from '../../../utils/i18n/i18nKeys';

const initialState = {
    report: {
        id: null,
        name: null,
        cacheStrategy: CACHE_STRATEGIES[1].id, // default RESPECT_SYSTEM_SETTING
        type: TYPES.JASPER_REPORT_TABLE, // default JASPER_REPORT_TABLE
        designContent: null,
        reportTable: NONE,
        reportParams: {
            paramReportingPeriod: false, // paramReportingMonth
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
    loading: false,
};

export default class AddEditStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        selectedReport: PropTypes.object,
        onError: PropTypes.func.isRequired,
        updateFeedbackState: PropTypes.func.isRequired,
    };

    static defaultProps = {
        selectedReport: null,
    };

    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(initialState));
    }

    componentDidMount() {
        this.loadReportTables();
        if (this.props.selectedReport) {
            this.loadSelectedReport(this.props.selectedReport);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedReport && nextProps.selectedReport.id !== this.state.report.id && !this.state.loading) {
            this.loadSelectedReport(nextProps.selectedReport);
        } else {
            this.setState(JSON.parse(JSON.stringify(initialState)));
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
        this.setState({
            report: {
                ...this.state.report,
                relativePeriods: { ...this.state.report.relativePeriods, [event.target.id]: event.target.checked },
            },
        });
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

        reader.onload = (evt) => {
            if (evt.target.readyState !== 2) return;
            if (evt.target.error) {
                this.props.onError(evt.target.error);
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

    getTypeForReport = () => {
        if (this.props.selectedReport) {
            return REPORT_TYPES.filter(obj => obj.id === this.state.report.type);
        }
        return REPORT_TYPES;
    };

    getDownloadLink = () => {
        const api = this.props.d2.Api.getApi();
        const type = this.state.report.type === TYPES.HTML ? 'html' : 'jasper';
        let url;
        let label;
        // if editing
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

    getTitle = () => (this.props.selectedReport ?
        i18n.t(i18nKeys.standardReport.editReportTitle) :
        i18n.t(i18nKeys.standardReport.addNewReportTitle)
    );

    getTypeDropdownComponent = () => (this.state.report.id ?
        (
            <SelectFieldMui
                floatingLabelText={i18n.t(i18nKeys.standardReport.typeLabel)}
                value={this.state.report.type}
                name={'reportType'}
                onChange={this.onChangeType}
                fullWidth
                disabled
            >
                <MenuItem
                    value={this.state.report.type}
                    primaryText={this.getTypeForReport()[0].name}
                />
            </SelectFieldMui>
        ) : (
            <SelectField
                style={styles.width100}
                name={'reportType'}
                label={i18n.t(i18nKeys.standardReport.typeLabel)}
                items={REPORT_TYPES}
                value={this.state.report.type}
                onChange={this.onChangeType}
            />
        ));

    /* close dialog */
    close = (refreshList) => {
        this.stopLoading();
        this.props.onRequestClose(refreshList);
    };

    /* load report tables to use is select */
    loadReportTables = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORT_TABLES_ENDPOINT}?paging=false&fields=:id,name`;
        if (api) {
            this.startLoading();
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ reportTables: [NONE, ...response.reportTables] });
                }
            }).catch((error) => {
                this.props.onError(error);
            }).finally(() => {
                this.stopLoading();
            });
        }
    };

    startLoading = () => {
        this.props.updateFeedbackState(true, { type: LOADING });
        this.setState({ loading: true });
    };

    stopLoading = () => {
        this.props.updateFeedbackState(false);
        this.setState({ loading: false });
    };

    /* load report info to edit it */
    loadSelectedReport = (report) => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORTS_ENDPOINT}/${report.id}`;
        if (api) {
            this.startLoading();
            api.get(url).then((response) => {
                if (response) {
                    this.setState({
                        ...this.state,
                        report: {
                            ...response,
                        },
                    });
                }
            }).catch((error) => {
                this.props.onError(error);
            }).finally(() => {
                this.stopLoading();
            });
        }
    };

    /* add report */
    addReport = () => {
        if (this.ifFormValid()) {
            const api = this.props.d2.Api.getApi();
            if (api) {
                if (this.state.report.type !== TYPES.JASPER_REPORT_TABLE) {
                    delete this.state.report.reportTable;
                }
                this.startLoading();
                // Edit report
                if (this.state.report.id) {
                    const url = `${REPORTS_ENDPOINT}/${this.state.report.id}`;
                    api.update(url, this.state.report).then((response) => {
                        if (response) {
                            this.close(true);
                        }
                    }).catch((error) => {
                        this.stopLoading();
                        this.props.onError(error);
                    });
                // Add report
                } else {
                    api.post(REPORTS_ENDPOINT, this.state.report).then((response) => {
                        if (response) {
                            this.close(true);
                        }
                    }).catch((error) => {
                        this.stopLoading();
                        this.props.onError(error);
                    });
                }
            }
        }
    };

    ifFormValid = () => {
        if (!this.state.loading && this.validateGenericFields()) {
            return !(this.state.report.type === TYPES.JASPER_REPORT_TABLE &&
                this.state.report.reportTable.id === NONE.id);
        }
        return false;
    };

    validateGenericFields = () => (!!(this.state.report.name && this.state.report.designContent));

    showSection = () => {
        //  if not JASPER_REPORT_TABLE
        if (this.state.report.type !== TYPES.JASPER_REPORT_TABLE) {
            return styles.sectionBox;
        }
        return { display: 'none' };
    };

    render() {
        const actions = [
            <span id={'cancel-action-btn-id'}>
                <Button
                    key={'cancel-action-btn-key'}
                    style={appStyles.dialogBtn}
                    onClick={this.close}
                    disabled={this.state.loading}
                >
                    {i18n.t(i18nKeys.buttons.cancel)}
                </Button>
            </span>,
            <span id={'save-action-btn-id'}>
                <Button
                    key={'save-action-btn-key'}
                    raised
                    color={'primary'}
                    style={appStyles.dialogBtn}
                    disabled={!this.ifFormValid()}
                    onClick={this.addReport}
                >
                    {i18n.t(i18nKeys.buttons.save)}
                </Button>
            </span>,
        ];

        return (
            <Dialog
                autoDetectWindowHeight
                autoScrollBodyContent
                title={this.getTitle()}
                actions={actions}
                modal
                contentStyle={styles.dialog}
                open={this.props.open}
            >
                <div id={'add-edit-std-report-form-id'} style={styles.dialogContentContainer}>
                    <span id={'display-right-message-id'} className={'row'} style={styles.rightsMessage}>
                        {i18n.t(i18nKeys.messages.rightsMessage)}
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
                            {
                                this.getTypeDropdownComponent()
                            }
                            {/* design file hidden file input */}
                            <input
                                style={{ display: 'none' }}
                                name={'hiddenInputFile'}
                                type="file"
                                // eslint-disable-next-line
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
                                    // eslint-disable-next-line
                                    onClick={() => this.fileInput.click()}
                                />
                            </div>
                            {/* get report template/design */}
                            <div style={styles.getTemplateLink}>
                                {this.getDownloadLink()}
                            </div>
                            {/* report table */}
                            <SelectField
                                selector={'reportTable'}
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
                    <div id={'relative-periods-id'} className={'row'} style={this.showSection()}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.relativePeriods)}
                        </div>
                        <div id={'relative-periods-row-id'} className="row" style={styles.relativePeriodsRow}>
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
                    <div id={'report-parameters-id'} className={'row'} style={this.showSection()}>
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
                        <div id={'cache-strategy-id'} className={'col-xs-12'} style={styles.sectionContent}>
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

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
});

export const ConnectedAddEditStdReport = connect(
    null,
    mapDispatchToProps,
)(AddEditStdReport);
