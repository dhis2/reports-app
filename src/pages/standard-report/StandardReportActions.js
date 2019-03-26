import React from 'react'
import PropTypes from 'prop-types'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from './standard.report.conf'
import { ConnectedAddEditStdReport } from './AddEditStdReport'

const StandardReportActions = ({
    d2,
    open,
    selectedAction,
    selectedReport,
    handleClose,
    handleError,
    updateStandardReport,
    addStandardReport,
}) => {
    if (selectedAction === CONTEXT_MENU_ACTION.SHARING_SETTINGS) {
        return (
            <SharingDialog
                id={selectedReport.id}
                d2={d2}
                open={open}
                type="report"
                onRequestClose={handleClose}
            />
        )
    }

    if (selectedAction === CONTEXT_MENU_ACTION.EDIT) {
        return (
            <ConnectedAddEditStdReport
                d2={d2}
                open={open}
                edit={true}
                onSubmit={updateStandardReport}
                onRequestClose={handleClose}
                onError={handleError}
            />
        )
    }

    if (selectedAction === ADD_NEW_REPORT_ACTION) {
        return (
            <ConnectedAddEditStdReport
                d2={d2}
                open={open}
                edit={false}
                onSubmit={addStandardReport}
                onRequestClose={handleClose}
                onError={handleError}
            />
        )
    }

    return null
}

StandardReportActions.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedReport: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    handleDisplayReportData: PropTypes.func.isRequired,
    updateStandardReport: PropTypes.func.isRequired,
    addStandardReport: PropTypes.func.isRequired,
}

export default StandardReportActions
