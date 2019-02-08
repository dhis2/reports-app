import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import Feedback from '../components/Feedback'
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
        const formStyle = { display: props.showForm ? 'block' : 'none' }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Data Set Report')}
                    showBackButton={!props.showForm}
                    onBackClick={props.showDataSetReportForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={formStyle}>
                        <DataInputs
                            showOptions={props.showOptions}
                            dataSetDimensions={props.dataSetDimensions}
                            selectedOrgUnitOptions={
                                props.selectedOrgUnitGroupOptions
                            }
                            selectedDataSet={props.selectedDataSet}
                            selectedDimensionOptions={
                                props.selectedDimensionOptions
                            }
                            selectedUnitOnly={props.selectedUnitOnly}
                            onToggleShowOptions={props.toggleShowOptions}
                            onOrganisationUnitGroupSetChange={
                                props.selectOrgUnitOption
                            }
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
                            !!(
                                props.reportHtml &&
                                !props.showForm &&
                                props.selectedDataSet
                            )
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
                <Feedback open={props.showFeedback} conf={props.feedbackConf} />
            </div>
        )
    }
}

DataSetReport.propTypes = {
    d2: PropTypes.object.isRequired,
    showForm: PropTypes.bool.isRequired,
    reportHtml: PropTypes.string.isRequired,
    reportComment: PropTypes.string.isRequired,
    dataSetDimensions: PropTypes.array.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    selectedOrgUnit: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    selectedDimensionOptions: PropTypes.object.isRequired,
    selectedOrgUnitGroupOptions: PropTypes.object.isRequired,
    showOptions: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    showFeedback: PropTypes.bool.isRequired,
    feedbackConf: PropTypes.object.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    selectDimensionOption: PropTypes.func.isRequired,
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
