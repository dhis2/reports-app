import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import DataSetReportOutput from './data-set-report/DataSetReportOutput'
import Form from './data-set-report/Form'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import { reportContent } from '../utils/react/propTypes'

const DataSetReport = props => (
    <div>
        <SectionHeadline
            label={i18n.t('Data Set Report')}
            systemVersion={props.d2.system.version}
            sectionKey={props.sectionKey}
        />
        <Paper style={styles.container}>
            <div id="data-set-report-form">
                <Form
                    selectedUnitOnly={props.selectedUnitOnly}
                    onDataSetChange={props.selectDataSet}
                    onSelectedUnitOnlyChange={props.toggleSelectedUnitOnly}
                    onGetReportClick={props.loadReportData}
                    isGetReportDisabled={!props.isActionEnabled}
                />
            </div>
            <DataSetReportOutput
                isHtmlReport={props.isHtmlReport}
                content={props.reportContent}
                isLoading={props.isReportLoading}
                fileUrls={props.fileUrls}
                reportComment={props.reportComment}
                shareDataSetReportComment={props.shareDataSetReportComment}
                setDataSetReportComment={props.setDataSetReportComment}
            />
        </Paper>
        <Snackbar />
    </div>
)

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

const ConnectedDataSetReport = connectDataSetReport(DataSetReport)

export { ConnectedDataSetReport as DataSetReport }
