import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../utils/i18n/locales'
import styles from '../../utils/styles'
import OrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree'
import OrganisationUnitGroupOptions from '../../components/organisation-unit-group-sets/OrganisationUnitGroupSets'

const getExtraOptionsLabel = showOptions =>
    i18n.t(showOptions ? 'Show more options' : 'Show few options')

const getExtraOptionsStyle = showOptions =>
    showOptions ? styles.showOptions : styles.hideOptions

export const OrgUnitsTree = props => (
    <div className="col-xs-12 col-md-6">
        <div style={styles.formLabel}>{i18n.t('Report organisation unit')}</div>
        <OrganisationUnitsTree onChange={props.onOrgUnitChange} />
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
                    values={props.selectedOptionsForOrganisationUnitGroupSets}
                    onChange={props.onOrganisationUnitGroupSetChange}
                />
            </div>
        </div>
    </div>
)

OrgUnitsTree.propTypes = {
    showOptions: PropTypes.bool.isRequired,
    selectedOptionsForOrganisationUnitGroupSets: PropTypes.object.isRequired,
    onOrgUnitChange: PropTypes.func.isRequired,
    toggleShowOptions: PropTypes.func.isRequired,
    onOrganisationUnitGroupSetChange: PropTypes.func.isRequired,
}
