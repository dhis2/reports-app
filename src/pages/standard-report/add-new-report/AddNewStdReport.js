/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
/* material-ui */
import { Dialog } from 'material-ui';
/* d2-ui */
import { Button, TextField, SelectField, CheckBox } from '@dhis2/d2-ui-core';
/* styles */
import appStyles from '../../../styles';
import styles from './AddNewStdReport.style';
import { CACHE_STATEGIES, REPORT_TABLES_ENDPOINT, REPORT_TYPES } from '../standard.report.conf';
/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

class AddNewReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedReportType: REPORT_TYPES[0],
            selectedCacheStrategy: CACHE_STATEGIES[0],
            reportTables: [{ id: 'none', name: '[ None ]' }],
            selectedReportTable: { id: 'none', name: '[ None ]' },
        };
    }

    componentDidMount() {
        this.loadReportTables();
    }

    /* Handle form changes */
    onChangeType = (selecteReportType) => {
        this.setState({ selecteReportType });
    };

    onChangeCacheStrategy = (selectedCacheStrategy) => {
        this.setState({ selectedCacheStrategy });
    };

    onChangeReportTable = (selectedReportTable) => {
        this.setState({ selectedReportTable });
    };

    /* load data */
    loadReportTables = () => {
        const api = this.props.d2.Api.getApi();
        const url = `${REPORT_TABLES_ENDPOINT}?paging=false&fields=:id,name`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState({ reportTables: [...this.state.reportTables, ...response.reportTables] });
                }
            }).catch(() => {
                // TODO:
            });
        }
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
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                onClick={this.props.onRequestClose}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];

        const items = [{
            id: 'cat',
            name: 'Cat',
        }, {
            id: 'mouse',
            name: 'Mouse',
        }, {
            id: 'dog',
            name: 'Dog',
        }];

        return (
            <Dialog
                autoDetectWindowHeight={Boolean(true)}
                autoScrollBodyContent={Boolean(true)}
                title={i18n.t(i18nKeys.standardReport.addNewReport.title)}
                actions={actions}
                modal={Boolean(true)}
                open={this.props.open}
            >
                <div style={{ paddingTop: '5px' }}>
                    <span className={'row'} style={styles.rightsMessage}>
                        {i18n.t(i18nKeys.standardReport.addNewReport.reportRightsMessage)}
                    </span>
                    {/* details */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.details)}
                        </div>
                        <div className={'col-xs-12'} style={styles.sectionContent}>
                            {/* report name */}
                            <TextField
                                fullWidth={Boolean(true)}
                                name={'reportName'}
                                floatingLabelText={i18n.t(i18nKeys.standardReport.addNewReport.nameLabel)}
                            />
                            {/* report type */}
                            <SelectField
                                style={styles.width100}
                                name={'reportType'}
                                label={i18n.t(i18nKeys.standardReport.addNewReport.typeLabel)}
                                items={REPORT_TYPES}
                                value={this.state.selectedReportType.id}
                                onChange={this.onChangeType}
                            />
                            {/* design file */}
                            <SelectField
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.addNewReport.designFileLabel)}
                                items={items}
                                value="cat"
                                onChange={this.onChangeType}
                            />
                            {/* get report template */}
                            <div style={{ width: '100%', textAlign: 'right' }}>
                                <a href={'http://www.google.com'}>
                                    Get Jasper Report Template
                                </a>
                            </div>
                            {/* report table */}
                            <SelectField
                                selector={'displayName'}
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.addNewReport.reportTableLabel)}
                                items={this.state.reportTables}
                                value={this.state.selectedReportTable.id}
                                onChange={this.onChangeReportTable}
                            />
                        </div>
                    </div>
                    {/* relative periods  */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.relativePeriods)}
                        </div>
                        <div className={'col-xs-12'} style={styles.sectionContent}>
                            <TextField
                                fullWidth={Boolean(true)}
                                name={'newReportName'}
                                floatingLabelText={i18n.t(i18nKeys.standardReport.addNewReport.nameLabel)}
                            />
                            <SelectField
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.addNewReport.typeLabel)}
                                items={items}
                                value="cat"
                                onChange={this.onChangeType}
                            />
                            <SelectField
                                style={styles.width100}
                                label={i18n.t(i18nKeys.standardReport.addNewReport.designFileLabel)}
                                items={items}
                                value="cat"
                                onChange={this.onChangeType}
                            />
                            <div style={{ width: '100%', textAlign: 'right' }}>
                                <a href={'http://www.google.com'}>Get Jasper Report Template</a>
                            </div>
                        </div>
                    </div>
                    {/* report parameters */}
                    <div className={'row'} style={styles.sectionBox}>
                        <div className={'col-xs-12'} style={styles.sectionTitle}>
                            {i18n.t(i18nKeys.standardReport.reportParameters)}
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox label={i18n.t(i18nKeys.standardReport.reportingPeriod)} />
                        </div>
                        <div className={'col-xs-4'} style={styles.sectionContent}>
                            <CheckBox label={i18n.t(i18nKeys.standardReport.reportingOrganisationUnit)} />
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
                                items={CACHE_STATEGIES}
                                value={this.state.selectedCacheStrategy.id}
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
