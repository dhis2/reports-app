import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import XLSX from 'xlsx'
import i18n from '../utils/i18n/locales'
import manageError from './manageError.HOC'
import { Headline } from './data-set-report/Headline'
import { DataInputs } from './data-set-report/DataInputs'
import { FormActions } from './data-set-report/FormActions'
import { HtmlReport } from './data-set-report/HtmlReport'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import { LOADING, SUCCESS } from '../utils/feedbackSnackBarTypes'
import { getDataSetReports } from '../utils/api'
import styles from '../utils/styles'

class DataSetReport extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    constructor() {
        super()

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedDataSet: null,
            selectedUnitOnly: false,
            selectedOrgUnit: null,
            selectedOptionsForDimensions: {},
            selectedOptionsForOrganisationUnitGroupSets: {},
            showOptions: false,
            selectedPeriod: null,
            comment: '',
            loading: false,
        }
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
        getDataSetReports(
            this.state.selectedOptionsForDimensions,
            this.state.selectedOptionsForOrganisationUnitGroupSets,
            this.state.dataSetId,
            this.state.selectedOrgUnit,
            this.state.selectedPeriod,
            this.state.selectedOrgUnit
        )
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

    toggleShowOptions = () => {
        const newShowOptionsValue = !this.state.showOptions
        this.setState({
            showOptions: newShowOptionsValue,
        })
    }

    handleOrganisationUnitChange = selectedOrgUnit => {
        this.setState({
            selectedOrgUnit,
        })
    }

    handleDataSetChange = selectedDataSet => {
        /* update selected data set and reset options */
        this.setState({
            selectedDataSet,
            selectedOptionsForDimensions: {},
        })
    }

    handleDimensionChange = (dimensionsId, event) => {
        const selectedOptionsForDimensions = {
            ...this.state.selectedOptionsForDimensions,
            [dimensionsId]: event.target.value,
        }

        this.setState({
            selectedOptionsForDimensions,
        })
    }

    handlePeriodChange = selectedPeriod => {
        this.setState({
            selectedPeriod,
        })
    }

    handleSelectedUnitOnlyChange = (event, selectedUnitOnly) => {
        this.setState({
            selectedUnitOnly,
        })
    }

    handleOrganisationUnitGroupSetChange = (
        organisationUnitGroupSetId,
        event
    ) => {
        const selectedOptionsForOrganisationUnitGroupSets = {
            ...this.state.selectedOptionsForOrganisationUnitGroupSets,
            [organisationUnitGroupSetId]: event.target.value,
        }

        this.setState({
            selectedOptionsForOrganisationUnitGroupSets,
        })
    }

    isFormValid() {
        return (
            this.state.selectedOrgUnit &&
            this.state.selectedDataSet &&
            this.state.selectedDataSet.id &&
            this.state.selectedPeriod
        )
    }

    isActionEnabled() {
        return this.isFormValid() && !this.state.loading
    }

    render() {
        const { props } = this
        const formStyle = { display: this.state.showForm ? 'block' : 'none' }

        return (
            <div>
                <Headline
                    showForm={this.state.showForm}
                    onBackClick={this.goToForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={formStyle}>
                        <DataInputs
                            showOptions={this.state.showOptions}
                            selectedOptionsForOrganisationUnitGroupSets={
                                this.state
                                    .selectedOptionsForOrganisationUnitGroupSets
                            }
                            selectedDataSet={this.state.selectedDataSet}
                            selectedOptionsForDimensions={
                                this.state.selectedOptionsForDimensions
                            }
                            selectedUnitOnly={this.state.selectedUnitOnly}
                            onToggleShowOptions={this.toggleShowOptions}
                            onOrganisationUnitChange={
                                this.handleOrganisationUnitChange
                            }
                            onOrganisationUnitGroupSetChange={
                                this.handleOrganisationUnitGroupSetChange
                            }
                            onDataSetChange={this.handleDataSetChange}
                            onDimensionChange={this.handleDimensionChange}
                            onPeriodChange={this.handlePeriodChange}
                            onSelectedUnitOnlyChange={
                                this.handleSelectedUnitOnlyChange
                            }
                        />
                        <FormActions
                            onGetReportClick={this.getReport}
                            isGetReportDisabled={!this.isActionEnabled()}
                        />
                    </div>
                    <HtmlReport
                        showForm={this.state.showForm}
                        dataSetId={this.state.selectedDataSet.id}
                        selectedDataSet={this.state.selectedDataSet}
                        selectedPeriod={this.state.selectedPeriod}
                        selectedOrgUnit={this.state.selectedOrgUnit}
                        reportHtml={this.state.reportHtml}
                        onDownloadXlsClick={this.exportReportToXls}
                    />
                </Paper>
            </div>
        )
    }
}

export const ConnectedDataSetReport = connectDataSetReport(
    manageError(DataSetReport)
)
