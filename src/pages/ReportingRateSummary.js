import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import i18n from '../utils/i18n/locales'
import styles from '../utils/styles'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import TabularReport from '../components/TabularReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'
import { Form } from './reporting-rate-summary/Form'

export default class ReportingRateSummary extends React.Component {
    render() {
        const { props } = this

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Reporting rate summary')}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <Form
                        showForm={true}
                        loadReportData={props.loadReportData}
                        isActionEnabled={props.isActionEnabled}
                    />
                    <TabularReport
                        content={props.reportContent}
                        isLoading={props.isReportLoading}
                        fileUrls={props.fileUrls}
                    />
                </Paper>
                <Snackbar />
            </div>
        )
    }
}

ReportingRateSummary.propTypes = {
    d2: PropTypes.object.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    reportContent: PropTypes.object.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
}

export const ConnectedReportingRateSummary = connectReportingRateSummary(
    manageError(ReportingRateSummary)
)
