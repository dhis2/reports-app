import PropTypes from 'prop-types'
import React from 'react'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'

import { ConnectedAddResource } from './AddResource'
import { ConnectedEditResource } from './EditResource'
import { resourceActions } from '../../utils/resource/constants'

const ResourceActions = props => {
    const { selectedAction } = props
    if (!props.selectedAction) return null

    if (props.selectedAction === resourceActions.NEW) {
        return <ConnectedAddResource />
    }

    if (selectedAction === resourceActions.EDIT) {
        return <ConnectedEditResource />
    }

    if (selectedAction === resourceActions.SHARING_SETTINGS) {
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

    return null
}

ResourceActions.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedResource: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
}

export default ResourceActions
