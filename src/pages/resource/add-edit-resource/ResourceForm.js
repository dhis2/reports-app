import { Form } from 'react-final-form'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import { FormDialog } from '../../../components/form/FormDialog'
import { FormSection } from '../../../components/form/FormSection'
import { resourceTypes } from '../../../utils/resource/constants'
import { Actions } from './ResourceForm/Actions'
import { Attachment } from './ResourceForm/Attachment'
import { File } from './ResourceForm/File'
import { Name } from './ResourceForm/Name'
import { TitleDetails } from './ResourceForm/TitleDetails'
import { TitleResource } from './ResourceForm/TitleResource'
import { Type } from './ResourceForm/Type'
import { Url } from './ResourceForm/Url'

export const ResourceForm = props => (
    <FormDialog title={props.title} open={props.open} onClose={props.onCancel}>
        <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
            {({ handleSubmit, values, valid }) => (
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
                                    <File isRequired={props.isFileRequired} />
                                </Fragment>
                            )}
                        />
                    </DialogContent>
                    <Actions
                        onSubmitLabel={props.onSubmitLabel}
                        onSubmit={handleSubmit}
                        onCancel={props.onCancel}
                        submitDisabled={!valid}
                    />
                </form>
            )}
        </Form>
    </FormDialog>
)

ResourceForm.propTypes = {
    isFileRequired: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onSubmitLabel: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
