import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { getInitialAddEditFormState } from '../../redux/selectors/resource/getInitialAddEditFormState'
import { resourceActions } from '../../utils/resource/constants'
import { isRequriedWhenTypeUploadFile } from './helper'
import { ResourceForm } from './add-edit-resource/ResourceForm'

const AddResource = props => (
    <ResourceForm
        open={props.open}
        title={i18n.t('Add resource')}
        onSubmitLabel={i18n.t('Add resource')}
        initialValues={props.initialValues}
        validateFile={isRequriedWhenTypeUploadFile}
        onSubmit={props.onSubmit}
        onCancel={props.onRequestClose}
    />
)

AddResource.propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    edit: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export const ConnectedAddResource = connect(state => ({
    edit: state.resource.selectedAction === resourceActions.EDIT,
    initialValues: getInitialAddEditFormState(state),
}))(AddResource)
