import i18n from '@dhis2/d2-i18n'
import { getOrgUnitDistReport } from '../../utils/api'
import { showSuccessSnackBar, showErrorSnackBar } from './feedback'
import {
    loadingReportDataStart,
    loadingReportDataSuccessWithFeedback,
    loadingReportDataErrorWithFeedback,
} from './reportData'

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
export const loadingChartImageUrlSuccessWithFeedback = () => dispatch => {
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

/**
 * @returns {Function}
 */
export const loadReport = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())

    const { organisationUnits, orgUnitGroupSets } = getState()
    const orgUnit = organisationUnits.selected
    const groupSetId = orgUnitGroupSets.selected

    getOrgUnitDistReport(orgUnit, groupSetId)
        .then(response =>
            dispatch(loadingReportDataSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingReportDataErrorWithFeedback(error)))
}
