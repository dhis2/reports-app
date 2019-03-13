import { Form } from 'react-final-form'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import { Actions } from './Actions'
import { Attachment } from './Attachment'
import { File } from './File'
import { FormDialog } from '../../../components/form/FormDialog'
import { FormSection } from '../../../components/form/FormSection'
import { Name } from './Name'
import { TitleDetails } from './TitleDetails'
import { TitleResource } from './TitleResource'
import { Type } from './Type'
import { Url } from './Url'
import { resourceTypes } from '../../../utils/resource/constants'

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
                                    <File isRequired={props.isFileRequired} />
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
    isFileRequired: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onSubmitLabel: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
