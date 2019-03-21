import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import { Snackbar } from '../components/feedback/Snackbar'
import TabularReport from '../components/TabularReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'
import { Form } from './reporting-rate-summary/Form'
import { reportContent } from '../utils/react/propTypes'

const ReportingRateSummary = props => (
    <div>
        <SectionHeadline
            label={i18n.t('Reporting rate summary')}
            systemVersion={props.d2.system.version}
            sectionKey={props.sectionKey}
        />
        <Paper style={styles.container}>
            <Form
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

ReportingRateSummary.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    reportContent: reportContent.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
}

const ConnectedReportingRateSummary = connectReportingRateSummary(
    ReportingRateSummary
)

export { ConnectedReportingRateSummary as ReportingRateSummary }
