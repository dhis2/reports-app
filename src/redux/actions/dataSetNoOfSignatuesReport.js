import { getDataSetReport } from '../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccessWithFeedback,
    loadingReportDataErrorWithFeedback,
} from './reportData'

export const actionTypes = {
    SELECT_NO_OF_SIGNATURES: 'SELECT_NO_OF_SIGNATURES',
    LOADING_NUMBER_OF_SIGNATURES: 'LOADING_NUMBER_OF_SIGNATURES',
    LOADING_NUMBER_OF_SIGNATURES_SUCCESS:
        'LOADING_NUMBER_OF_SIGNATURES_SUCCESS',
}

export const selectNoOfSignatures = noOfSignatureId => ({
    type: actionTypes.SELECT_NO_OF_SIGNATURES,
    payload: noOfSignatureId,
})

export const loadingNoOfSignaturesStart = () => ({
    type: actionTypes.LOADING_NUMBER_OF_SIGNATURES,
})

export const NoOfSignaturesSuccess = noOfSignatures => ({
    type: actionTypes.LOADING_NUMBER_OF_SIGNATURES_SUCCESS,
    payload: noOfSignatures,
})

/*export const loadReportData = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())

    const {
        dataSet,
        dataSetDimensions,
        dataSetReport,
        dataSetNoOfSignatuesReport,
        organisationUnits,
        reportPeriod,
    } = getState()

    return getDataSetReport({
        dataSet: dataSet.selected,
        dataSetDimensions: dataSetDimensions.selected,
        orgUnitGroupsOptions: organisationUnits.selectedOptions,
        orgUnit: organisationUnits.selected.id,
        period: reportPeriod.selectedPeriod,
        selectedUnitOnly: dataSetReport.selectedUnitOnly,
        dataSetNoOfSignatuesReport: dataSetNoOfSignatuesReport.noOfSignature,
    })
        .then(response =>
            dispatch(loadingReportDataSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingReportDataErrorWithFeedback(error)))
}*/

export const loadNoOfSignatures = () => (dispatch, getState) => {
    dispatch(loadingNoOfSignaturesStart())

    const { dataSetNoOfSignatuesReport } = getState()

    const formattedNoOfSignatures = [
        {
            id: 0,
            displayName: '0',
        },
        {
            id: 1,
            displayName: '1',
        },
        {
            id: 2,
            displayName: '2',
        },
        {
            id: 3,
            displayName: '3',
        },
    ]

    if (dataSetNoOfSignatuesReport.noOfSignatures.length === 0) {
        dispatch(NoOfSignaturesSuccess(formattedNoOfSignatures))
    }
}
