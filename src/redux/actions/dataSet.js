import { getDimensions, getD2 } from '../../utils/api'

export const actionTypes = {
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    LOADING_DATA_SET_OPTIONS_START: 'LOADING_DATA_SET_OPTIONS_START',
    LOADING_DATA_SET_OPTIONS_SUCCESS: 'LOADING_DATA_SET_OPTIONS_SUCCESS',
    LOADING_DATA_SET_OPTIONS_ERROR: 'LOADING_DATA_SET_OPTIONS_ERROR',
    LOADING_DIMENSIONS_START: 'LOADING_DIMENSIONS_START',
    LOADING_DIMENSIONS_SUCCESS: 'LOADING_DIMENSIONS_SUCCESS',
    LOADING_DIMENSIONS_ERROR: 'LOADING_DIMENSIONS_ERROR',
    SELECT_DIMENSION_OPTION: 'SELECT_DIMENSION_OPTION',
}

export const selectDataSet = dataSetId => ({
    type: actionTypes.SELECT_DATA_SET,
    payload: dataSetId,
})

export const loadingDataSetOptionsStart = () => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_START,
})

export const loadingDataSetOptionsSuccess = options => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS,
    payload: options,
})

export const loadingDataSetOptionsError = errorMessage => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_ERROR,
    payload: errorMessage,
})

export const loadDataSetOptions = (filter = null) => dispatch => {
    const d2 = getD2()
    const paging = false
    const fields = 'id,displayName'

    dispatch(loadingDataSetOptionsStart())
    d2.models.dataSet
        .list({ paging, fields })
        .then(response => response.toArray())
        .then(options => (filter ? options.filter(filter) : options))
        .then(options => dispatch(loadingDataSetOptionsSuccess(options)))
        .catch(({ message }) => dispatch(loadingDataSetOptionsError(message)))
}

export const loadingDimensionsStart = () => ({
    type: actionTypes.LOADING_DIMENSIONS_START,
})

export const loadingDimensionsSuccess = dimensions => ({
    type: actionTypes.LOADING_DIMENSIONS_SUCCESS,
    payload: dimensions,
})

export const loadingDimensionsError = errorMessage => ({
    type: actionTypes.LOADING_DIMENSIONS_ERROR,
    payload: errorMessage,
})

export const loadDimensions = () => (dispatch, getState) => {
    dispatch(loadingDimensionsStart())

    const { dataSet } = getState()
    getDimensions(dataSet.selected.id)
        .then(response =>
            response.error
                ? Promise.reject(response.error)
                : Promise.resolve(response.dimensions)
        )
        .then(dimensions => dispatch(loadingDimensionsSuccess(dimensions)))
        .catch(({ message }) => dispatch(loadingDimensionsError(message)))
}

export const selectDimensionOption = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION_OPTION,
    payload: { dimension, value },
})
