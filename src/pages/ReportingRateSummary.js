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

export default class ReportingRateSummary extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,

        showForm: PropTypes.bool.isRequired,
        reportHtml: PropTypes.string.isRequired,
        selectedDataSet: PropTypes.object.isRequired,
        selectedOrgUnit: PropTypes.object.isRequired,
        selectedOrgUnitOptions: PropTypes.object.isRequired,
        selectedPeriod: PropTypes.string.isRequired,
        showOptions: PropTypes.bool.isRequired,
        selectedCriteria: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,

        exportReportToXls: PropTypes.func.isRequired,
        loadHtmlReport: PropTypes.func.isRequired,
    }

    constructor() {
        super()
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

    getReport = () => {
        this.setState({ loading: true })
        this.props.updateFeedbackState(true, { type: LOADING })

        const api = this.props.d2.Api.getApi()
        const groupUids = Object.keys(
            this.state.selectedOptionsForOrganisationUnitGroupSets
        ).map(
            orgUnitGroupKey =>
                this.state.selectedOptionsForOrganisationUnitGroupSets[
                    orgUnitGroupKey
                ]
        )
        const dataSetId = this.state.selectedDataSet
            ? this.state.selectedDataSet.id
            : null

        // eslint-disable-next-line
        const url = `organisationUnits/${
            this.state.selectedOrgUnit
        }/rateSummary?ds=${dataSetId}&pe=${
            this.state.selectedPeriod
        }&criteria=${this.state.selectedCriteria}&groupUids=${groupUids}`
        api.get(url)
            .then(response => {
                this.setState({
                    reportHtml: response,
                    showForm: false,
                    loading: false,
                })
                this.props.updateFeedbackState(true, {
                    type: SUCCESS,
                    message: i18n.t('Report generated'),
                })
            })
            .catch(error => {
                this.manageError(error)
            })
    }

    handleCriteriaChange = event => {
        const selectedCriteria = event.target.value
        this.setState({
            selectedCriteria,
        })
    }

    isFormValid() {
        return this.state.selectedOrgUnit && this.state.selectedPeriod
    }

    isActionEnabled() {
        return this.isFormValid() && !this.state.loading
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
                                {/* @TODO Add extra options visibility to state */}
                                <OrgUnitsTreeWithExtraOptions
                                    showOptions={props.showOptions}
                                    selectedOrgUnitOptions={
                                        props.selectedOrgUnitOptions
                                    }
                                    toggleShowOptions={
                                        props.onToggleShowOptions
                                    }
                                    onOrganisationUnitGroupSetChange={
                                        props.onOrganisationUnitGroupSetChange
                                    }
                                />
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
                                    <DataSets
                                        onChange={this.handleDataSetChange}
                                    />
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
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t('Get Report')}
                            </Button>
                        </div>
                    </div>
                    {this.state.reportHtml && !this.state.showForm && (
                        <InlineHtmlReport
                            shouldRender={
                                this.state.reportHtml && this.state.showForm
                            }
                            onDownloadXlsClick={this.exportReportToXls}
                            reportHtml={this.state.reportHtml}
                        />
                    )}
                </Paper>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
})

export const ConnectedReportingRateSummary = connect(
    null,
    mapDispatchToProps
)(ReportingRateSummary)
