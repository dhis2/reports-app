/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/* d2-ui components */
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree'

/* App context */
import AppContext from '../../pages/AppContext'

/* i18n */
import i18n from '../../utils/i18n/locales'
import { i18nKeys } from '../../utils/i18n/i18nKeys'

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
        rootsWithMembers: null,
    }

    componentDidMount() {
        if (this.state.rootWithMember == null) {
            this.props.d2.models.organisationUnits
                .list({
                    paging: false,
                    level: 1,
                    fields:
                        'id,displayName,path,children::isNotEmpty,memberCount',
                })
                .then(organisationUnitsResponse => {
                    this.setState({
                        rootsWithMembers: organisationUnitsResponse.toArray(),
                    })
                })
                .catch(() => {
                    // TODO manage error
                })
        }
    }

    handleOrgUnitClick = (event, orgUnit) => {
        if (!this.state.selected.includes(orgUnit.path)) {
            this.setState({ selected: [orgUnit.path] })
            if (this.props.onChange) {
                const selectedOrganisationUnitSplitted = orgUnit.path.split('/')
                const selectedOrganisationUnitId =
                    selectedOrganisationUnitSplitted[
                        selectedOrganisationUnitSplitted.length - 1
                    ]
                this.props.onChange(selectedOrganisationUnitId)
            }
        }
    }

    render() {
        const { rootsWithMembers, selected } = this.state
        if (rootsWithMembers) {
            return (
                <div style={this.props.style.tree}>
                    <OrgUnitTreeMultipleRoots
                        hideMemberCount
                        roots={rootsWithMembers}
                        selected={selected}
                        initiallyExpanded={rootsWithMembers.map(
                            ({ id }) => `/${id}`
                        )}
                        onSelectClick={this.handleOrgUnitClick}
                    />
                </div>
            )
        }

        return (
            <span>
                {i18n.t(
                    i18nKeys.availableOrganisationUnitsTree.updatingMessage
                )}
            </span>
        )
    }
}

AvailableOrganisationUnitsTree.propTypes = {
    d2: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    style: PropTypes.object,
}

AvailableOrganisationUnitsTree.defaultProps = {
    onChange: null,
    style: defaultStyles,
}

export default props => (
    <AppContext.Consumer>
        {appContext => (
            <AvailableOrganisationUnitsTree d2={appContext.d2} {...props} />
        )}
    </AppContext.Consumer>
)
