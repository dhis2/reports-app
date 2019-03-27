import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree'
import { selectOrganisationUnit } from '../redux/actions/organisationUnits'

export function AvailableOrganisationUnitsTree({
    selectOrganisationUnit,
    loading,
    collection,
    selected,
}) {
    if (loading) {
        return <span>{i18n.t('Updating Organisation Units Tree...')}</span>
    }

    return (
        <div className="org-unit-tree-wrapper">
            <OrgUnitTreeMultipleRoots
                hideMemberCount
                roots={collection}
                selected={selected ? [selected.path] : []}
                initiallyExpanded={collection.map(unit => `/${unit.id}`)}
                onSelectClick={selectOrganisationUnit}
            />
            <style jsx>{`
                div {
                    border: 1px solid #bcbcbc;
                    overflow: auto;
                    width: 100%;
                    box-sizing: border-box;
                    font-weight: 300;
                }
            `}</style>
        </div>
    )
}

AvailableOrganisationUnitsTree.propTypes = {
    selectOrganisationUnit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    selected: PropTypes.object,
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
