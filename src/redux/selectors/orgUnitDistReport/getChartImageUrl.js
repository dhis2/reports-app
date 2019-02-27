import { getApi } from '../../../utils/api'

export const getChartImageUrl = state => {
    if (
        !state.organisationUnits.selected ||
        !state.orgUnitGroupSets.selected ||
        !state.orgUnitDistReport.displayImage
    ) {
        return ''
    }

    const { baseUrl } = getApi()
    const orgUnitId = state.organisationUnits.selected.id
    const orgUnitGroupSetsId = state.orgUnitGroupSets.selected
    const currentTime = new Date().getTime()

    const imageUrl = `${baseUrl}/organisationUnits/${orgUnitId}/distributionChart.png`
    const imageUrlParams = `groupSetId=${orgUnitGroupSetsId}&t=${currentTime}`

    return `${imageUrl}?${imageUrlParams}`
}
