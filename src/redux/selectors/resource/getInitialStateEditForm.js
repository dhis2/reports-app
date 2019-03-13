import { resourceTypeOptions } from '../../../utils/resource/constants'

export const getInitialStateEditForm = ({ resource }) => ({
    name: resource.selectedResource.displayName,
    type: resourceTypeOptions[resource.selectedResource.external ? 0 : 1].value,
    attachment: resource.selectedResource.attachment ? 'yes' : 'no',
    url: resource.selectedResource.url,
})
