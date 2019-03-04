import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import { TabularReportCommentable } from '../components/TabularReportCommentable'
import { DataInputs } from './data-set-report/DataInputs'
import { FormActions } from './data-set-report/FormActions'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'

class DataSetReport extends React.Component {
    render() {
        const formStyle = { display: !this.props.hasReport ? 'block' : 'none' }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Data Set Report')}
                    showBackButton={this.props.hasReport}
                    onBackClick={this.props.showDataSetReportForm}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={formStyle}>
                        <DataInputs
                            selectedUnitOnly={this.props.selectedUnitOnly}
                            onDataSetChange={this.props.selectDataSet}
                            onSelectedUnitOnlyChange={
                                this.props.toggleSelectedUnitOnly
                            }
                        />
                        <FormActions
                            onGetReportClick={this.props.loadReportData}
                            isGetReportDisabled={!this.props.isActionEnabled}
                        />
                    </div>
                    <TabularReportCommentable
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
    reportContent: PropTypes.object.isRequired,
    reportComment: PropTypes.string.isRequired,
    hasReport: PropTypes.bool.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    selectedOrgUnit: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadReportData: PropTypes.func.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    toggleSelectedUnitOnly: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
    showDataSetReportForm: PropTypes.func.isRequired,
}

export default DataSetReport
export const ConnectedDataSetReport = connectDataSetReport(
    manageError(DataSetReport)
)
