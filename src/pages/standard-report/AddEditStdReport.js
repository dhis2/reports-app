import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import { Dialog } from 'material-ui'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import {
    CONTEXT_MENU_ACTION,
    cacheStrategies,
    reportTypeOptions,
    reportTypes,
} from './standard.report.conf'
import { CheckBoxGroups } from '../../components/form/CheckBoxGroups'
import { CheckBoxes } from '../../components/form/CheckBoxes'
import { DesignFileDownloadButton } from './add-edit-report/DesignFileDownloadButton'
import { Button } from '../../components/form/Button'
import { File } from '../../components/form/File'
import { FormRow } from '../../components/form/FormRow'
import { FormSection } from '../../components/form/FormSection'
import { FormSectionTitle } from '../../components/form/FormSectionTitle'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { reportParameterOptions } from '../../config/standardReport'
import { formOptions } from '../../utils/react/propTypes'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { relativePeriods } from '../../utils/periods/relativePeriods'
import {
    validateNewReport,
    validateReportUpdate,
} from './add-edit-report/validate'
import styles from './add-edit-report/AddEditStdReport.style'

export const Component = props => (
    <Dialog
        modal
        autoDetectWindowHeight
        autoScrollBodyContent
        open={props.open}
        title={props.edit ? 'Edit report' : 'Add report'}
        contentStyle={styles.dialog}
    >
        <Form
            onSubmit={props.onSubmit}
            validate={props.edit ? validateReportUpdate : validateNewReport}
            initialValues={props.selectedReport}
        >
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <FormSection>
                        <FormSectionTitle>{i18n.t('Details')}</FormSectionTitle>

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

                        {values.type === reportTypes.JASPER_REPORT_TABLE && (
                            <FormRow>
                                <Field
                                    name="reportTable"
                                    placeholder={i18n.t('Report Table*')}
                                    options={props.reportTables}
                                    showErrorText={false}
                                    component={Select}
                                />
                            </FormRow>
                        )}

                        <div className="row">
                            <div className="col-xs-6">
                                <File
                                    fileAsBlob={true}
                                    name="designContent"
                                    placeholder={
                                        props.edit
                                            ? i18n.t('Design File')
                                            : i18n.t('Design File*')
                                    }
                                />
                            </div>

                            <div className="col-xs-6">
                                <FormHelperText />
                                <DesignFileDownloadButton
                                    isEditing={!!props.selectedReport}
                                    reportType={values.type}
                                    reportId={
                                        props.edit
                                            ? props.selectedReport.id
                                            : ''
                                    }
                                />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection
                        show={values.type !== reportTypes.JASPER_REPORT_TABLE}
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
                        show={values.type !== reportTypes.JASPER_REPORT_TABLE}
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
                                placeholder={i18n.t('Cache Strategy*')}
                                options={cacheStrategies}
                                component={Select}
                            />
                        </FormRow>
                    </FormSection>

                    <FormSection>
                        <Button
                            label={i18n.t('Submit')}
                            isPrimary={true}
                            onClick={handleSubmit}
                        />

                        <Button
                            label={i18n.t('Cancel')}
                            onClick={() => props.onRequestClose(false)}
                        />
                    </FormSection>
                </form>
            )}
        </Form>
    </Dialog>
)

Component.propTypes = {
    open: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    selectedReport: PropTypes.object.isRequired,
    reportTables: formOptions.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    reportTables: state.standardReportTables.collection,
    selectedReport: getEditFormInitialValues(
        state,
        state.standardReport.selectedAction === CONTEXT_MENU_ACTION.EDIT
    ),
})

const ConnectedComponent = connect(mapStateToProps)(Component)

export { ConnectedComponent as ConnectedAddEditStdReport }
