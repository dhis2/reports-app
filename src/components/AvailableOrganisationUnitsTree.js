/* React */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'

/* d2-ui components */
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree'

/* actions */
import { selectOrganisationUnit } from '../redux/actions/organisationUnits'

/* styles */
import styles from '../utils/styles'

/* styles */
const defaultStyles = {
    tree: {
        border: 'solid 1px #bcbcbc',
        overflow: 'auto',
        width: '100%',
    },
}

export function AvailableOrganisationUnitsTree({
    selectOrganisationUnit,
    style,
    ready,
    loadingError,
    collection,
    selected,
}) {
    if (!ready) {
        return <span>{i18n.t('Updating Organisation Units Tree...')}</span>
    }

    if (loadingError) {
        return <span style={styles.error}>{loadingError}</span>
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
    ready: PropTypes.bool.isRequired,
    loadingError: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selected: PropTypes.object,
}

AvailableOrganisationUnitsTree.defaultProps = {
    style: defaultStyles,
}

const mapStateToProps = ({ organisationUnits }) => ({
    ready: organisationUnits.ready,
    loadingError: organisationUnits.loadingError,
    collection: organisationUnits.collection,
    selected: organisationUnits.selected,
})

export default connect(
    mapStateToProps,
    { selectOrganisationUnit }
)(AvailableOrganisationUnitsTree)
