import { selectDataSet as selectDataSetOriginal } from './dataSet'
import { loadDimensions } from './dataSetDimensions'
import {
    loadHtmlReport,
    shareDataSetReportComment,
} from './dataSetReport/asyncThunks'

export const actionTypes = {
    SHOW_DATA_SET_REPORT_FORM: 'SHOW_DATA_SET_REPORT_FORM',
    TOGGLE_SELECTED_UNIT_ONLY: 'TOGGLE_SELECTED_UNIT_ONLY',
}

export const selectDataSet = dataSetId => (dispatch, getState) => {
    dispatch(selectDataSetOriginal(dataSetId))

    const { dataSet } = getState()
    dispatch(loadDimensions(dataSet.selected.id))
}

export const toggleSelectedUnitOnly = selectedUnitOnly => ({
    type: actionTypes.TOGGLE_SELECTED_UNIT_ONLY,
    payload: selectedUnitOnly,
})

export { loadHtmlReport, shareDataSetReportComment }
