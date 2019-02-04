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
import styles from '../../styles';

export class DatasetsDropdown extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        label: PropTypes.string,
        fullWidth: PropTypes.bool,
        fields: PropTypes.string,
        filter: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => {},
        label: i18n.t(i18nKeys.datasetsDropdown.dataSetLabel),
        fullWidth: true,
        fields: 'id,displayName',
        filter: null,
    }

    constructor() {
        super();

        this.state = {
            dataSets: [],
            selected: null,
        };
    }

    componentDidMount() {
        const { d2, filter, fields } = this.props;
        d2.models.dataSet.list({
            paging: false,
            fields,
        }).then((dataSetsResponse) => {
            const dataSets = dataSetsResponse.toArray();
            this.setState({
                dataSets: filter ? dataSets.filter(filter) : dataSets,
            });
        }).catch(() => {
            // TODO Manage error
        });
    }

    onChange = (event) => {
        const dataSetId = event.target.value;
        this.setState({
            selected: dataSetId,
        });

        const dataSet = this.state.dataSets.find(currentDataSet => currentDataSet.id === dataSetId);
        if (this.props.onChange) {
            this.props.onChange(dataSet);
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
                    menuItems={this.state.dataSets}
                    includeEmpty
                    emptyLabel={i18n.t(i18nKeys.datasetsDropdown.hintText)}
                    hintText={i18n.t(i18nKeys.datasetsDropdown.hintText)}
                />
            </div>
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
