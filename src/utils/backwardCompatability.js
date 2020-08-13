import { getSystemMinorVersion } from './api'

/*
The following API changes were introduced in v2.34:

1. The `api/reportTables` endpoint was replaced by `api/visualizations`

2. The response payload from this endpoint now looks slightly different:
    
    < 2.34
    "reportParams": {
        "paramGrandParentOrganisationUnit": false,
        "paramReportingPeriod": false,
        "paramOrganisationUnit": false,
        "paramParentOrganisationUnit": false
    }

    >= 2.34
    "reportingParams": {
        "grandParentOrganisationUnit": false,
        "reportingPeriod": false,
        "organisationUnit": false,
        "parentOrganisationUnit": false
    }

3. From >= 2.34 onward we have to deal with some inconsistencies in the property names:
    - `report.reportParams`
    - `report.visualization.reportingParams`

The functions in this module are there to deal with these discrepancies. To avoid too many changes to the app state model, the following names have been settled on:
1. `reportTables` in favour of `visualizations`
2. `reportParams` in favour of `reportingParams`
3. don't prefix reportParams properties with `param`, 
   i.e. `reportingPeriod` in favour of `paramReportingPeriod`


When we drop support for version v2.33 these helpers can be removed and replaced
with much more simple and sane logic
*/

const isBelowVersion34 = () => getSystemMinorVersion() < 34

const getReportTableNameForSystemVersion = () =>
    isBelowVersion34() ? 'reportTable' : 'visualization'

const getReportParamsFieldName = () =>
    isBelowVersion34() ? 'reportParams' : 'reportingParams'

export const getReportTablesResourceNameForSystemVersion = () =>
    `${getReportTableNameForSystemVersion()}s`

/**
 * Required fields for displaying the standard reports
 */
export const getStandardReportsFieldsForSystemVersion = () => {
    const reportTableFieldName = getReportTableNameForSystemVersion()
    const reportParamsFieldName = getReportParamsFieldName()

    return [
        'displayName',
        'type',
        'id',
        `${reportTableFieldName}[id,displayName,${reportParamsFieldName},relativePeriods]`,
        'reportParams',
        'relativePeriods',
        'access',
    ]
}

const getReportParamsPropertiesForSystemVersion = reportParams => {
    if (!isBelowVersion34()) {
        return reportParams
    }

    return {
        reportingPeriod: reportParams.paramReportingPeriod,
        grandParentOrganisationUnit:
            reportParams.paramGrandParentOrganisationUnit,
        organisationUnit: reportParams.paramOrganisationUnit,
        parentOrganisationUnit: reportParams.paramParentOrganisationUnit,
    }
}

export const formatStandardReportResponseForSystemVersion = reportModel => {
    // The JSON representation of a reportModel is missing
    // some of the reportTable properties such as reportParams
    const reportJson = reportModel.toJSON()
    // <2.34 reportModel.reportTable, >=2.34 reportmodel.visualization
    const reportTable = reportModel[getReportTableNameForSystemVersion()]
    // <2.34 reportModel.reportTable.reportParams, =2.34 reportmodel.visualization.reportingParams
    const reportTableReportParams =
        reportTable && reportTable[getReportParamsFieldName()]

    return {
        ...reportJson,
        reportParams: getReportParamsPropertiesForSystemVersion(
            reportJson.reportParams
        ),
        reportTable: {
            ...reportTable,
            reportParams: getReportParamsPropertiesForSystemVersion(
                reportTableReportParams
            ),
        },
    }
}

export const formatStandardReportPayloadForSystemVersion = report => {
    if (!isBelowVersion34()) {
        return report
    }

    return {
        ...report,
        reportParams: {
            paramGrandParentOrganisationUnit:
                report.grandParentOrganisationUnit,
            paramOrganisationUnit: report.organisationUnit,
            paramParentOrganisationUnit: report.parentOrganisationUnit,
            paramReportingPeriod: report.reportingPeriod,
        },
    }
}
