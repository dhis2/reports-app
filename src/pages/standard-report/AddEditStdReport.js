import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import i18n from '@dhis2/d2-i18n'

import { Button } from '../../components/form/Button'
import {
    CONTEXT_MENU_ACTION,
    cacheStrategies,
    reportTypeOptions,
    reportTypes,
} from './standard.report.conf'
import { CheckBoxGroups } from '../../components/form/CheckBoxGroups'
import { CheckBoxes } from '../../components/form/CheckBoxes'
import { DesignFileDownloadButton } from './add-edit-report/DesignFileDownloadButton'
import { File } from '../../components/form/File'
import { FormRow } from '../../components/form/FormRow'
import { FormSection } from '../../components/form/FormSection'
import { FormSectionTitle } from '../../components/form/FormSectionTitle'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { formOptions } from '../../utils/react/propTypes'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { relativePeriods } from '../../utils/periods/relativePeriods'
import { reportParameterOptions } from '../../config/standardReport'
import {
    validateNewReport,
    validateReportUpdate,
} from './add-edit-report/validate'
import { loadStandardReportDetails } from '../../redux/actions/standardReport'
import { loadStandardReportTables } from '../../redux/actions/standardReportTables'
import isEmpty from 'lodash.isempty'

export class AddEditStandardReport extends Component {
    componentDidMount() {
        if (this.isEditForm()) {
            this.props.loadStandardReportDetails(this.props.match.params.id)
        }
        if (this.props.reportTables.length === 0) {
            this.props.loadStandardReportTables()
        }
    }

    isEditForm() {
        return this.props.match.params.mode === 'edit'
    }

    render() {
        console.log(this.props.report)
        if (
            isEmpty(this.props.report) ||
            this.props.reportTables.length === 0
        ) {
            return <h1>Loading</h1>
        }
        console.log('HENDRIK report', this.props.report)
        return (
            <Form
                onSubmit={this.props.onSubmit}
                validate={
                    this.isEditForm() ? validateReportUpdate : validateNewReport
                }
                initialValues={this.props.report}
            >
                {({ handleSubmit, values }) => {
                    console.log('HENDRIK: values', values)
                    return (
                        <form onSubmit={handleSubmit}>
                            <DialogContent>
                                <FormSection>
                                    <FormSectionTitle>
                                        {i18n.t('Details')}
                                    </FormSectionTitle>

                                    <FormRow>
                                        <Field
                                            name="name"
                                            placeholder={i18n.t('Name*')}
                                            component={Input}
                                        />
                                    </FormRow>

                                    <FormRow>
                                        <Field
                                            name="type"
                                            placeholder={i18n.t('Report Type*')}
                                            options={reportTypeOptions}
                                            showErrorText={false}
                                            component={Select}
                                        />
                                    </FormRow>

                                    {values.type ===
                                        reportTypes.JASPER_REPORT_TABLE && (
                                        <FormRow>
                                            <Field
                                                name="reportTable"
                                                placeholder={i18n.t(
                                                    'Report Table*'
                                                )}
                                                options={
                                                    this.props.reportTables
                                                }
                                                showErrorText={false}
                                                component={Select}
                                            />
                                        </FormRow>
                                    )}

                                    <div className="row">
                                        <div className="col-xs-6">
                                            <File
                                                name="designContent"
                                                placeholder={
                                                    this.props.edit
                                                        ? i18n.t('Design File')
                                                        : i18n.t('Design File*')
                                                }
                                            />
                                        </div>

                                        <div className="col-xs-6">
                                            <FormHelperText />
                                            <DesignFileDownloadButton
                                                isEditing={this.props.edit}
                                                reportType={values.type}
                                                reportId={
                                                    this.props.edit
                                                        ? this.props.report.id
                                                        : ''
                                                }
                                            />
                                        </div>
                                    </div>
                                </FormSection>

                                <FormSection
                                    show={
                                        values.type !==
                                        reportTypes.JASPER_REPORT_TABLE
                                    }
                                    render={() => (
                                        <React.Fragment>
                                            <FormSectionTitle>
                                                {i18n.t('Relative periods')}
                                            </FormSectionTitle>

                                            <CheckBoxGroups
                                                name="relativePeriods"
                                                groups={relativePeriods}
                                                displayError={false}
                                            />
                                        </React.Fragment>
                                    )}
                                />

                                <FormSection
                                    show={
                                        values.type !==
                                        reportTypes.JASPER_REPORT_TABLE
                                    }
                                    render={() => (
                                        <React.Fragment>
                                            <FormSectionTitle>
                                                {i18n.t('Report parameters')}
                                            </FormSectionTitle>

                                            <CheckBoxes
                                                name="reportParams"
                                                options={reportParameterOptions}
                                            />
                                        </React.Fragment>
                                    )}
                                />

                                <FormSection>
                                    <FormSectionTitle>
                                        {i18n.t('Settings')}
                                    </FormSectionTitle>

                                    <FormRow>
                                        <Field
                                            name="cacheStrategy"
                                            placeholder={i18n.t(
                                                'Cache Strategy*'
                                            )}
                                            options={cacheStrategies}
                                            component={Select}
                                        />
                                    </FormRow>
                                </FormSection>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    label={i18n.t('Submit')}
                                    isPrimary={true}
                                    onClick={handleSubmit}
                                />

                                <Button
                                    label={i18n.t('Cancel')}
                                    onClick={this.props.onRequestClose}
                                />
                            </DialogActions>
                        </form>
                    )
                }}
            </Form>
        )
    }
}

AddEditStandardReport.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            mode: PropTypes.oneOf(['new', 'edit']),
            id: PropTypes.string,
        }),
    }).isRequired,
    loadStandardReportDetails: PropTypes.func.isRequired,
    loadStandardReportTables: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    reportTables: formOptions.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
}

const mapStateToProps = (state, { match }) => {
    return {
        reportTables: state.standardReportTables.collection,
        report: getEditFormInitialValues(state, match.params.mode === 'edit'),
    }
}

const ConnectedComponent = connect(
    mapStateToProps,
    {
        loadStandardReportDetails,
        loadStandardReportTables,
    }
)(AddEditStandardReport)

export { ConnectedComponent as ConnectedAddEditStdReport }
