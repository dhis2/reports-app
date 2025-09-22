import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-final-form'
import { FormSection } from '../../../components/form/FormSection.jsx'
import { resourceTypes } from '../../../utils/resource/constants.js'
import { Attachment } from './ResourceForm/Attachment.jsx'
import { File } from './ResourceForm/File.jsx'
import { Name } from './ResourceForm/Name.jsx'
import { TitleDetails } from './ResourceForm/TitleDetails.jsx'
import { TitleResource } from './ResourceForm/TitleResource.jsx'
import { Type } from './ResourceForm/Type.jsx'
import { Url } from './ResourceForm/Url.jsx'
import styles from './ResourceForm.module.css'

export const ResourceForm = (props) => (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
        {({ handleSubmit, values, valid }) => (
            <form onSubmit={handleSubmit}>
                {props.isEditingFileResource && (
                    <p className={styles.editUnavailable}>
                        {i18n.t(
                            'File resources can not be edited, only created'
                        )}
                    </p>
                )}
                <fieldset
                    className={styles.fieldset}
                    disabled={props.isEditingFileResource}
                >
                    <FormSection>
                        <TitleDetails />
                        <Name />
                        <Type />
                    </FormSection>

                    <FormSection
                        show={values.type === resourceTypes.EXTERNAL_URL}
                        render={() => (
                            <>
                                <TitleResource />
                                <Url />
                            </>
                        )}
                    />

                    <FormSection
                        show={values.type === resourceTypes.UPLOAD_FILE}
                        render={() => (
                            <>
                                <TitleResource />
                                <Attachment />
                                <File isRequired={props.isFileRequired} />
                            </>
                        )}
                    />
                </fieldset>
                <button
                    type="button"
                    id="main-action-button"
                    onClick={handleSubmit}
                    disabled={!valid || props.isEditingFileResource}
                >
                    {props.onSubmitLabel}
                </button>

                <button
                    type="button"
                    id="cancel-button"
                    onClick={props.onCancel}
                >
                    {i18n.t('CANCEL')}
                </button>
            </form>
        )}
    </Form>
)

ResourceForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
    isEditingFileResource: PropTypes.bool.isRequired,
    isFileRequired: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSubmitLabel: PropTypes.string.isRequired,
}
