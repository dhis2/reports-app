import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import styles from '../utils/styles'
import { selectDimensionOption } from '../redux/actions/dataSetDimensions'
import { CircularProgress } from 'material-ui'

const loaderStyle = {
    marginBottom: 16,
}

const headerStyle = {
    color: '#757575',
    fontSize: '14px',
    marginBottom: 5,
    marginTop: 0,
    textAlign: 'left',
    fontWeight: 'normal',
}

const boxStyle = {
    border: '1px solid #bcbcbc',
    padding: 4,
    marginBottom: 16,
}

const noResultsStyle = {
    marginBottom: 16,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#757575',
}

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

const DataDimensionsContent = props => {
    if (props.isLoading) {
        return (
            <div style={loaderStyle}>
                <CircularProgress size={16} thickness={2} />
            </div>
        )
    }

    if (props.options.length === 0) {
        return (
            <div style={noResultsStyle}>
                {i18n.t('No dimensions connected to the current data set')}
            </div>
        )
    }

    return (
        <div style={boxStyle}>
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
        </div>
    )
}

DataDimensionsContent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    dropdownStyle: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DataSetDimensions = ({ hide, ...contentProps }) => {
    if (hide) {
        return null
    }

    return (
        <React.Fragment>
            <h6 style={headerStyle}>{i18n.t('Data set dimensions')}</h6>
            <DataDimensionsContent {...contentProps} />
        </React.Fragment>
    )
}

DataSetDimensions.propTypes = {
    hide: PropTypes.bool.isRequired,
}

DataSetDimensions.defaultProps = {
    fullWidth: true,
    dropdownStyle: {
        display: 'block',
    },
}

const mapStateToProps = state => ({
    hide: !state.dataSet.selected.id,
    isLoading: state.dataSetDimensions.loading,
    options: state.dataSetDimensions.options,
    selected: state.dataSetDimensions.selected,
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
