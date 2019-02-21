// endpoint urls
export const STANDARD_REPORTS_ENDPOINT = 'reports' // eslint-disable-line import/prefer-default-export
export const DATA_SET_REPORTS_ENDPOINT = 'dataSetReport'
export const DATA_SET_DIMENSIONS_ENDPOINT = 'dimensions/dataSet'
export const DATA_SET_REPORT_INTERPOLATION_ENDPOINT =
    'interpretations/dataSetReport'
export const REPORTING_RATE_SUMMARY_ENDPOINT =
    'organisationUnits/%orgUnitId%/rateSummary'
export const RESOURCE_ENDPOINT = 'documents'

// Url creaters
export const postDataSetReportCommentUrl = (dataSetId, orgUnitId, period) =>
    `${DATA_SET_REPORT_INTERPOLATION_ENDPOINT}/${dataSetId}?pe=${period}&ou=${orgUnitId}`
