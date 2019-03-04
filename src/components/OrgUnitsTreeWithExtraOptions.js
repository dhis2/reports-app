import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import OrganisationUnitsTree from './AvailableOrganisationUnitsTree'
import OrganisationUnitGroupOptions from './OrganisationUnitGroupSets'
import {
    toggleShowOptions,
    selectOrgUnitOption,
} from '../redux/actions/organisationUnits'

const getExtraOptionsLabel = showOptions =>
    i18n.t(!showOptions ? 'Show more options' : 'Show few options')

const getExtraOptionsStyle = showOptions =>
    showOptions ? styles.showOptions : styles.hideOptions

export const OrgUnitsTreeWithExtraOptions = props => (
    <React.Fragment>
        <div style={styles.formLabel}>{i18n.t('Report organisation unit')}</div>
        <OrganisationUnitsTree />
        <div>
            <span
                id="extra-options-action"
                style={styles.showMoreOptionsButton}
                role="button"
                tabIndex="0"
                onClick={props.toggleShowOptions}
            >
                {getExtraOptionsLabel(props.showOptions)}
            </span>
            <div
                id="extra-options"
                style={getExtraOptionsStyle(props.showOptions)}
            >
                <OrganisationUnitGroupOptions
                    values={props.selectedOrgUnitOptions}
                    onChange={props.onOrganisationUnitGroupSetChange}
                />
            </div>
        </div>
    </React.Fragment>
)

OrgUnitsTreeWithExtraOptions.propTypes = {
    showOptions: PropTypes.bool.isRequired,
    selectedOrgUnitOptions: PropTypes.object.isRequired,
    toggleShowOptions: PropTypes.func.isRequired,
    onOrganisationUnitGroupSetChange: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    showOptions: state.organisationUnits.showOptions,
    selectedOrgUnitOptions: state.organisationUnits.selectedOptions,
})

const mapDispatchToProps = dispatch => ({
    toggleShowOptions: () => dispatch(toggleShowOptions()),
    onOrganisationUnitGroupSetChange: (id, event) =>
        dispatch(selectOrgUnitOption(id, event.target.value)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrgUnitsTreeWithExtraOptions)
