/* React */
/* i18n */
import i18n from '@dhis2/d2-i18n'
/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React from 'react'
/* App context */
import { connect } from 'react-redux'
import { selectOrgUnitOption } from '../redux/actions/organisationUnits'
import { formLabel } from '../utils/styles/shared.js'

const createGroupSetOnChange = (groupSetId, onChange) => event => {
    onChange(groupSetId, event.target.value)
}

const labelText = i18n.t('Select Option')

const OrganisationUnitGroupSetDropdown = ({
    groupSet,
    fullWidth,
    value,
    onChange,
}) => (
    <div key={groupSet.id}>
        <span className={formLabel.className}>{groupSet.displayName}</span>
        <DropDown
            fullWidth={fullWidth}
            value={value}
            onChange={onChange}
            menuItems={groupSet.organisationUnitGroups}
            includeEmpty
            emptyLabel={labelText}
            hintText={labelText}
        />
        {formLabel.styles}
    </div>
)

OrganisationUnitGroupSetDropdown.propTypes = {
    fullWidth: PropTypes.bool.isRequired,
    groupSet: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
}

OrganisationUnitGroupSetDropdown.defaultProps = {
    value: '',
}

export const OrganisationUnitGroupSets = ({
    groupSets,
    isLoading,
    selectGroupSet,
    values,
    fullWidth,
}) =>
    isLoading ? (
        <div>
            <CircularProgress size={24} thickness={3} />
            <style jsx>{`
                div {
                    padding-top: 16px;
                    text-align: center;
                }
            `}</style>
        </div>
    ) : (
        groupSets.map(groupSet => (
            <OrganisationUnitGroupSetDropdown
                groupSet={groupSet}
                key={groupSet.id}
                onChange={createGroupSetOnChange(groupSet.id, selectGroupSet)}
                value={values[groupSet.id]}
                fullWidth={fullWidth}
            />
        ))
    )

OrganisationUnitGroupSets.propTypes = {
    groupSets: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    selectGroupSet: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    fullWidth: PropTypes.bool,
}

OrganisationUnitGroupSets.defaultProps = {
    fullWidth: true,
}

const mapStateToProps = state => ({
    isLoading: state.orgUnitGroupSets.loading,
    groupSets: state.orgUnitGroupSets.collection,
    values: state.organisationUnits.selectedOptions,
})

export default connect(mapStateToProps, {
    selectGroupSet: selectOrgUnitOption,
})(OrganisationUnitGroupSets)
