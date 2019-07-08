import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Form } from 'react-final-form'

import { Button } from '../../../components/form/Button'
import { FormSection } from '../../../components/form/FormSection'
import { resourceTypes } from '../../../utils/resource/constants'
import { Attachment } from './ResourceForm/Attachment'
import { File } from './ResourceForm/File'
import { Name } from './ResourceForm/Name'
import { TitleDetails } from './ResourceForm/TitleDetails'
import { TitleResource } from './ResourceForm/TitleResource'
import { Type } from './ResourceForm/Type'
import { Url } from './ResourceForm/Url'

export const ResourceForm = props => (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
        {({ handleSubmit, values, valid }) => (
            <form onSubmit={handleSubmit}>
                {props.isEditingFileResource && (
                    <p className="edit-unavailable">
                        {i18n.t(
                            'File resources can not be edited, only created'
                        )}
                    </p>
                )}
                <fieldset disabled={props.isEditingFileResource}>
                    <FormSection>
                        <TitleDetails />
                        <Name />
                        <Type />
                    </FormSection>

                    <FormSection
                        show={values.type === resourceTypes.EXTERNAL_URL}
                        render={() => (
                            <Fragment>
                                <TitleResource />
                                <Url />
                            </Fragment>
                        )}
                    />

                    <FormSection
                        show={values.type === resourceTypes.UPLOAD_FILE}
                        render={() => (
                            <Fragment>
                                <TitleResource />
                                <Attachment />
                                <File isRequired={props.isFileRequired} />
                            </Fragment>
                        )}
                    />
                </fieldset>

                <Button
                    label={props.onSubmitLabel}
                    isPrimary={true}
                    onClick={handleSubmit}
                    disabled={!valid || props.isEditingFileResource}
                />

                <Button label={i18n.t('Cancel')} onClick={props.onCancel} />

                <style jsx>{`
                    fieldset {
                        position: relative;
                        border: none;
                        margin: 0;
                        padding: 0;
                    }
                    fieldset:disabled::after {
                        content: ' ';
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        background-color: rgba(255, 255, 255, 0.5);
                        pointer-events: none;
                    }
                    p.edit-unavailable {
                        color: red;
                    }
                `}</style>
            </form>
        )}
    </Form>
)

ResourceForm.propTypes = {
    isFileRequired: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    isEditingFileResource: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onSubmitLabel: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
