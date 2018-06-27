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
    relativePeriods, NONE, CACHE_STRATEGIES, REPORT_TABLES_ENDPOINT, REPORT_TYPES, REPORTS_ENDPOINT,
} from '../standard.report.conf';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

const initialState = {
    report: {
        name: '',
        cacheStrategy: CACHE_STRATEGIES[1].id,
        typeId: REPORT_TYPES[0].id,
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

class AddNewReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => JSON.parse(JSON.stringify(initialState));

    componentDidMount() {
        this.loadReportTables();
    }

    /* Handle form changes */
    onChangeName = (name) => {
        this.setState({ report: { ...this.state.report, name } });
    };

    onChangeType = (type) => {
        this.setState({ report: { ...this.state.report, typeId: type.id } });
    };

    onChangeCacheStrategy = (strategy) => {
        this.setState({ report: { ...this.state.report, cacheStrategy: strategy.id } });
    };

    onChangeReportTable = (table) => {
        this.setState({ report: { ...this.state.report, reportTable: { id: table.id } } });
    };

    onChangeCheck = (event) => {
        this.state.report.relativePeriods[event.target.id] = !this.state.report.relativePeriods[event.target.id];
    };

    onChangeFileTemplate = (event) => {
        const that = this;
        const reader = new FileReader();
        if (event.target.files[0]) {
            reader.readAsText(event.target.files[0]);
            this.setState({ selectedFileToUpload: event.target.files[0] });
        }
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
                reportParams: { ...this.state.report.reportParams, paramOrganisationUnit: event.target.checked },
            },
        });
    };

    close = (refreshList) => {
        this.setState(this.getInitialState());
        this.props.onRequestClose(refreshList);
    };

    /* load data */
    loadReportTables = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORT_TABLES_ENDPOINT}?paging=false&fields=:id,name`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ reportTables: [NONE, ...response.reportTables] });
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

    showSection = () => {
        if (this.state.report.typeId !== REPORT_TYPES[0].id) {
            return styles.sectionBox;
        }
        return { display: 'none' };
    };

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
                                value={this.state.report.name}
                                onChange={this.onChangeName}
                            />
                            {/* report type */}
                            <SelectField
                                style={styles.width100}
                                name={'reportType'}
                                label={i18n.t(i18nKeys.standardReport.typeLabel)}
                                items={REPORT_TYPES}
                                value={this.state.report.typeId}
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
                                {
                                    this.state.report.typeId === 'HTML' ? (
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
