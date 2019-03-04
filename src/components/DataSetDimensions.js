import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import { selectDimensionOption } from '../redux/actions/dataSetDimensions'

const createDimensionChangeHandler = (onChange, dimensionId) => element =>
    onChange(dimensionId, element)

const DimensionDropdown = props => (
    <div key={props.dimension.id} className="data-set-dimension">
        <span style={styles.formLabel}>{props.dimension.displayName}</span>
        <DropDown
            style={props.dropdownStyle}
            fullWidth={props.fullWidth}
            value={props.values[props.dimension.id]}
            onChange={props.onChange}
            menuItems={props.dimension.items}
            includeEmpty
            emptyLabel={i18n.t('Select Option')}
            hintText={i18n.t('Select Option')}
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
    <React.Fragment>
        {props.options.map(dimension => (
            <DimensionDropdown
                key={dimension.id}
                dimension={dimension}
                dropdownStyle={props.dropdownStyle}
                fullWidth={props.fullWidth}
                values={props.selected}
                onChange={createDimensionChangeHandler(
                    props.onChange,
                    dimension.id
                )}
            />
        ))}
    </React.Fragment>
)

DataSetDimensions.propTypes = {
    options: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dropdownStyle: PropTypes.object,
    fullWidth: PropTypes.bool,
}

DataSetDimensions.defaultProps = {
    fullWidth: true,
    dropdownStyle: {
        display: 'block',
    },
}

const mapStateToProps = ({ dataSetDimensions }) => ({
    options: dataSetDimensions.options,
    selected: dataSetDimensions.selected,
})

const mapDispatchToProps = dispatch => ({
    onChange: (id, evt) =>
        dispatch(selectDimensionOption(id, evt.target.value)),
})

const ConnectedDataSetDimensions = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataSetDimensions)

export {
    DataSetDimensions as OriginalComponent,
    ConnectedDataSetDimensions as DataSetDimensions,
}
