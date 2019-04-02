import React from 'react'
import PropTypes from 'prop-types'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from './standard.report.conf'
import { ConnectedAddEditStdReport } from './AddEditStdReport'
import { getD2 } from '../../utils/api'

const StandardReportActions = ({
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
                d2={getD2()}
                open={open}
                type="report"
                onRequestClose={handleClose}
            />
        )
    }

    if (selectedAction === CONTEXT_MENU_ACTION.EDIT) {
        return (
            <ConnectedAddEditStdReport
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
