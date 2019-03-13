import { resourceTypeOptions } from '../../../utils/resource/constants'

export const getInitialStateAddForm = () => ({
    name: '',
    type: resourceTypeOptions[1].value,
    attachment: 'no',
})
