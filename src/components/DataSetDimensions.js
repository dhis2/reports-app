import React from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@dhis2/d2-ui-core'
import AppContext from '../pages/AppContext'
import i18n from '../utils/i18n/locales'
import { i18nKeys } from '../utils/i18n/i18nKeys'
import styles from '../utils/styles'

const handleDimensionChange = (onChange, dimensionId) => element =>
    onChange(dimensionId, element)

export const DimensionDropdown = props => (
    <div key={props.dimension.id} className="data-set-dimension">
        <span style={styles.formLabel}>{props.dimension.displayName}</span>
        <DropDown
            style={props.dropdownStyle}
            fullWidth={props.fullWidth}
            value={props.values[props.dimension.id]}
            onChange={handleDimensionChange(props.onChange, props.dimension.id)}
            menuItems={props.dimension.items}
            includeEmpty
            emptyLabel={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
            hintText={i18n.t(i18nKeys.dimensionsDropdown.hintText)}
        />
    </div>
)

DimensionDropdown.propTypes = {
    dimension: PropTypes.object.isRequired,
    dropdownStyle: PropTypes.object.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DataSetDimensions = props => (
    <AppContext.Consumer>
        {appContext =>
            props.dimensions.map(dimension => (
                <DimensionDropdown
                    d2={appContext.d2}
                    key={dimension.id}
                    dimension={dimension}
                    dropdownStyle={props.dropdownStyle}
                    fullWidth={props.fullWidth}
                    values={props.values}
                    onChange={props.onChange}
                />
            ))
        }
    </AppContext.Consumer>
)

DataSetDimensions.propTypes = {
    dimensions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    dropdownStyle: PropTypes.object,
    fullWidth: PropTypes.bool,
}

DataSetDimensions.defaultProps = {
    fullWidth: true,
    dropdownStyle: {
        display: 'block',
    },
}

export default DataSetDimensions
