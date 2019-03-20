import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import i18n from '@dhis2/d2-i18n'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import styles from '../utils/styles'
import TabularReport from '../components/TabularReport'
import { Snackbar } from '../components/feedback/Snackbar'
import { connectOrganisationUnitDistributionReport } from './organisation-unit-distribution-report/connectOrganisationUnitDistributionReport'
import { SectionHeadline } from '../components/SectionHeadline'
import { Form } from './organisation-unit-distribution-report/Form'
import BarChart from '../components/BarChart'
import { reportContent } from '../utils/react/propTypes'

export default class OrganisationUnitDistributionReport extends React.Component {
    componentDidMount() {
        if (!this.props.groupSetsReady) {
            this.props.loadGroupSetOptions()
        }
    }

    render() {
        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Organisation Unit Distribution Report')}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
                />
                <Paper style={styles.container}>
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
            </div>
        )
    }
}

OrganisationUnitDistributionReport.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
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

export const ConnectedOrganisationUnitDistributionReport = connectOrganisationUnitDistributionReport(
    manageError(OrganisationUnitDistributionReport)
)
