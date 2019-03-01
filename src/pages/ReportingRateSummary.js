import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import TabularReport from '../components/TabularReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'
import { Form } from './reporting-rate-summary/Form'

export default class ReportingRateSummary extends React.Component {
    render = () => (
        <div>
            <SectionHeadline
                label={i18n.t('Reporting rate summary')}
                systemVersion={this.props.d2.system.version}
                sectionKey={this.props.sectionKey}
            />
            <Paper style={styles.container}>
                <Form
                    loadReportData={this.props.loadReportData}
                    isActionEnabled={this.props.isActionEnabled}
                />
                <TabularReport
                    content={this.props.reportContent}
                    isLoading={this.props.isReportLoading}
                    fileUrls={this.props.fileUrls}
                />
            </Paper>
            <Snackbar />
        </div>
    )
}

ReportingRateSummary.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    reportContent: PropTypes.object.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
}

export const ConnectedReportingRateSummary = connectReportingRateSummary(
    manageError(ReportingRateSummary)
)
