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

export class DatasetsDropdown extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        onChange: null,
    }

    constructor() {
        super();

        this.state = {
            dataSets: [],
            selected: null,
        };
    }

    componentDidMount() {
        const d2 = this.props.d2;
        d2.models.dataSet.list({
            paging: false,
            fields: 'id,displayName',
        }).then((dataSetsResponse) => {
            this.setState({
                dataSets: dataSetsResponse.toArray(),
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    onChange = (element) => {
        const value = element.target.value;
        this.setState({
            selected: value,
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <DropDown
                value={this.state.selected}
                onChange={this.onChange}
                menuItems={this.state.dataSets}
                includeEmpty
                emptyLabel={i18n.t(i18nKeys.datasetsDropdown.hintText)}
                hintText={i18n.t(i18nKeys.datasetsDropdown.hintText)}
            />
        );
    }
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <DatasetsDropdown
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
