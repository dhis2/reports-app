import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import { Button, DropDown } from '@dhis2/d2-ui-core'
import i18n from '../utils/i18n/locales'
import Page from './Page'
import DataSets from '../components/DatasetsDropdown'
import OrgUnitsTreeWithExtraOptions from '../components/OrgUnitsTreeWithExtraOptions'
import PeriodPickerComponent from '../components/PeriodPickerWithPeriodType'
import styles from '../utils/styles'

import { InlineHtmlReport } from '../components/InlineHtmlReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { isActionEnabled } from './reporting-rate-summary/helpers'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'

export default class ReportingRateSummary extends Page {
    render() {
        const { props } = this
        const summaryFormStyles = { display: props.showForm ? 'block' : 'none' }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    showBackButton={!props.showForm}
                    onBackClick={props.setShowForm}
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
                                        onChange={props.selectCriteria}
                                        menuItems={props.criteriaOptions}
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
                                onClick={props.loadHtmlReport}
                                disabled={!isActionEnabled(props)}
                            >
                                {i18n.t('Get Report')}
                            </Button>
                        </div>
                    </div>
                    <InlineHtmlReport
                        shouldRender={!!props.reportHtml && !props.showForm}
                        onDownloadXlsClick={props.exportReportToXls}
                        reportHtml={props.reportHtml}
                    />
                </Paper>
            </div>
        )
    }
}

ReportingRateSummary.propTypes = {
    d2: PropTypes.object.isRequired,
    showForm: PropTypes.bool.isRequired,
    reportHtml: PropTypes.string.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    selectedCriteria: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    setShowForm: PropTypes.func.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectCriteria: PropTypes.func.isRequired,
    selectedOrgUnit: PropTypes.object,
}

export const ConnectedReportingRateSummary = connectReportingRateSummary(
    ReportingRateSummary
)
