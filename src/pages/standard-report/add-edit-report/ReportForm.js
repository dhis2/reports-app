import i18n from '@dhis2/d2-i18n'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import { Field, Form } from 'react-final-form'
import { Button } from '../../../components/form/Button.js'
import { CheckBoxes } from '../../../components/form/CheckBoxes.js'
import { CheckBoxGroups } from '../../../components/form/CheckBoxGroups.js'
import { File } from '../../../components/form/File.js'
import { FormRow } from '../../../components/form/FormRow.js'
import { FormSection } from '../../../components/form/FormSection.js'
import { FormSectionTitle } from '../../../components/form/FormSectionTitle.js'
import { Input } from '../../../components/form/Input.js'
import { ReportTableSearchInput } from '../../../components/form/ReportTableSearchInput.js'
import { Select } from '../../../components/form/Select.js'
import { reportParameterOptions } from '../../../config/standardReport.js'
import { RELATIVE_PERIODS } from '../../../utils/periods/relativePeriods.js'
import {
    cacheStrategies,
    reportTypeOptions,
    reportTypes,
} from '../standard.report.conf.js'
import { DesignFileDownloadButton } from './DesignFileDownloadButton.js'
import { validateNewReport, validateReportUpdate } from './validate.js'

const ReportForm = (props) => (
    <Form
        onSubmit={props.onSubmit}
        validate={props.edit ? validateReportUpdate : validateNewReport}
        initialValues={props.report}
        subscription={{ values: true, initialValues: false }}
    >
        {({ handleSubmit, values }) => {
            return (
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
                                    component={ReportTableSearchInput}
                                />
                            </FormRow>
                        )}

                        <div className="row">
                            <div className="col-xs-6">
                                <File
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
                                    isEditing={props.edit}
                                    reportType={values.type}
                                    reportId={props.edit ? props.report.id : ''}
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
                                    groups={RELATIVE_PERIODS}
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
                    <Button
                        label={i18n.t('Submit')}
                        isPrimary={true}
                        onClick={handleSubmit}
                    />

                    <Button
                        label={i18n.t('Cancel')}
                        onClick={props.backToList}
                    />
                </form>
            )
        }}
    </Form>
)

ReportForm.propTypes = {
    backToList: PropTypes.func.isRequired,
    edit: PropTypes.bool.isRequired,
    report: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export { ReportForm }
