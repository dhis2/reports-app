export const isFormValid = props =>
    props.selectedOrgUnit &&
    props.selectedDataSet &&
    props.selectedDataSet.id &&
    props.selectedPeriod

export const isActionEnabled = props => isFormValid(props) && !props.loading
