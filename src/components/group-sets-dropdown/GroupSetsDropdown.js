/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core';

/* App context */
import AppContext from '../../pages/AppContext';

/* i18n */
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';

/* styles */
import styles from '../../utils/styles';

export class GroupSetsDropdown extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        label: PropTypes.string,
        fullWidth: PropTypes.bool,
    }

    static defaultProps = {
        onChange: () => {},
        label: i18n.t(i18nKeys.groupSetsDropdown.label),
        fullWidth: true,
    }

    constructor() {
        super();

        this.state = {
            groupSets: [],
            selected: null,
        };
    }

    componentDidMount() {
        const d2 = this.props.d2;
        d2.models.organisationUnitGroupSet.list({
            paging: false,
            fields: 'id,displayName',
        }).then((groupSetsResponse) => {
            this.setState({
                groupSets: groupSetsResponse.toArray(),
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    onChange = (event) => {
        const value = event.target.value;
        this.setState({
            selected: value,
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <div>
                <span style={styles.formLabel}>{this.props.label}</span>
                <DropDown
                    fullWidth={this.props.fullWidth}
                    value={this.state.selected}
                    onChange={this.onChange}
                    menuItems={this.state.groupSets}
                    includeEmpty
                    emptyLabel={i18n.t(i18nKeys.groupSetsDropdown.hintText)}
                    hintText={i18n.t(i18nKeys.groupSetsDropdown.hintText)}
                />
            </div>
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <GroupSetsDropdown
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
