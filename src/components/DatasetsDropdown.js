import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import { selectDataSet } from '../redux/actions/dataSet'
import { formLabel } from '../utils/styles/shared.js'

const hintTextLoading = i18n.t('Loading options...')
const hintTextDefault = i18n.t('Select Data Set')

export const DatasetsDropdown = props => (
    <div>
        <span className={formLabel.className}>{props.label}</span>
        <DropDown
            fullWidth={props.fullWidth}
            value={props.selected.id}
            onChange={props.onChange ? props.onChange : props.selectDataSet}
            menuItems={props.options}
            hintText={props.loading ? hintTextLoading : hintTextDefault}
            disabled={props.loading}
        />
        {formLabel.styles}
    </div>
)

DatasetsDropdown.propTypes = {
    selected: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    filter: PropTypes.func,
}

DatasetsDropdown.defaultProps = {
    onChange: null,
    label: i18n.t('Data set'),
    fullWidth: true,
    filter: null,
}

const mapStateToProps = ({ dataSet: { loading, selected, options } }) => ({
    loading,
    selected,
    options,
})

const mapDispatchToProps = dispatch => ({
    selectDataSet: event => dispatch(selectDataSet(event.target.value)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetsDropdown)
