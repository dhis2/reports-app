import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree'
import { selectOrganisationUnit } from '../redux/actions/organisationUnits'

const defaultStyles = {
    tree: {
        border: 'solid 1px #bcbcbc',
        overflow: 'auto',
        width: '100%',
        boxSizing: 'border-box',
    },
}

export function AvailableOrganisationUnitsTree({
    selectOrganisationUnit,
    style,
    loading,
    collection,
    selected,
}) {
    if (loading) {
        return <span>{i18n.t('Updating Organisation Units Tree...')}</span>
    }

    return (
        <div style={style.tree}>
            <OrgUnitTreeMultipleRoots
                hideMemberCount
                roots={collection}
                selected={selected ? [selected.path] : []}
                initiallyExpanded={collection.map(unit => `/${unit.id}`)}
                onSelectClick={selectOrganisationUnit}
            />
        </div>
    )
}

AvailableOrganisationUnitsTree.propTypes = {
    selectOrganisationUnit: PropTypes.func.isRequired,
    style: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    selected: PropTypes.object,
}

AvailableOrganisationUnitsTree.defaultProps = {
    style: defaultStyles,
}

const mapStateToProps = ({ organisationUnits }) => ({
    loading: organisationUnits.loading,
    collection: organisationUnits.collection,
    selected: organisationUnits.selected,
})

export default connect(
    mapStateToProps,
    { selectOrganisationUnit }
)(AvailableOrganisationUnitsTree)
