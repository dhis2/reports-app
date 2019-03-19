import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import i18n from '@dhis2/d2-i18n'

import HtmlReport from './HtmlReport'

const title = i18n.t('HTML Report')
const labelClose = i18n.t('Close')

const StyledReportData = ({ onReportCloseClick, reportData }) => (
    <Dialog open={true} onClose={onReportCloseClick} fullScreen={true}>
        <DialogTitle>{title}</DialogTitle>
        <DialogActions>
            <Button
                onClick={onReportCloseClick}
                variant="contained"
                color="primary"
            >
                {labelClose}
            </Button>
        </DialogActions>
        <DialogContent>
            <HtmlReport html={reportData} />
        </DialogContent>
    </Dialog>
)

StyledReportData.propTypes = {
    reportData: PropTypes.string.isRequired,
    onReportCloseClick: PropTypes.func.isRequired,
}

export default StyledReportData
