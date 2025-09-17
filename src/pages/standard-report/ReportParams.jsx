import i18n from '@dhis2/d2-i18n'
import theme from '@dhis2/d2-ui-core/theme/theme'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import OrganisationUnitTree from '../../components/AvailableOrganisationUnitsTree.jsx'
import PeriodPicker from '../../components/PeriodPickerWithPeriodType.jsx'
import {
    cancelGeneratingPdfReport,
    submitRequiredReportParams,
} from '../../redux/actions/standardReport.js'
import styles from './ReportParams.module.css'

const labelCancel = i18n.t('Cancel')
const labelSubmit = i18n.t('Generate report')
const title = i18n.t('Report parameters')

export const ReportParams = (props) => (
    <Dialog
        open={props.showReportParams}
        onClose={props.cancelGeneratingPdfReport}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent
            style={{
                '--primary1-color': theme.palette.primary1Color,
                '--primary2-color': theme.palette.primary2Color,
            }}
        >
            <div className={styles.inputs}>
                {props.reportParams.organisationUnit && (
                    <OrganisationUnitTree />
                )}

                {props.reportParams.period && <PeriodPicker label="" />}
            </div>

            {!!props.reportParamsErrors.length && (
                <div className={styles.errors}>
                    <p>
                        {i18n.t('There are some errors you have to fix first!')}
                    </p>
                    <ul>
                        {props.reportParamsErrors.map((error) => (
                            <li className={styles.error} key={error}>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.primaryAction}>
                <Button
                    onClick={props.submitRequiredReportParams}
                    variant="contained"
                    className={`${styles.fullWidthButton} ${styles.primaryButton}`}
                >
                    {labelSubmit}
                </Button>
            </div>

            <div>
                <Button
                    onClick={props.cancelGeneratingPdfReport}
                    variant="contained"
                    className={styles.fullWidthButton}
                >
                    {labelCancel}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)

ReportParams.propTypes = {
    cancelGeneratingPdfReport: PropTypes.func.isRequired,
    reportParams: PropTypes.object.isRequired,
    reportParamsErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
    showReportParams: PropTypes.bool.isRequired,
    submitRequiredReportParams: PropTypes.func.isRequired,
}

export const ConnectedReportParams = connect(
    (state) => ({
        reportParams: state.standardReport.reportParams,
        reportParamsErrors: state.standardReport.reportParamsErrors,
        showReportParams: state.standardReport.showReportParams,
    }),
    {
        cancelGeneratingPdfReport,
        submitRequiredReportParams,
    }
)(ReportParams)
