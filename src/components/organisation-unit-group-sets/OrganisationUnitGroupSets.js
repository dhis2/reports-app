/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../context';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export class OrganisationUnitGroupSets extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
        dropdownStyle: PropTypes.object,
    }

    static defaultProps = {
        dropdownStyle: {
            display: 'block',
        },
    }

    constructor() {
        super();

        this.state = {
            organisationUnitGroupSets: [],
        };
    }

    componentDidMount() {
        const api = this.props.d2.Api.getApi();
        const url = 'organisationUnitGroupSets?' +
            'fields=id,displayName,organisationUnitGroups[id,displayName]&order=name:asc&paging=false';
        api.get(url).then((response) => {
            const organisationUnitGroupSets = response.organisationUnitGroupSets || [];
            this.setState({
                organisationUnitGroupSets,
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    handleOrganisationUnitGroupSetChange = organisationUnitGroupSetId => (element) => {
        this.props.onChange(organisationUnitGroupSetId, element);
    }

    renderOrganisationUnitGroupSetDropdown = organisationUnitGroupSet => (
        <div key={organisationUnitGroupSet.id}>
            <span>{organisationUnitGroupSet.displayName}</span>
            <DropDown
                style={this.props.dropdownStyle}
                value={this.props.values[organisationUnitGroupSet.id]}
                onChange={this.handleOrganisationUnitGroupSetChange(organisationUnitGroupSet.id)}
                menuItems={organisationUnitGroupSet.organisationUnitGroups}
                includeEmpty
                emptyLabel={i18n.t(i18nKeys.organisationUnitGroupSetDropdown.hintText)}
                hintText={i18n.t(i18nKeys.organisationUnitGroupSetDropdown.hintText)}
            />
        </div>
    );

    render = () => (
        this.state.organisationUnitGroupSets.map(
            organisationUnitGroupSet => this.renderOrganisationUnitGroupSetDropdown(organisationUnitGroupSet),
        )
    );
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <OrganisationUnitGroupSets
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
