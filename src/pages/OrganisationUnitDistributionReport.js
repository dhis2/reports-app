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
                        onGetReportClick={this.props.loadReport}
                        onGetChartClick={this.props.loadChart}
                    />
                    <div id="report-container">
                        {!this.props.displayImage && (
                            <TabularReport
                                content={this.props.reportContent}
                                isLoading={this.props.loading}
                                fileUrls={this.props.fileUrls}
                            />
                        )}
                        {this.props.displayImage && (
                            <img
                                onLoad={this.props.handleChartLoaded}
                                onError={this.props.handleChartLoadingError}
                                alt={''}
                                src={this.props.imageUrl}
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

    imageUrl: PropTypes.string.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    displayImage: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    groupSetsReady: PropTypes.bool.isRequired,
    fileUrls: PropTypes.array.isRequired,
    reportContent: PropTypes.object.isRequired,
    loadReport: PropTypes.func.isRequired,
    loadChart: PropTypes.func.isRequired,
    loadGroupSetOptions: PropTypes.func.isRequired,
    handleChartLoaded: PropTypes.func.isRequired,
    handleChartLoadingError: PropTypes.func.isRequired,
}

export const ConnectedOrganisationUnitDistributionReport = connectOrganisationUnitDistributionReport(
    manageError(OrganisationUnitDistributionReport)
)
