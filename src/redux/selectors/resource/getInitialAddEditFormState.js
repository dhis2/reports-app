import {
    resourceActions,
    resourceTypeOptions,
} from '../../../utils/resource/constants'

export const getInitialAddEditFormState = state => {
    const isEdit = state.resource.selectedAction === resourceActions.EDIT

    if (isEdit) {
        return {}
    } else {
        return {
            name: '',
            type: resourceTypeOptions[1].value,
            attachment: 'no',
        }
    }
}
