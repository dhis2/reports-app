import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import DataSetReportOutput from './data-set-report/DataSetReportOutput'
import Form from './data-set-report/Form'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import { reportContent } from '../utils/react/propTypes'

class DataSetReport extends React.Component {
    render() {
        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Data Set Report')}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form">
                        <Form
                            selectedUnitOnly={this.props.selectedUnitOnly}
                            onDataSetChange={this.props.selectDataSet}
                            onSelectedUnitOnlyChange={
                                this.props.toggleSelectedUnitOnly
                            }
                            onGetReportClick={this.props.loadReportData}
                            isGetReportDisabled={!this.props.isActionEnabled}
                        />
                    </div>
                    <DataSetReportOutput
                        isHtmlReport={this.props.isHtmlReport}
                        content={this.props.reportContent}
                        isLoading={this.props.isReportLoading}
                        fileUrls={this.props.fileUrls}
                        reportComment={this.props.reportComment}
                        shareDataSetReportComment={
                            this.props.shareDataSetReportComment
                        }
                        setDataSetReportComment={
                            this.props.setDataSetReportComment
                        }
                    />
                </Paper>
                <Snackbar />
            </div>
        )
    }
}

DataSetReport.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
    fileUrls: PropTypes.array.isRequired,
    isHtmlReport: PropTypes.bool.isRequired,
    reportContent: reportContent.isRequired,
    reportComment: PropTypes.string.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    toggleSelectedUnitOnly: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
}

export default DataSetReport
export const ConnectedDataSetReport = connectDataSetReport(
    manageError(DataSetReport)
)
