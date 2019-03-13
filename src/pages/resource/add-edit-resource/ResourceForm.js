import { Form } from 'react-final-form'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import { File } from '../../../components/form/File'
import { FormDialog } from '../../../components/form/FormDialog'
import { FormSection } from '../../../components/form/FormSection'
import { Type } from '../../../utils/i18n/locales/en/translations.json'
import { resourceTypes } from '../../../utils/resource/constants'
import { TitleResource } from './TitleResource'
import { TitleDetails } from './TitleDetails'
import { Attachment } from './Attachment'
import { Actions } from './Actions'
import { Name } from './Name'
import { Url } from './Url'

export const ResourceForm = props => (
    <FormDialog title={props.title} open={props.open} onClose={props.onCancel}>
        <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <DialogContent>
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
                                    <File validate={props.validateFile} />
                                </Fragment>
                            )}
                        />
                    </DialogContent>
                    <Actions
                        onSubmitLabel={props.onSubmitLabel}
                        onSubmit={handleSubmit}
                        onCancel={props.onCancel}
                    />
                </form>
            )}
        </Form>
    </FormDialog>
)

ResourceForm.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onSubmitLabel: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    validateFile: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
