import { resolve } from 'styled-jsx/css'
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import i18n from '@dhis2/d2-i18n'

import HtmlReport from './HtmlReport'

const title = i18n.t('HTML Report')
const labelClose = i18n.t('Close')

const containerStyle = resolve`
    div {
        z-index: 1500;
    }
`
const titleStyle = resolve`
    div {
        border-bottom: 1px solid grey;
    }
`
const contentStyle = resolve`
    div {
        padding-top: 20px;
    }
`

const StyledReportData = ({ onReportCloseClick, reportData }) => (
    <Dialog
        open={true}
        onClose={onReportCloseClick}
        fullScreen={true}
        maxWidth={false}
        className={containerStyle.className}
    >
        <DialogTitle className={titleStyle.className}>{title}</DialogTitle>
        <DialogContent className={contentStyle.className}>
            <Button
                onClick={onReportCloseClick}
                variant="contained"
                color="primary"
            >
                {labelClose}
            </Button>
            <HtmlReport html={reportData} />
        </DialogContent>

        <style>{containerStyle.styles}</style>
        <style>{titleStyle.styles}</style>
        <style>{contentStyle.styles}</style>
    </Dialog>
)

StyledReportData.propTypes = {
    reportData: PropTypes.string.isRequired,
    onReportCloseClick: PropTypes.func.isRequired,
}

export default StyledReportData
