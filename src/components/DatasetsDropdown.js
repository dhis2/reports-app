import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '../utils/i18n/locales'
import styles from '../utils/styles'
import { selectDataSet } from '../redux/actions/dataSet'

const emptyLabel = i18n.t('Select Data Set')
const hintTextLoading = i18n.t('Loading options...')
const hintTextDefault = i18n.t('Select Data Set')

export const DatasetsDropdown = props => (
    <div>
        <span style={styles.formLabel}>{props.label}</span>
        <DropDown
            includeEmpty
            fullWidth={props.fullWidth}
            value={props.selected.id}
            onChange={props.onChange ? props.onChange : props.selectDataSet}
            menuItems={props.options}
            emptyLabel={emptyLabel}
            hintText={props.loading ? hintTextLoading : hintTextDefault}
            disabled={props.loading}
        />
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
