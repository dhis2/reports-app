import React from 'react'
import PropTypes from 'prop-types'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from './standard.report.conf'
import CreateStdReport from './create-report/CreateStdReport'
import { ConnectedAddEditStdReport } from './add-edit-report/AddEditStdReport'

const ActionComponent = ({
    d2,
    open,
    selectedAction,
    selectedReport,
    handleClose,
    handleError,
    handleDisplayHtmlReport,
}) => {
    if (selectedAction === CONTEXT_MENU_ACTION.CREATE) {
        return (
            <CreateStdReport
                d2={d2}
                open={open}
                selectedReport={selectedReport}
                onRequestClose={handleClose}
                onGetHtmlReport={handleDisplayHtmlReport}
                onError={handleError}
            />
        )
    }

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
                selectedReport={selectedReport}
                open={open}
                onRequestClose={handleClose}
                d2={d2}
                onError={handleError}
            />
        )
    }

    if (selectedAction === ADD_NEW_REPORT_ACTION) {
        return (
            <ConnectedAddEditStdReport
                open={open}
                onRequestClose={handleClose}
                d2={d2}
                onError={handleError}
            />
        )
    }

    return null
}

ActionComponent.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedReport: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    handleDisplayHtmlReport: PropTypes.func.isRequired,
}

export default ActionComponent
