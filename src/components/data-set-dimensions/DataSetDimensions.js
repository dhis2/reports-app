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

/* styles */
import styles from '../../styles';

export class DataSetDimensions extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
        dataSetId: PropTypes.string.isRequired,
        dropdownStyle: PropTypes.object,
        fullWidth: PropTypes.bool,
    }

    static defaultProps = {
        fullWidth: true,
        dropdownStyle: {
            display: 'block',
        },
    }

    constructor() {
        super();

        this.state = {
            dimensions: [],
        };
    }

    componentDidMount() {
        this.fetchDataDimensions(this.props.dataSetId);
    }

    componentWillReceiveProps({ dataSetId }) {
        if (this.props.dataSetId !== dataSetId) {
            this.fetchDataDimensions(dataSetId);
        }
    }

    fetchDataDimensions = (dataSetId) => {
        const api = this.props.d2.Api.getApi();
        const url =
            `dimensions/dataSet/${dataSetId}?fields=id,displayName,items[id,displayName]&order=name:asc&paging=false`;
        api.get(url).then((response) => {
            const dimensions = response.dimensions || [];
            this.setState({
                dimensions,
            });
        }).catch(() => {
            this.setState({
                dimensions: [],
            });
        });
    }

    handleDimensionChange = dimensionId => (element) => {
        this.props.onChange(dimensionId, element);
    }

    renderDimensionDropdown = dimension => (
        <div key={dimension.id}>
            <span style={styles.formLabel}>{dimension.displayName}</span>
            <DropDown
                style={this.props.dropdownStyle}
                fullWidth={this.props.fullWidth}
                value={this.props.values[dimension.id]}
                onChange={this.handleDimensionChange(dimension.id)}
                menuItems={dimension.items}
                includeEmpty
                emptyLabel={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
                hintText={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
            />
        </div>
    );

    render = () => (
        this.state.dimensions.map(
            dimension => this.renderDimensionDropdown(dimension),
        )
    );
}

export default props => (
    <AppContext.Consumer>
        { appContext => (
            <DataSetDimensions
                d2={appContext.d2}
                {...props}
            />
        )}
    </AppContext.Consumer>
);

