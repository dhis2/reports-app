import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { ResourceForm } from './add-edit-resource/ResourceForm'
import { addNewResource, closeContextMenu } from '../../redux/actions/resource'
import { extractFileAndFormattedResource } from './helper'
import { getInitialStateAddForm } from '../../redux/selectors/resource/getInitialStateAddForm'

const AddResource = props => (
    <ResourceForm
        open={props.open}
        title={i18n.t('Add resource')}
        isFileRequired={true}
        onSubmitLabel={i18n.t('Add resource')}
        initialValues={props.initialValues}
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
    />
)

AddResource.propTypes = {
    open: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export const ConnectedAddResource = connect(
    state => ({
        open: state.resource.open,
        initialValues: getInitialStateAddForm(),
    }),
    dispatch => ({
        onCancel: () => dispatch(closeContextMenu()),
        onSubmit: values => {
            const { file, resource } = extractFileAndFormattedResource(values)
            dispatch(addNewResource(resource, file))
        },
    })
)(AddResource)
