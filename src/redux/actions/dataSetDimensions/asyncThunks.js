import {
    loadingDimensionsStart,
    loadingDimensionsSuccess,
    loadingDimensionsError,
} from '../dataSetDimensions'
import { getDimensions } from '../../../utils/api'

export const loadDimensions = () => (dispatch, getState) => {
    dispatch(loadingDimensionsStart())

    const { dataSet } = getState()
    return getDimensions(dataSet.selected.id)
        .then(response =>
            response.error
                ? Promise.reject(response.error)
                : Promise.resolve(response.dimensions)
        )
        .then(dimensions => dispatch(loadingDimensionsSuccess(dimensions)))
        .catch(error => dispatch(loadingDimensionsError(error)))
}
