const defaultState = {
    showForm: true,
    reportHtml: null,
    selectedDataSet: null,
    selectedUnitOnly: false,
    selectedOrgUnit: null,
    selectedOptionsForDimensions: {},
    selectedOptionsForOrganisationUnitGroupSets: {},
    showOptions: false,
    selectedPeriod: null,
    comment: '',
    loading: false,
}

const dataSetReport = (state = defaultState, action = {}) => {
    const { type, payload } = action
    switch (type) {
        default:
            return state
    }
}

export default dataSetReport
export { defaultState }
