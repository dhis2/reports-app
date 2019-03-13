import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import i18n from '@dhis2/d2-i18n'

import { Button } from '../../components/form/Button'
import { File } from '../../components/form/File'
import { FormDialog } from '../../components/form/FormDialog'
import { FormRow } from '../../components/form/FormRow'
import { FormSection } from '../../components/form/FormSection'
import { FormSectionTitle } from '../../components/form/FormSectionTitle'
import { Input } from '../../components/form/Input'
import { RadioButtons } from '../../components/form/RadioButtons'
import { Select } from '../../components/form/Select'
import { getInitialAddEditFormState } from '../../redux/selectors/resource/getInitialAddEditFormState'
import { isRequired, isRequiredWhen } from '../../utils/form/validators'
import {
    resourceActions,
    resourceTypeOptions,
    resourceTypes,
} from '../../utils/resource/constants'

const titleAdd = i18n.t('Add resource')
const titleEdit = i18n.t('Edit resource')

const isTypeExternalUrl = values => values.type === resourceTypes.EXTERNAL_URL
const isTypeUploadFile = values => values.type === resourceTypes.UPLOAD_FILE
const isRequriedWhenTypeExternalUrl = isRequiredWhen(isTypeExternalUrl)
const isRequriedWhenTypeUploadFile = isRequiredWhen(isTypeUploadFile)

const AddEditResource = props => (
    <FormDialog
        title={props.edit ? titleEdit : titleAdd}
        open={props.open}
        onClose={() => props.onRequestClose(false)}
    >
        <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
            {({ handleSubmit, values }) => (
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
                                    validate={isRequired}
                                />
                            </FormRow>

                            <FormRow>
                                <Field
                                    name="type"
                                    placeholder={i18n.t('Resource Type')}
                                    options={resourceTypeOptions}
                                    showErrorText={false}
                                    component={Select}
                                />
                            </FormRow>
                        </FormSection>

                        <FormSection
                            show={values.type === resourceTypes.EXTERNAL_URL}
                            render={() => (
                                <Fragment>
                                    <FormSectionTitle>
                                        {i18n.t('Resource')}
                                    </FormSectionTitle>

                                    <FormRow>
                                        <Field
                                            name="resourceUrl"
                                            placeholder={i18n.t('Url*')}
                                            component={Input}
                                            validate={
                                                isRequriedWhenTypeExternalUrl
                                            }
                                        />
                                    </FormRow>
                                </Fragment>
                            )}
                        />

                        <FormSection
                            show={values.type === resourceTypes.UPLOAD_FILE}
                            render={() => (
                                <Fragment>
                                    <FormSectionTitle>
                                        {i18n.t('Resource')}
                                    </FormSectionTitle>

                                    <FormRow>
                                        <p style={{ marginTop: 0 }}>
                                            Do you want to use this file as an
                                            attachment?
                                        </p>
                                        <RadioButtons
                                            name="attachment"
                                            options={[
                                                {
                                                    value: 'yes',
                                                    label: i18n.t('Yes'),
                                                },
                                                {
                                                    value: 'no',
                                                    label: i18n.t('No'),
                                                },
                                            ]}
                                            showError={false}
                                        />
                                    </FormRow>

                                    <FormRow>
                                        <File
                                            name="file"
                                            placeholder={i18n.t('File')}
                                            fieldProps={{
                                                validate: isRequriedWhenTypeUploadFile,
                                            }}
                                        />
                                    </FormRow>
                                </Fragment>
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            label={
                                props.edit ? i18n.t('Save') : i18n.t('Upload')
                            }
                            isPrimary={true}
                            onClick={handleSubmit}
                        />

                        <Button
                            label={i18n.t('Cancel')}
                            onClick={() => props.onRequestClose(false)}
                        />
                    </DialogActions>
                </form>
            )}
        </Form>
    </FormDialog>
)

AddEditResource.propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,

    edit: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export const ConnectedAddEditResource = connect(state => ({
    edit: state.resource.selectedAction === resourceActions.EDIT,
    initialValues: getInitialAddEditFormState(state),
}))(AddEditResource)
