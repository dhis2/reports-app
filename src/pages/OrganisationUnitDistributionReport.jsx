import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import BarChart from '../components/BarChart.jsx'
import { Snackbar } from '../components/feedback/Snackbar.jsx'
import { SectionHeadline } from '../components/SectionHeadline.jsx'
import TabularReport from '../components/TabularReport.jsx'
import {
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    sections,
} from '../config/sections.config.js'
import { reportContent } from '../utils/react/propTypes.js'
import { container } from '../utils/styles/shared.jsx'
import { connectOrganisationUnitDistributionReport } from './organisation-unit-distribution-report/connectOrganisationUnitDistributionReport.js'
import { Form } from './organisation-unit-distribution-report/Form.jsx'

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
                        sections[ORG_UNIT_DIST_REPORT_SECTION_KEY].info.label
                    }
                    sectionKey={ORG_UNIT_DIST_REPORT_SECTION_KEY}
                />
                <Paper className={container.className}>
                    <Form
                        isActionEnabled={this.props.isActionEnabled}
                        onGetReportClick={this.props.loadTable}
                        onGetChartClick={this.props.loadChart}
                    />
                </Paper>
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
                <Snackbar />
                {container.styles}
            </div>
        )
    }
}

OrganisationUnitDistributionReport.propTypes = {
    fileUrls: PropTypes.array.isRequired,
    groupSetsReady: PropTypes.bool.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    loadChart: PropTypes.func.isRequired,
    loadGroupSetOptions: PropTypes.func.isRequired,
    loadTable: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    reportContent: reportContent.isRequired,
    shouldShowChart: PropTypes.bool.isRequired,
}

const ConnectedOrganisationUnitDistributionReport =
    connectOrganisationUnitDistributionReport(
        OrganisationUnitDistributionReport
    )

export { ConnectedOrganisationUnitDistributionReport as OrganisationUnitDistributionReport }
