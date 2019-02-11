import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import { Button, DropDown } from '@dhis2/d2-ui-core'
import XLSX from 'xlsx'
import { connect } from 'react-redux'
import { updateFeedbackState } from '../redux/actions/feedback'
import i18n from '../utils/i18n/locales'
import Page from './Page'
import DataSets from '../components/DatasetsDropdown'
import { OrgUnitsTreeWithExtraOptions } from '../components/OrgUnitsTreeWithExtraOptions'
import PeriodPickerComponent from '../components/PeriodPickerWithPeriodType'
import { LOADING, SUCCESS } from '../utils/feedbackSnackBarTypes'
import styles from '../utils/styles'

import { InlineHtmlReport } from '../components/InlineHtmlReport'
import { SectionHeadline } from '../components/SectionHeadline'

const BASED_ON_OPTIONS = [
    {
        id: 'registration',
        displayName: i18n.t('Complete data set registrations'),
    },
    { id: 'compulsory', displayName: i18n.t('Compulsory data elements') },
]

const isFormValid = props => props.selectedOrgUnit && props.selectedPeriod

const isActionEnabled = props => this.isFormValid(props) && !props.loading

export default class ReportingRateSummary extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,

        showForm: PropTypes.bool.isRequired,
        reportHtml: PropTypes.string.isRequired,
        selectedDataSet: PropTypes.object.isRequired,
        selectedOrgUnit: PropTypes.object.isRequired,
        selectedPeriod: PropTypes.string.isRequired,
        selectedCriteria: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,

        exportReportToXls: PropTypes.func.isRequired,
        loadHtmlReport: PropTypes.func.isRequired,
        onToggleShowOptions: PropTypes.func.isRequired,
        onSelectCriteria: PropTypes.func.isRequired,
    }

    goToForm = () => {
        this.setState({
            showForm: true,
        })
    }

    exportReportToXls = () => {
        const reportTables = document.querySelectorAll(
            '#report-container table'
        )
        const workbook = XLSX.utils.book_new()
        for (let i = 0; i < reportTables.length; i++) {
            const worksheet = XLSX.utils.table_to_sheet(reportTables[i])
            XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${i}`)
        }
        XLSX.writeFile(workbook, 'report.xlsx')
    }

    handleCriteriaChange = event => {
        const selectedCriteria = event.target.value
        this.setState({
            selectedCriteria,
        })
    }

    render() {
        const { props } = this
        const summaryFormStyles = { display: props.showForm ? 'block' : 'none' }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    showBackButton={!props.showForm}
                    onBackClick={this.goToForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div
                        id="report-rate-summary-form"
                        style={summaryFormStyles}
                    >
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <OrgUnitsTreeWithExtraOptions />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <div id="criteria-selection">
                                    <span style={styles.formLabel}>
                                        {i18n.t('Based on')}
                                    </span>
                                    <DropDown
                                        fullWidth
                                        value={props.selectedCriteria}
                                        onChange={props.onSelectCriteria}
                                        menuItems={BASED_ON_OPTIONS}
                                    />
                                </div>
                                <div id="data-set-selection">
                                    <DataSets />
                                </div>
                                <div id="report-period">
                                    <PeriodPickerComponent
                                        label={i18n.t('Report period')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            id="main-action-button"
                            style={styles.actionsContainer}
                        >
                            <Button
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!isActionEnabled(props)}
                            >
                                {i18n.t('Get Report')}
                            </Button>
                        </div>
                    </div>
                    <InlineHtmlReport
                        shouldRender={props.reportHtml && !props.showForm}
                        onDownloadXlsClick={this.exportReportToXls}
                        reportHtml={props.reportHtml}
                    />
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    showForm: state.reportingRateSummary.showForm,
    reportHtml: state.reportingRateSummary.reportHtml,
    selectedDataSet: state.dataSet.selected,
    selectedOrgUnit: state.organisationUnits.selected,
    selectedOrgUnitOptions: state.organisationUnits.selectedOptions,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    selectedCriteria: state.reportingRateSummary.selectedCriteria,
    loading: state.reportingRateSummary.loading,
})

const mapDispatchToProps = dispatch => ({
    selectCriteria: selectedCriteria =>
        dispatch(selectCriteria(selectedCriteria)),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
})

export const ConnectedReportingRateSummary = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingRateSummary)
