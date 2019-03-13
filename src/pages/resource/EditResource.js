import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { getInitialAddEditFormState } from '../../redux/selectors/resource/getInitialAddEditFormState'
import { resourceActions } from '../../utils/resource/constants'
import { ResourceForm } from './add-edit-resource/ResourceForm'

const EditResource = props => (
    <ResourceForm
        open={props.open}
        title={i18n.t('Edit resource')}
        isFileRequired={false}
        onSubmitLabel={i18n.t('Save resource')}
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}
        onCancel={props.onRequestClose}
    />
)

EditResource.propTypes = {
    open: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export const ConnectedEditResource = connect(state => ({
    edit: state.resource.selectedAction === resourceActions.EDIT,
    initialValues: getInitialAddEditFormState(state),
}))(EditResource)
