import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { toggleShowOptions } from '../redux/actions/organisationUnits.js'
import { formLabel } from '../utils/styles/shared.jsx'
import OrganisationUnitsTree from './AvailableOrganisationUnitsTree.jsx'
import { OrganisationUnitGroupSets } from './OrganisationUnitGroupSets.jsx'
import styles from './OrgUnitsTreeWithExtraOptions.module.css'

const getExtraOptionsLabel = (showOptions) =>
    !showOptions ? i18n.t('Show more options') : i18n.t('Show fewer options')

const getExtraOptionsClassName = (showOptions) =>
    showOptions ? styles.showOptions : styles.hideOptions

export const __OrgUnitsTreeWithExtraOptions = (props) => (
    <React.Fragment>
        <div className={formLabel.className}>
            {i18n.t('Report organisation unit')}
        </div>
        <OrganisationUnitsTree />
        <div>
            {!props.isLoadingOptions && (
                <button
                    id="extra-options-action"
                    className={styles.showMoreOptionsButton}
                    type="button"
                    onClick={props.toggleShowOptions}
                >
                    {getExtraOptionsLabel(props.showOptions)}
                </button>
            )}

            <div
                id="extra-options"
                className={getExtraOptionsClassName(props.showOptions)}
            >
                <OrganisationUnitGroupSets />
            </div>
        </div>
        {formLabel.styles}
    </React.Fragment>
)

__OrgUnitsTreeWithExtraOptions.propTypes = {
    isLoadingOptions: PropTypes.bool.isRequired,
    showOptions: PropTypes.bool.isRequired,
    toggleShowOptions: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    showOptions: state.organisationUnits.showOptions,
    isLoadingOptions: state.orgUnitGroupSets.loading,
})

export const OrgUnitsTreeWithExtraOptions = connect(mapStateToProps, {
    toggleShowOptions,
})(__OrgUnitsTreeWithExtraOptions)
