import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { ResourceForm } from './add-edit-resource/ResourceForm'
import { closeContextMenu, updateResource } from '../../redux/actions/resource'
import { extractFileAndFormattedResource } from './helper'
import { getInitialStateEditForm } from '../../redux/selectors/resource/getInitialStateEditForm'

const EditResource = props => (
    <ResourceForm
        open={props.open}
        title={i18n.t('Edit resource')}
        isFileRequired={false}
        onSubmitLabel={i18n.t('Save resource')}
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
    />
)

EditResource.propTypes = {
    open: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export const ConnectedEditResource = connect(
    state => ({
        open: state.resource.open,
        initialValues: getInitialStateEditForm(state),
    }),
    dispatch => ({
        onCancel: () => dispatch(closeContextMenu()),
        onSubmit: values => {
            const { file, resource } = extractFileAndFormattedResource(values)
            dispatch(updateResource(resource, file))
        },
    })
)(EditResource)
