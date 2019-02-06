/* React */
import React from 'react'
import PropTypes from 'prop-types'

/* Material UI */
import { Paper } from 'material-ui'

/* d2-ui components */
import { CheckBox, Button } from '@dhis2/d2-ui-core'

/* js-xlsx */
import XLSX from 'xlsx'

/* Redux */
import { connect } from 'react-redux'
import { updateFeedbackState } from '../../redux/actions/feedback'

/* i18n */
import i18n from '../../utils/i18n/locales'
import { i18nKeys } from '../../utils/i18n/i18nKeys'

/* App components */
import Page from '../Page'
import PageHelper from '../../components/page-helper/PageHelper'
import DataSets from '../../components/datasets-dropdown/DatasetsDropdown'
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree'
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets'
import DataSetOptions from '../../components/data-set-dimensions/DataSetDimensions'
import PeriodPickerComponent from '../../components/period-picker-with-period-type/PeriodPickerWithPeriodType'
import ShareComment from './Share'
import Report from '../../components/report/Report'

/* utils */
import { getDocsUrl } from '../../utils/getDocsUrl'
import { LOADING, SUCCESS } from '../../utils/feedbackSnackBarTypes'

/* styles */
import styles from '../../utils/styles'

export default class DataSetReport extends Page {
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
                    message: i18n.t(i18nKeys.messages.reportGenerated),
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

        return (
            <div>
                <Headline
                    showForm={this.state.showForm}
                    onBackClick={this.goToForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div
                        id="data-set-report-form"
                        style={{
                            display: this.state.showForm ? 'block' : 'none',
                        }}
                    >
                        <div className="row">
                            <OrgUnitsTree
                                showOptions={this.state.showOptions}
                                selectedOptionsForOrganisationUnitGroupSets={
                                    this.state
                                        .selectedOptionsForOrganisationUnitGroupSets
                                }
                                onOrgUnitChange={
                                    this.handleOrganisationUnitChange
                                }
                                toggleShowOptions={this.toggleShowOptions}
                                onOrganisationUnitGroupSetChange={
                                    this.handleOrganisationUnitGroupSetChange
                                }
                            />
                            <div className="col-xs-12 col-md-6">
                                <div id="data-set-selection">
                                    <DataSets
                                        onChange={this.handleDataSetChange}
                                    />
                                </div>
                                {this.state.selectedDataSet &&
                                    this.state.selectedDataSet.id && (
                                        <div id="data-set-dimensions-container">
                                            <DataSetOptions
                                                dataSetId={
                                                    this.state.selectedDataSet
                                                        .id
                                                }
                                                values={
                                                    this.state
                                                        .selectedOptionsForDimensions
                                                }
                                                onChange={
                                                    this.handleDimensionChange
                                                }
                                            />
                                        </div>
                                    )}
                                <div id="report-period">
                                    <PeriodPickerComponent
                                        label={i18n.t('Report period')}
                                        onChange={this.handlePeriodChange}
                                    />
                                </div>
                                <CheckBox
                                    id="selected-unit-only"
                                    onChange={this.handleSelectedUnitOnlyChange}
                                    value={this.state.selectedUnitOnly}
                                    label={i18n.t(
                                        'Use data for selected unit only'
                                    )}
                                />
                            </div>
                        </div>
                        <div
                            id="main-action-button"
                            style={styles.actionsContainer}
                        >
                            <Button
                                id="main-action-button"
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t('Get Report')}
                            </Button>
                        </div>
                    </div>
                    {this.state.reportHtml &&
                        !this.state.showForm &&
                        this.state.selectedDataSet && (
                            <div
                                id="report-container"
                                style={{
                                    display:
                                        this.state.reportHtml &&
                                        !this.state.showForm
                                            ? 'block'
                                            : 'none',
                                }}
                            >
                                <div
                                    id="download-options-container"
                                    style={styles.downloadContainer}
                                >
                                    <span
                                        style={styles.downloadButton}
                                        role="button"
                                        tabIndex="0"
                                        onClick={this.exportReportToXls}
                                    >
                                        {i18n.t('download as xls')}
                                    </span>
                                </div>
                                <div id="share-component">
                                    <ShareComment
                                        dataSetId={
                                            this.state.selectedDataSet.id
                                        }
                                        period={this.state.selectedPeriod}
                                        orgUnitId={this.state.selectedOrgUnit}
                                    />
                                </div>
                                <Report reportHtml={this.state.reportHtml} />
                            </div>
                        )}
                </Paper>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
})

export const ConnectedDataSetReport = connect(
    null,
    mapDispatchToProps
)(DataSetReport)
