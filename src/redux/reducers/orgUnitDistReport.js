import { actionTypes } from '../actions/orgUnitDistReport'
import { actionTypes as reportDataActionTypes } from '../actions/reportData'

export const defaultState = {
    displayImage: false,
    chartImagelLoading: false,
}

export const orgUnitDistReport = (state = defaultState, { type } = {}) => {
    switch (type) {
        case actionTypes.CHART_IMAGE_URL_LOADING_START:
            return {
                ...state,
                displayImage: true,
                chartImageLoading: true,
            }

        case actionTypes.CHART_IMAGE_URL_LOADING_SUCCESS:
            return {
                ...state,
                chartImageLoading: false,
            }

        case actionTypes.CHART_IMAGE_URL_LOADING_ERROR:
            return {
                ...state,
                displayImage: false,
                chartImageLoading: false,
            }

        case reportDataActionTypes.LOADING_REPORT_DATA_START:
            return {
                ...state,
                displayImage: false,
            }

        default:
            return state
    }
}
