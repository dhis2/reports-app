/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'

/* d2-ui components */
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree'

/* actions */
import loadOrganisationUnits from '../../redux/actions/organisationUnits'

/* styles */
import styles from '../../utils/styles'

/* styles */
const defaultStyles = {
    tree: {
        border: 'solid 1px #bcbcbc',
        overflow: 'auto',
        width: '100%',
    },
}

export class AvailableOrganisationUnitsTree extends PureComponent {
    state = {
        selected: [],
    }

    componentDidMount() {
        if (!this.props.organisationUnits.ready) {
            this.props.loadOrganisationUnits()
        }
    }

    handleOrgUnitClick = (event, orgUnit) => {
        if (!this.state.selected.includes(orgUnit.path)) {
            this.setState({ selected: [orgUnit.path] })
            this.props.onChange(orgUnit.id)
        }
    }

    render() {
        const { organisationUnits } = this.props
        console.log(organisationUnits.collection)

        if (!organisationUnits.ready) {
            return <span>{i18n.t('Updating Organisation Units Tree...')}</span>
        }

        if (organisationUnits.loadingError) {
            return (
                <span style={styles.error}>
                    {organisationUnits.loadingError}
                </span>
            )
        }

        console.log('error now?')

        return (
            <div style={this.props.style.tree}>
                <OrgUnitTreeMultipleRoots
                    hideMemberCount
                    roots={organisationUnits.collection}
                    selected={this.state.selected}
                    initiallyExpanded={organisationUnits.collection.map(
                        unit => `/${unit.id}`
                    )}
                    // onSelectClick={this.handleOrgUnitClick}
                />
            </div>
        )
    }
}

AvailableOrganisationUnitsTree.propTypes = {
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    organisationUnits: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    loadOrganisationUnits: PropTypes.func.isRequired,
}

AvailableOrganisationUnitsTree.defaultProps = {
    onChange: null,
    style: defaultStyles,
}

const mapStateToProps = ({ organisationUnits }) => ({ organisationUnits })

export default connect(
    mapStateToProps,
    {
        loadOrganisationUnits,
    }
)(AvailableOrganisationUnitsTree)
