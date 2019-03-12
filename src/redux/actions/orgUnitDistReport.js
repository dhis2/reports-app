import { getOrgUnitDistReport } from '../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccessWithFeedback,
    loadingReportDataErrorWithFeedback,
} from './reportData'

export const actionTypes = {
    SET_TABULAR_OUTPUT: 'SET_TABULAR_OUTPUT',
    SET_CHART_OUTPUT: 'SET_CHART_OUTPUT',
}
/**
 * @returns {Object}
 */
export const setOutputToChart = () => ({
    type: actionTypes.SET_CHART_OUTPUT,
})

/**
 * @returns {Object}
 */
export const setOutputToTabular = () => ({
    type: actionTypes.SET_TABULAR_OUTPUT,
})

/**
 * @returns {Function}
 */
export const loadChart = () => dispatch => {
    dispatch(setOutputToChart())
    dispatch(loadReport())
}

/**
 * @returns {Function}
 */
export const loadTable = () => dispatch => {
    dispatch(setOutputToTabular())
    dispatch(loadReport())
}

/**
 * @returns {Function}
 */
export const loadReport = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())

    const {
        organisationUnits,
        orgUnitGroupSets,
        orgUnitDistReport: { shouldShowChart },
    } = getState()
    const orgUnit = organisationUnits.selected
    const groupSetId = orgUnitGroupSets.selected

    return getOrgUnitDistReport(orgUnit, groupSetId)
        .then(response =>
            dispatch(
                loadingReportDataSuccessWithFeedback(response, shouldShowChart)
            )
        )
        .catch(error => dispatch(loadingReportDataErrorWithFeedback(error)))
}
