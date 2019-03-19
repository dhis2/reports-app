import { connect } from 'react-redux'
import { css } from 'styled-jsx/css'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import red from '@material-ui/core/colors/red'

import {
    cancelGeneratingPdfReport,
    submitRequiredReportParams,
} from '../../redux/actions/standardReport'
import OrganisationUnitTree from '../../components/AvailableOrganisationUnitsTree'
import PeriodPicker from '../../components/PeriodPickerWithPeriodType'

const labelCancel = i18n.t('Cancel')
const labelSubmit = i18n.t('Generate report')
const title = i18n.t('Report parameters')
const colorError = red[500]

const buttonStyles = css.resolve`
    width: 100%;
`

export const ReportParams = props => (
    <Dialog
        open={props.showReportParams}
        onClose={props.cancelGeneratingPdfReport}
        fullWidth={true}
    >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
            {props.reportParams.organisationUnit && <OrganisationUnitTree />}

            {props.reportParams.period && <PeriodPicker label="" />}
        </DialogContent>

        <DialogContent>
            {!!props.reportParamsErrors.length && (
                <div className="errors">
                    <p>
                        {i18n.t('There are some errors you have to fix first!')}
                    </p>
                    <ul>
                        {props.reportParamsErrors.map(error => (
                            <li className="error" key={error}>
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="primary-action">
                <Button
                    onClick={props.submitRequiredReportParams}
                    variant="contained"
                    color="primary"
                    classes={{ root: buttonStyles.className }}
                >
                    {labelSubmit}
                </Button>
            </div>

            <div>
                <Button
                    onClick={props.cancelGeneratingPdfReport}
                    variant="contained"
                    color="secondary"
                    classes={{ root: buttonStyles.className }}
                >
                    {labelCancel}
                </Button>
            </div>

            <style jsx>{`
                .errors {
                    margin-bottom: 10px;
                }
                .error {
                    color: ${colorError};
                }
                .primary-action {
                    margin-bottom: 10px;
                }
            `}</style>
            <style>{buttonStyles.styles}</style>
        </DialogContent>
    </Dialog>
)

ReportParams.propTypes = {
    showReportParams: PropTypes.bool.isRequired,
    reportParams: PropTypes.object.isRequired,
    reportParamsErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
    cancelGeneratingPdfReport: PropTypes.func.isRequired,
    submitRequiredReportParams: PropTypes.func.isRequired,
}

export const ConnectedReportParams = connect(
    state => ({
        reportParams: state.standardReport.reportParams,
        reportParamsErrors: state.standardReport.reportParamsErrors,
        showReportParams: state.standardReport.showReportParams,
    }),
    dispatch => ({
        cancelGeneratingPdfReport: () => dispatch(cancelGeneratingPdfReport()),
        submitRequiredReportParams: () =>
            dispatch(submitRequiredReportParams()),
    })
)(ReportParams)
