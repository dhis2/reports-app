/* React */
/* i18n */
import i18n from '@dhis2/d2-i18n'
/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
/* App context */
import { formLabel } from '../utils/styles/shared.js'
import { connect } from 'react-redux'
import { selectOrgUnitOption } from '../redux/actions/organisationUnits'
import { CircularProgress } from '@material-ui/core'

const createGroupSetOnChange = (groupSetId, onChange) => groupId => {
    onChange(groupSetId, groupId)
}

const labelText = i18n.t('Select Option')

const OrganisationUnitGroupSetDropdown = ({
    groupSet,
    fullWidth,
    values,
    onChange,
}) => (
    <div key={groupSet.id}>
        <span className={formLabel.className}>{groupSet.displayName}</span>
        <DropDown
            fullWidth={fullWidth}
            value={values[groupSet.id]}
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
    groupSet: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
}

OrganisationUnitGroupSetDropdown.defaultProps = {
    fullWidth: true,
}

export const OrganisationUnitGroupSets = ({
    groupSets,
    selectGroupSet,
    isLoading,
    ...rest
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
                {...rest}
            />
        ))
    )

OrganisationUnitGroupSets.propTypes = {
    groupSets: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    selectGroupSet: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isLoading: state.orgUnitGroupSets.loading,
    groupSets: state.orgUnitGroupSets.collection,
})

export default connect(
    mapStateToProps,
    { selectGroupSet: selectOrgUnitOption }
)(OrganisationUnitGroupSets)
