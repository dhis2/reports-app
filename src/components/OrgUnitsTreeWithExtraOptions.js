import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { toggleShowOptions } from '../redux/actions/organisationUnits.js'
import { formLabel } from '../utils/styles/shared.js'
import OrganisationUnitsTree from './AvailableOrganisationUnitsTree.js'
import { OrganisationUnitGroupSets } from './OrganisationUnitGroupSets.js'

const getExtraOptionsLabel = (showOptions) =>
    !showOptions ? i18n.t('Show more options') : i18n.t('Show fewer options')

const getExtraOptionsClassName = (showOptions) =>
    showOptions ? 'show-options' : 'hide-options'

export const __OrgUnitsTreeWithExtraOptions = (props) => (
    <React.Fragment>
        <div className={formLabel.className}>
            {i18n.t('Report organisation unit')}
        </div>
        <OrganisationUnitsTree />
        <div>
            {!props.isLoadingOptions && (
                <span
                    id="extra-options-action"
                    className="show-more-options-button"
                    role="button"
                    tabIndex="0"
                    onClick={props.toggleShowOptions}
                >
                    {getExtraOptionsLabel(props.showOptions)}
                </span>
            )}
            <div
                id="extra-options"
                className={getExtraOptionsClassName(props.showOptions)}
            >
                <OrganisationUnitGroupSets />
            </div>
        </div>
        {formLabel.styles}
        <style jsx>{`
            .hide-options {
                display: none;
            }
            .show-options {
                display: block;
            }
            .show-more-options-button {
                display: block;
                cursor: pointer;
                color: #004ba0;
                margin-top: 5;
                margin-bottom: 5;
                outline: none;
            }
        `}</style>
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
