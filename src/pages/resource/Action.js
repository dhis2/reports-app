import React from 'react'
import PropTypes from 'prop-types'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { ConnectedAddEditResource } from './add-edit-resource/AddEditResource'
import { ADD_NEW_RESOURCE_ACTION, CONTEXT_MENU_ACTION } from './resource.conf'

export const Action = props => {
    const { selectedAction } = props
    if (!props.selectedAction) return null

    if (props.selectedAction === ADD_NEW_RESOURCE_ACTION) {
        return (
            <ConnectedAddEditResource
                d2={props.d2}
                open={props.open}
                onRequestClose={props.handleClose}
                onError={props.handleError}
            />
        )
    }

    if (selectedAction === CONTEXT_MENU_ACTION.SHARING_SETTINGS) {
        if (!props.selectedResource) return null

        return (
            <SharingDialog
                open={props.open}
                id={props.selectedResource.id}
                type="document"
                onRequestClose={props.handleClose}
                d2={props.d2}
            />
        )
    }

    if (selectedAction === CONTEXT_MENU_ACTION.EDIT) {
        return (
            <ConnectedAddEditResource
                selectedResource={props.selectedResource}
                open={props.open}
                onRequestClose={props.handleClose}
                d2={props.d2}
                onError={props.handleError}
            />
        )
    }
}

Action.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedResource: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
}
