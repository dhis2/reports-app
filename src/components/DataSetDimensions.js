import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import { selectDimensionOption } from '../redux/actions/dataSetDimensions'
import CircularProgress from '@material-ui/core/CircularProgress'
import { formLabel } from '../utils/styles/shared.js'

const createDimensionChangeHandler = (onChange, dimensionId) => element =>
    onChange(dimensionId, element)

const DimensionDropdown = props => (
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
    <div>
        <CircularProgress size={24} thickness={3} />
        <style jsx>{`
            div {
                margin-bottom: 16px;
                text-align: center;
            }
        `}</style>
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
            <h6 className="header">{i18n.t('Data set dimensions')}</h6>
            <div className="box">
                {options.map(dimension => (
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
            <style jsx>{`
                h6 {
                    color: #757575;
                    font-size: 14px;
                    margin-bottom: 5px;
                    margin-top: 0;
                    text-align: left;
                    font-weight: normal;
                }
                div {
                    border: 1px solid #bcbcbc;
                    padding: 4px;
                    margin-bottom: 16px;
                }
            `}</style>
        </React.Fragment>
    )
}

DataSetDimensions.propTypes = {
    hide: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

DataSetDimensions.defaultProps = {
    fullWidth: true,
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
