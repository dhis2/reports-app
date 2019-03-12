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
import { Select } from '../../components/form/Select'
import {
    resourceTypeOptions,
    resourceTypes,
} from '../../utils/resource/constants'

const titleAdd = i18n.t('Add resource')
const titleEdit = i18n.t('Edit resource')

const onSubmit = values => console.log('SUBMIT!!!', values)
const validateResourceUpdate = () => false
const validateNewResource = () => false

const AddEditResource = props => (
    <FormDialog
        title={props.edit ? titleEdit : titleAdd}
        open={props.open}
        onClose={() => props.onRequestClose(false)}
    >
        <Form
            onSubmit={props.onSubmit}
            validate={props.edit ? validateResourceUpdate : validateNewResource}
            initialValues={props.initialValues}
        >
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
                                        <p>
                                            Do you want to use this file as an
                                            attachment?
                                        </p>
                                        <Field
                                            name="attachment"
                                            value="yes"
                                            type="radio"
                                            component="input"
                                        />{' '}
                                        Yes
                                        <Field
                                            name="attachment"
                                            value="no"
                                            type="radio"
                                            component="input"
                                        />{' '}
                                        No
                                    </FormRow>

                                    <FormRow>
                                        <File
                                            name="fileName"
                                            placeholder={i18n.t('File')}
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
    edit: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
}

export const ConnectedAddEditResource = connect(
    () => ({
        edit: false,
        initialValues: {
            type: resourceTypeOptions[1].value,
            attachment: 'no',
        },
    }),
    () => ({ onSubmit })
)(AddEditResource)
