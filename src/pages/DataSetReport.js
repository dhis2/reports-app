import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'

import {
    DATA_SET_REPORT_SECTION_KEY,
    sections,
} from '../config/sections.config'
import { SectionHeadline } from '../components/SectionHeadline'
import { Snackbar } from '../components/feedback/Snackbar'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import { container } from '../utils/styles/shared.js'
import { reportContent } from '../utils/react/propTypes'
import DataSetReportOutput from './data-set-report/DataSetReportOutput'
import Form from './data-set-report/Form'

const DataSetReport = props => (
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
                    onNoOfSignaturesChange={props.selectNoOfSignatures}
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
    selectNoOfSignatures: PropTypes.func.isRequired,
}

const ConnectedDataSetReport = connectDataSetReport(DataSetReport)

export { ConnectedDataSetReport as DataSetReport }
