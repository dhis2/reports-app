import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import {
    DATA_SET_REPORT_SECTION_KEY,
    sections,
} from '../config/sections.config'
import { reportContent } from '../utils/react/propTypes'
import { container } from '../utils/styles/shared.js'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import DataSetReportOutput from './data-set-report/DataSetReportOutput'
import Form from './data-set-report/Form'

const DataSetReport = (props) => (
    <div>
        <SectionHeadline
            label={sections[DATA_SET_REPORT_SECTION_KEY].info.label}
            sectionKey={DATA_SET_REPORT_SECTION_KEY}
        />
        <Paper className={container.className}>
            <div id="data-set-report-form">
                <Form
                    selectedUnitOnly={props.selectedUnitOnly}
                    onDataSetChange={props.selectDataSet}
                    onSelectedUnitOnlyChange={props.toggleSelectedUnitOnly}
                    onGetReportClick={props.loadReportData}
                    isGetReportDisabled={!props.isActionEnabled}
                />
            </div>
        </Paper>
        <DataSetReportOutput
            isHtmlReport={props.isHtmlReport}
            content={props.reportContent}
            isLoading={props.isReportLoading}
            fileUrls={props.fileUrls}
            reportComment={props.reportComment}
            shareDataSetReportComment={props.shareDataSetReportComment}
            setDataSetReportComment={props.setDataSetReportComment}
        />
        {container.styles}
        <Snackbar />
    </div>
)

DataSetReport.propTypes = {
    fileUrls: PropTypes.array.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    isHtmlReport: PropTypes.bool.isRequired,
    isReportLoading: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
    reportComment: PropTypes.string.isRequired,
    reportContent: reportContent.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    toggleSelectedUnitOnly: PropTypes.func.isRequired,
}

const ConnectedDataSetReport = connectDataSetReport(DataSetReport)

export { ConnectedDataSetReport as DataSetReport }
