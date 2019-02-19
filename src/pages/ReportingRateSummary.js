import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import i18n from '../utils/i18n/locales'
import styles from '../utils/styles'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import { InlineHtmlReport } from '../components/InlineHtmlReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'
import { Form } from './reporting-rate-summary/Form'
import { isActionEnabled } from './reporting-rate-summary/helpers'

export default class ReportingRateSummary extends React.Component {
    render() {
        const { props } = this

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    showBackButton={!!props.reportHtml}
                    onBackClick={props.unsetHtmlReport}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <Form
                        showForm={!props.reportHtml}
                        selectedCriteria={props.selectedCriteria}
                        criteriaOptions={props.criteriaOptions}
                        loadHtmlReport={props.loadHtmlReport}
                        selectCriteria={props.selectCriteria}
                        isActionEnabled={isActionEnabled(props)}
                    />
                    <InlineHtmlReport
                        shouldRender={!!props.reportHtml}
                        onDownloadXlsClick={props.exportReportToXls}
                        reportHtml={props.reportHtml}
                    />
                </Paper>
                <Snackbar />
            </div>
        )
    }
}

ReportingRateSummary.propTypes = {
    d2: PropTypes.object.isRequired,
    reportHtml: PropTypes.string.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    selectedCriteria: PropTypes.string.isRequired,
    criteriaOptions: PropTypes.array.isRequired,
    unsetHtmlReport: PropTypes.func.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectCriteria: PropTypes.func.isRequired,
    selectedOrgUnit: PropTypes.object,
}

export const ConnectedReportingRateSummary = connectReportingRateSummary(
    manageError(ReportingRateSummary)
)
