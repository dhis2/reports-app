import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { setGroupSet } from '../redux/actions/orgUnitGroupSets'
import { formLabel } from '../utils/styles/shared.js'

const label = i18n.t('Group Set')
const hintText = i18n.t('Select Group Set')

export class GroupSetsDropdown extends PureComponent {
    static propTypes = {
        collection: PropTypes.array.isRequired,
        selected: PropTypes.string.isRequired,
        selectGroupSet: PropTypes.func.isRequired,
        fullWidth: PropTypes.bool,
    }

    static defaultProps = {
        fullWidth: true,
    }

    render() {
        return (
            <div>
                <span className={formLabel.className}>{label}</span>
                <DropDown
                    fullWidth={this.props.fullWidth}
                    value={this.props.selected}
                    onChange={this.props.selectGroupSet}
                    menuItems={this.props.collection}
                    includeEmpty
                    emptyLabel={hintText}
                    hintText={hintText}
                />
                {formLabel.styles}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    collection: state.orgUnitGroupSets.collection,
    selected: state.orgUnitGroupSets.selected,
})

const mapDispatchToProps = dispatch => ({
    selectGroupSet: e => dispatch(setGroupSet(e.target.value)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupSetsDropdown)
