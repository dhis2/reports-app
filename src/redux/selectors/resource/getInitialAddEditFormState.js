import {
    resourceActions,
    resourceTypeOptions,
} from '../../../utils/resource/constants'

export const getInitialAddEditFormState = state => {
    const isEdit = state.resource.selectedAction === resourceActions.EDIT

    if (isEdit) {
        const { selectedResource: resource } = state.resource

        return {
            name: resource.displayName,
            type: resourceTypeOptions[resource.external ? 0 : 1].value,
            attachment: resource.attachment ? 'yes' : 'no',
            url: resource.url,
        }
    } else {
        return {
            name: '',
            type: resourceTypeOptions[1].value,
            attachment: 'no',
        }
    }
}
