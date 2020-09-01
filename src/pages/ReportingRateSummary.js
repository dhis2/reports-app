import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'

import { Form } from './reporting-rate-summary/Form'
import {
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    sections,
} from '../config/sections.config'
import { SectionHeadline } from '../components/SectionHeadline'
import { Snackbar } from '../components/feedback/Snackbar'
import { connectReportingRateSummary } from './reporting-rate-summary/connectReportingRateSummary'
import { container } from '../utils/styles/shared.js'
import { reportContent } from '../utils/react/propTypes'
import TabularReport from '../components/TabularReport'

const ReportingRateSummary = props => (
    <div>
        <SectionHeadline
            label={sections[REPORTING_RATE_SUMMARY_SECTION_KEY].info.label}
            sectionKey={REPORTING_RATE_SUMMARY_SECTION_KEY}
        />
        <Paper className={container.className}>
            <Form
                loadReportData={props.loadReportData}
                isActionEnabled={props.isActionEnabled}
            />
        </Paper>
        <TabularReport
            content={props.reportContent}
            isLoading={props.isReportLoading}
            fileUrls={props.fileUrls}
        />
        <Snackbar />
        {container.styles}
    </div>
)

ReportingRateSummary.propTypes = {
    fileUrls: PropTypes.array.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    reportContent: reportContent.isRequired,
}

const ConnectedReportingRateSummary = connectReportingRateSummary(
    ReportingRateSummary
)

export { ConnectedReportingRateSummary as ReportingRateSummary }
