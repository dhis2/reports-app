import i18n from '../../utils/i18n/locales'
import { showSuccessSnackBar, showErrorSnackBar } from './feedback'

export const actionTypes = {
    CHART_IMAGE_URL_LOADING_START: 'LOADING_CHART_IMAGE_URL_START',
    CHART_IMAGE_URL_LOADING_SUCCESS: 'LOADING_CHART_IMAGE_URL_SUCCESS',
    CHART_IMAGE_URL_LOADING_ERROR: 'LOADING_CHART_IMAGE_URL_ERROR',
}

/**
 * @returns {Object}
 */
export const loadingChartImageUrlStart = () => ({
    type: actionTypes.CHART_IMAGE_URL_LOADING_START,
})

/**
 * @param {string} chartImageUrl
 * @returns {Object}
 */
export const loadingChartImageUrlSuccess = () => ({
    type: actionTypes.CHART_IMAGE_URL_LOADING_SUCCESS,
})

/**
 * @returns {Object}
 */
export const loadingChartImageUrlError = () => ({
    type: actionTypes.CHART_IMAGE_URL_LOADING_ERROR,
})

/**
 * @returns {Function}
 */
export const loadingReportDataSuccessWithFeedback = () => dispatch => {
    const successMessage = i18n.t('Chart generated')
    dispatch(showSuccessSnackBar(successMessage))
    dispatch(loadingChartImageUrlSuccess())
}

/**
 * @returns {Function}
 */
export const loadingChartImageUrlErrorWithFeedback = () => dispatch => {
    const errorMessage = i18n.t('An error occurred while loading the chart!')
    dispatch(showErrorSnackBar(errorMessage))
    dispatch(loadingChartImageUrlError())
}
