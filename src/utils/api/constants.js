// endpoint urls
export const STANDARD_REPORTS_ENDPOINT = 'reports' // eslint-disable-line import/prefer-default-export
export const DATA_SET_REPORTS_ENDPOINT = 'dataSetReport'
export const DATA_SET_DIMENSIONS_ENDPOINT = 'dimensions/dataSet'
export const DATA_SET_REPORT_INTERPOLATION_ENDPOINT =
    'interpretations/dataSetReport'

// Url creaters
export const postDataSetReportCommentUrl = (dataSetId, orgUnitId, period) =>
    `${DATA_SET_REPORT_INTERPOLATION_ENDPOINT}/${dataSetId}?pe=${period}&ou=${orgUnitId}`
