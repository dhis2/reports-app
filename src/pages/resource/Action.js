import React from 'react'
import PropTypes from 'prop-types'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { ConnectedAddEditResource } from './AddEditResource'
import { resourceActions } from '../../utils/resource/constants'

export const Action = props => {
    const { selectedAction } = props
    if (!props.selectedAction) return null

    if (props.selectedAction === resourceActions.NEW) {
        return (
            <ConnectedAddEditResource
                d2={props.d2}
                open={props.open}
                onRequestClose={props.handleClose}
                onError={props.handleError}
                onSubmit={props.addNewResource}
            />
        )
    }

    if (selectedAction === resourceActions.SHARING_SETTINGS) {
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

    if (selectedAction === resourceActions.EDIT) {
        return (
            <ConnectedAddEditResource
                selectedResource={props.selectedResource}
                open={props.open}
                onRequestClose={props.handleClose}
                d2={props.d2}
                onError={props.handleError}
                onSubmit={props.updateResource}
            />
        )
    }

    return null
}

Action.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedResource: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    addNewResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
}
