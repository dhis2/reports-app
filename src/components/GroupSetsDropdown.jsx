import i18n from '@dhis2/d2-i18n'
import { DropDown } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setGroupSet } from '../redux/actions/orgUnitGroupSets.js'
import { formLabel } from '../utils/styles/shared.jsx'

const label = i18n.t('Group Set')
const hintText = i18n.t('Select Group Set')

export const GroupSetsDropdown = (props) => (
    <div>
        <span className={formLabel.className}>{label}</span>
        <DropDown
            fullWidth={props.fullWidth}
            value={props.selected}
            onChange={props.selectGroupSet}
            menuItems={props.collection}
            includeEmpty
            emptyLabel={hintText}
            hintText={hintText}
        />
        {formLabel.styles}
    </div>
)

GroupSetsDropdown.propTypes = {
    collection: PropTypes.array.isRequired,
    selectGroupSet: PropTypes.func.isRequired,
    selected: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
}

GroupSetsDropdown.defaultProps = {
    fullWidth: true,
}

const mapStateToProps = (state) => ({
    collection: state.orgUnitGroupSets.collection,
    selected: state.orgUnitGroupSets.selected,
})

const mapDispatchToProps = (dispatch) => ({
    selectGroupSet: (e) => dispatch(setGroupSet(e.target.value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupSetsDropdown)
