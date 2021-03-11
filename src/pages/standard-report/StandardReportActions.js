import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import PropTypes from 'prop-types'
import React from 'react'
import { getD2 } from '../../utils/api'
import { CONTEXT_MENU_ACTION } from './standard.report.conf'
// import { ConnectedAddEditStdReport } from './AddEditStdReport'

const StandardReportActions = ({
    open,
    selectedAction,
    selectedReport,
    handleClose,
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

    return null
}

StandardReportActions.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedReport: PropTypes.object.isRequired,
}

export default StandardReportActions
