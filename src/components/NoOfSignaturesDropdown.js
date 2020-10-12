import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import { selectNoOfSignatures } from '../redux/actions/dataSetNoOfSignatuesReport'
import { formLabel } from '../utils/styles/shared.js'

const hintTextLoading = i18n.t('Loading options...')
const hintTextDefault = i18n.t('Select Number Of Signature')

export const NoOfSignaturesDropdown = props => (
    <div>
        <span className={formLabel.className}>{props.label}</span>
        <DropDown
            fullWidth={props.fullWidth}
            value={props.selected.id}
            onChange={
                props.onChange ? props.onChange : props.selectNoOfSignatures
            }
            menuItems={props.noOfSignatures}
            hintText={props.loading ? hintTextLoading : hintTextDefault}
            disabled={props.loading}
        />
        {formLabel.styles}
    </div>
)

NoOfSignaturesDropdown.propTypes = {
    selected: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    noOfSignatures: PropTypes.array.isRequired,
    selectNoOfSignatures: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    filter: PropTypes.func,
}

NoOfSignaturesDropdown.defaultProps = {
    onChange: null,
    label: i18n.t('Number of signatures'),
    fullWidth: true,
    filter: null,
}

// const mapStateToProps = ({ loading, selected, noOfSignatures }) => ({
//     loading,
//     selected,
//     noOfSignatures,
// })

const mapStateToProps = state => ({
    loading: state.dataSetNoOfSignatuesReport.loading,
    noOfSignatures: state.dataSetNoOfSignatuesReport.noOfSignatures,
    selected: state.dataSetNoOfSignatuesReport.selected,
})

const mapDispatchToProps = dispatch => ({
    selectNoOfSignatures: event =>
        dispatch(selectNoOfSignatures(event.target.value)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoOfSignaturesDropdown)
