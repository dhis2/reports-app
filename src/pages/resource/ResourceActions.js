import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import PropTypes from 'prop-types'
import React from 'react'
import { getD2 } from '../../utils/api'
import { resourceActions } from '../../utils/resource/constants'

const ResourceActions = (props) => {
    const { selectedAction } = props
    if (!props.selectedAction) {
        return null
    }

    if (selectedAction === resourceActions.SHARING_SETTINGS) {
        return (
            <SharingDialog
                open={props.open}
                id={props.selectedResource.id}
                type="document"
                onRequestClose={props.handleClose}
                d2={getD2()}
            />
        )
    }

    return null
}

ResourceActions.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedResource: PropTypes.object.isRequired,
}

export default ResourceActions
