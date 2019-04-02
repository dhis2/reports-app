import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'

import { Form } from './organisation-unit-distribution-report/Form'
import {
    ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
    sections,
} from '../config/sections.config'
import { SectionHeadline } from '../components/SectionHeadline'
import { Snackbar } from '../components/feedback/Snackbar'
import { connectOrganisationUnitDistributionReport } from './organisation-unit-distribution-report/connectOrganisationUnitDistributionReport'
import { container } from '../utils/styles/shared.js'
import { reportContent } from '../utils/react/propTypes'
import BarChart from '../components/BarChart'
import TabularReport from '../components/TabularReport'

class OrganisationUnitDistributionReport extends React.Component {
    componentDidMount() {
        if (!this.props.groupSetsReady) {
            this.props.loadGroupSetOptions()
        }
    }

    render() {
        return (
            <div>
                <SectionHeadline
                    label={
                        sections[
                            ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY
                        ].info.label
                    }
                    sectionKey={
                        ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY
                    }
                />
                <Paper className={container.className}>
                    <Form
                        isActionEnabled={this.props.isActionEnabled}
                        onGetReportClick={this.props.loadTable}
                        onGetChartClick={this.props.loadChart}
                    />
                    <div id="report-container">
                        {!this.props.shouldShowChart && (
                            <TabularReport
                                content={this.props.reportContent}
                                isLoading={this.props.loading}
                                fileUrls={this.props.fileUrls}
                            />
                        )}
                        {this.props.shouldShowChart && (
                            <BarChart
                                content={this.props.reportContent}
                                isLoading={this.props.loading}
                            />
                        )}
                    </div>
                </Paper>
                <Snackbar />
                {container.styles}
            </div>
        )
    }
}

OrganisationUnitDistributionReport.propTypes = {
    isActionEnabled: PropTypes.bool.isRequired,
    shouldShowChart: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    groupSetsReady: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,
    reportContent: reportContent.isRequired,
    loadTable: PropTypes.func.isRequired,
    loadChart: PropTypes.func.isRequired,
    loadGroupSetOptions: PropTypes.func.isRequired,
}

const ConnectedOrganisationUnitDistributionReport = connectOrganisationUnitDistributionReport(
    OrganisationUnitDistributionReport
)

export {
    ConnectedOrganisationUnitDistributionReport as OrganisationUnitDistributionReport,
}
