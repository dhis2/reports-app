export const isFormValid = props =>
    props.selectedOrgUnit && props.selectedPeriod
export const isActionEnabled = props => isFormValid(props) && !props.loading
