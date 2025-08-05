import i18n from '@dhis2/d2-i18n'
import { DropDown } from '@dhis2/d2-ui-core'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { selectDimensionOption } from '../redux/actions/dataSetDimensions.js'
import { formLabel } from '../utils/styles/shared.jsx'
import styles from './DataSetDimensions.module.css'

const createDimensionChangeHandler = (onChange, dimensionId) => (element) =>
    onChange(dimensionId, element)

const DimensionDropdown = (props) => (
    <div key={props.dimension.id} className="data-set-dimension">
        <span className={formLabel.className}>
            {props.dimension.displayName}
        </span>
        <DropDown
            fullWidth={props.fullWidth}
            value={props.values[props.dimension.id]}
            onChange={props.onChange}
            menuItems={props.dimension.items}
            includeEmpty
            emptyLabel={i18n.t('Select Option')}
            hintText={i18n.t('Select Option')}
        />
        {formLabel.styles}
    </div>
)

const Loader = () => (
    <div className={styles.loaderWrapper}>
        <CircularProgress size={24} thickness={3} />
    </div>
)

DimensionDropdown.propTypes = {
    dimension: PropTypes.object.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DataSetDimensions = ({
    hide,
    isLoading,
    fullWidth,
    options,
    selected,
    onChange,
}) => {
    if (isLoading) {
        return <Loader />
    }

    if (hide || options.length === 0) {
        return null
    }

    return (
        <React.Fragment>
            <h6 className={styles.header}>{i18n.t('Data set dimensions')}</h6>
            <div className={styles.box}>
                {options.map((dimension) => (
                    <DimensionDropdown
                        key={dimension.id}
                        dimension={dimension}
                        fullWidth={fullWidth}
                        values={selected}
                        onChange={createDimensionChangeHandler(
                            onChange,
                            dimension.id
                        )}
                    />
                ))}
            </div>
        </React.Fragment>
    )
}

DataSetDimensions.propTypes = {
    fullWidth: PropTypes.bool.isRequired,
    hide: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

DataSetDimensions.defaultProps = {
    fullWidth: true,
}

const mapStateToProps = (state) => ({
    hide: !state.dataSet.selected.id,
    isLoading: state.dataSetDimensions.loading,
    options: state.dataSetDimensions.options,
    selected: state.dataSetDimensions.selected,
})

const mapDispatchToProps = (dispatch) => ({
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
