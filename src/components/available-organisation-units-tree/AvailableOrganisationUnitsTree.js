/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';

/* App context */
import AppContext from '../../pages/AppContext';

/* i18n */
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';

/* styles */
const defaultStyles = {
    tree: {
        border: 'solid 1px #bcbcbc',
        overflow: 'auto',
        width: '100%',
    },
};

export class AvailableOrganisationUnitsTree extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        style: PropTypes.object,
    }

    static defaultProps = {
        onChange: null,
        style: defaultStyles,
    }

    constructor() {
        super();

        this.state = {
            selected: [],
            rootWithMember: null,
        };
    }

    componentDidMount() {
        if (this.state.rootWithMember == null) {
            this.props.d2.models.organisationUnits.list({
                paging: false,
                level: 1,
                fields: 'id,displayName,path,children::isNotEmpty,memberCount',
            }).then((organisationUnitsResponse) => {
                const organisationUnits = organisationUnitsResponse.toArray();
                this.setState({
                    rootWithMembers: organisationUnits[0],
                });
            }).catch(() => {
                // TODO manage error
            });
        }
    }

    handleOrgUnitClick = (event, orgUnit) => {
        if (!this.state.selected.includes(orgUnit.path)) {
            this.setState({ selected: [orgUnit.path] });
            if (this.props.onChange) {
                const selectedOrganisationUnitSplitted = orgUnit.path.split('/');
                const selectedOrganisationUnitId =
                    selectedOrganisationUnitSplitted[selectedOrganisationUnitSplitted.length - 1];
                this.props.onChange(selectedOrganisationUnitId);
            }
        }
    }

    render() {
        if (this.state.rootWithMembers) {
            return (
                <div style={this.props.style.tree}>
                    <OrgUnitTree
                        hideMemberCount
                        root={this.state.rootWithMembers}
                        selected={this.state.selected}
                        initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                        onSelectClick={this.handleOrgUnitClick}
                    />
                </div>
            );
        }

        return <span>{i18n.t(i18nKeys.availableOrganisationUnitsTree.updatingMessage)}</span>;
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <AvailableOrganisationUnitsTree
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
