/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

class DataSetDimensions extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        values: PropTypes.object.isRequired,
        dimensions: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                displayName: PropTypes.string.isRequired,
                items: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        displayName: PropTypes.string.isRequired,
                    }),
                ).isRequired,
            }),
        ).isRequired,
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
            dimensions: [],
        };
    }

    handleDimensionChange = dimensionId => (element) => {
        this.props.onChange(dimensionId, element);
    }

    renderDimensionDropdown = dimension => (
        <div key={dimension.id}>
            <span>{dimension.displayName}</span>
            <DropDown
                style={this.props.dropdownStyle}
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
        this.props.dimensions.map(
            dimension => this.renderDimensionDropdown(dimension),
        )
    );
}

export default DataSetDimensions;
