import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import { InlineHtmlReportCommentable } from '../components/InlineHtmlReportCommentable'
import { DataInputs } from './data-set-report/DataInputs'
import { FormActions } from './data-set-report/FormActions'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import { isActionEnabled } from './data-set-report/helpers'
import i18n from '../utils/i18n/locales'
import styles from '../utils/styles'

class DataSetReport extends React.Component {
    render() {
        const { props } = this
        const formStyle = { display: !props.reportHtml ? 'block' : 'none' }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Data Set Report')}
                    showBackButton={!!props.reportHtml}
                    onBackClick={props.showDataSetReportForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={formStyle}>
                        <DataInputs
                            dataSetDimensions={props.dataSetDimensions}
                            selectedDataSet={props.selectedDataSet}
                            selectedDimensionOptions={
                                props.selectedDimensionOptions
                            }
                            selectedUnitOnly={props.selectedUnitOnly}
                            onDataSetChange={props.selectDataSet}
                            onDimensionChange={props.selectDimensionOption}
                            onSelectedUnitOnlyChange={
                                props.toggleSelectedUnitOnly
                            }
                        />
                        <FormActions
                            onGetReportClick={props.loadHtmlReport}
                            isGetReportDisabled={!isActionEnabled(props)}
                        />
                    </div>
                    <InlineHtmlReportCommentable
                        shouldRender={
                            !!(props.reportHtml && props.selectedDataSet)
                        }
                        dataSetId={props.selectedDataSet.id}
                        period={props.selectedPeriod}
                        orgUnitId={
                            props.selectedOrgUnit
                                ? props.selectedOrgUnit.id
                                : ''
                        }
                        reportHtml={props.reportHtml}
                        reportComment={props.reportComment}
                        onDownloadXlsClick={props.exportReportToXls}
                        shareDataSetReportComment={
                            props.shareDataSetReportComment
                        }
                        setDataSetReportComment={props.setDataSetReportComment}
                    />
                </Paper>
                <Snackbar />
            </div>
        )
    }
}

DataSetReport.propTypes = {
    d2: PropTypes.object.isRequired,
    reportHtml: PropTypes.string.isRequired,
    reportComment: PropTypes.string.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    selectedOrgUnit: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    selectedOrgUnitGroupOptions: PropTypes.object.isRequired,
    showOptions: PropTypes.bool.isRequired,
    showFeedback: PropTypes.bool.isRequired,
    feedbackConf: PropTypes.object.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    selectOrgUnitOption: PropTypes.func.isRequired,
    toggleSelectedUnitOnly: PropTypes.func.isRequired,
    toggleShowOptions: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
    showDataSetReportForm: PropTypes.func.isRequired,
}

export default DataSetReport
export const ConnectedDataSetReport = connectDataSetReport(
    manageError(DataSetReport)
)
