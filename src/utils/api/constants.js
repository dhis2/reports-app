export const STANDARD_REPORTS_ENDPOINT = 'reports'
export const REPORT_TABLES_ENDPOINT = 'reportTables'
export const DATA_SET_REPORTS_ENDPOINT = 'dataSetReport'
export const DATA_SET_DIMENSIONS_ENDPOINT = 'dimensions/dataSet'
export const DATA_SET_REPORT_INTERPOLATION_ENDPOINT =
    'interpretations/dataSetReport'
export const REPORTING_RATE_SUMMARY_ENDPOINT =
    'organisationUnits/%orgUnitId%/rateSummary'
export const RESOURCE_ENDPOINT = 'documents'
export const ORG_UNIT_DISTRIBUTION_REPORT_ENDPOINT = 'orgUnitAnalytics'

// Url creaters
export const postDataSetReportCommentUrl = (dataSetId, orgUnitId, period) =>
    `${DATA_SET_REPORT_INTERPOLATION_ENDPOINT}/${dataSetId}?pe=${period}&ou=${orgUnitId}`

export const DATA_DIMENSION_SUFFIXES = [
    'ACTUAL_REPORTS',
    'EXPECTED_REPORTS',
    'REPORTING_RATE',
    'ACTUAL_REPORTS_ON_TIME',
    'REPORTING_RATE_ON_TIME',
]
