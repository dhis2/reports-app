import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import { Button } from '@dhis2/d2-ui-core'
import XLSX from 'xlsx'
import { connect } from 'react-redux'
import { updateFeedbackState } from '../redux/actions/feedback'
import i18n from '../utils/i18n/locales'
import { i18nKeys } from '../utils/i18n/i18nKeys'
import Page from './Page'
import PageHelper from '../components/PageHelper'
import OrganisationUnitsTree from '../components/AvailableOrganisationUnitsTree'
import GroupSets from '../components/GroupSetsDropdown'
import ReportTable from '../components/TabularReport/ReportTable'
import { getDocsUrl } from '../utils/getDocsUrl'
import { LOADING, SUCCESS } from '../utils/feedbackTypes.js'
import styles from '../utils/styles'
import {
    loadingChartImageUrlStart,
    loadingChartImageUrlSuccessWithFeedback,
    loadingChartImageUrlErrorWithFeedback,
} from '../redux/actions/orgUnitDistReport'
import { getChartImageUrl } from '../redux/selectors/orgUnitDistReport/getChartImageUrl'
import { getLoading } from '../redux/selectors/orgUnitDistReport/getLoading'

export default class OrganisationUnitDistributionReport extends Page {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    constructor() {
        super()

        this.state = {
            showForm: true,
            reportHtml: null,
            selectedGroupSet: null,
            selectedOrgUnit: null,
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
        // eslint-disable-next-line
        const url = `organisationUnits/${
            this.state.selectedOrgUnit
        }/distributionReport?groupSetId=${this.state.selectedGroupSet}`
        const api = this.props.d2.Api.getApi()

        api.get(url)
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

    handleOrganisationUnitChange = selectedOrgUnit => {
        this.setState({
            selectedOrgUnit,
        })
    }

    handleGroupSetChange = selectedGroupSet => {
        this.setState({
            selectedGroupSet,
        })
    }

    isFormValid() {
        return this.state.selectedOrgUnit && this.state.selectedGroupSet
    }

    isActionEnabled() {
        return this.isFormValid() && !this.state.loading
    }

    render() {
        return (
            <div>
                <h1>
                    {!this.state.showForm && (
                        <span
                            id="back-button"
                            style={styles.backButton}
                            className="material-icons"
                            role="button"
                            tabIndex="0"
                            onClick={this.goToForm}
                        >
                            arrow_back
                        </span>
                    )}
                    {i18n.t(i18nKeys.organisationUnitDistributionReport.header)}
                    <PageHelper
                        url={getDocsUrl(
                            this.props.d2.system.version,
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <Paper style={styles.container}>
                    <div
                        id="org-unit-dist-report-form"
                        style={{
                            display: this.state.showForm ? 'block' : 'none',
                        }}
                    >
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <div style={styles.formLabel}>
                                    {i18n.t(
                                        i18nKeys
                                            .organisationUnitDistributionReport
                                            .organisationUnitLabel
                                    )}
                                </div>
                                <OrganisationUnitsTree
                                    onChange={this.handleOrganisationUnitChange}
                                />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <div id="group-sets-selection">
                                    <GroupSets
                                        onChange={this.handleGroupSetChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="actions" style={styles.actionsContainer}>
                            <Button
                                style={styles.actionButton}
                                raised
                                color="primary"
                                onClick={this.getReport}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(
                                    i18nKeys.organisationUnitDistributionReport
                                        .getReportAction
                                )}
                            </Button>
                            <Button
                                style={styles.actionButton}
                                raised
                                color="accent"
                                onClick={this.getChart}
                                disabled={!this.isActionEnabled()}
                            >
                                {i18n.t(
                                    i18nKeys.organisationUnitDistributionReport
                                        .getChartAction
                                )}
                            </Button>
                        </div>
                    </div>
                    {!this.state.showForm && (
                        <div
                            id="report-container"
                            style={{
                                display: !this.state.showForm
                                    ? 'block'
                                    : 'none',
                            }}
                        >
                            {this.state.reportHtml && (
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
                                        {i18n.t(
                                            i18nKeys
                                                .organisationUnitDistributionReport
                                                .exportReport
                                        )}
                                    </span>
                                </div>
                            )}
                            {this.state.reportHtml && (
                                <ReportTable
                                    reportHtml={this.state.reportHtml}
                                />
                            )}
                            {this.props.displayImage && (
                                <img
                                    onLoad={this.handleChartLoaded}
                                    onError={this.handleChartLoadingError}
                                    alt={i18n.t(
                                        i18nKeys
                                            .organisationUnitDistributionReport
                                            .getChartAction
                                    )}
                                    src={this.state.imageUrl}
                                />
                            )}
                        </div>
                    )}
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    imageUrl: getChartImageUrl(state),
    displayImage: state.orgUnitDistReport.displayImage,
    loading: getLoading(state),
})

const mapDispatchToProps = dispatch => ({
    loadImage: () => dispatch(loadingChartImageUrlStart()),
    handleChartLoaded: () =>
        dispatch(loadingChartImageUrlSuccessWithFeedback()),
    handleChartLoadingError: () =>
        dispatch(loadingChartImageUrlErrorWithFeedback()),
})

export const ConnectedOrganisationUnitDistributionReport = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganisationUnitDistributionReport)
