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
const isAtLeastVersion34 = () => !isBelowVersion34()

const getReportTableNameBySystemVersion = () =>
    isBelowVersion34() ? 'reportTable' : 'visualization'

const getReportParamsFieldName = () =>
    isBelowVersion34() ? 'reportParams' : 'reportingParams'

export const getReportTablesResourceNameBySystemVersion = () =>
    `${getReportTableNameBySystemVersion()}s`

export const getReportTablesFilterBySystemVersion = searchTerm =>
    isAtLeastVersion34()
        ? [`identifiable:token:${searchTerm}`, 'type:eq:PIVOT_TABLE']
        : [`name:ilike:${searchTerm}`]

/**
 * Required fields for displaying the standard reports
 */
export const getStandardReportsFieldsBySystemVersion = () => {
    const reportTableFieldName = getReportTableNameBySystemVersion()
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

const getReportParamsPropertiesBySystemVersion = reportParams => {
    if (isAtLeastVersion34() || !reportParams) {
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

export const getStandardReportFieldsBySystemVersion = () => {
    const reportTableField = isAtLeastVersion34()
        ? 'visualization[id,displayName]'
        : 'reportTable[id,displayName]'

    return [':owner', reportTableField]
}

export const formatStandardReportResponseBySystemVersion = reportModel => {
    // handle both d2 model instances and plain objects
    const reportJson = reportModel.toJSON ? reportModel.toJSON() : reportModel
    // <2.34 reportModel.reportTable, >=2.34 reportmodel.visualization
    const reportTable = reportModel[getReportTableNameBySystemVersion()]
    // <2.34 reportModel.reportTable.reportParams, >=2.34 reportmodel.visualization.reportingParams
    const reportTableReportParams =
        reportTable && reportTable[getReportParamsFieldName()]

    return {
        ...reportJson,
        reportParams: getReportParamsPropertiesBySystemVersion(
            reportJson.reportParams
        ),
        reportTable: {
            // The JSON representation of a d2 reportModel is missing
            // some of the reportTable properties such as reportParams
            ...reportTable,
            reportParams: getReportParamsPropertiesBySystemVersion(
                reportTableReportParams
            ),
        },
    }
}

export const formatStandardReportPayloadBySystemVersion = report => {
    if (isAtLeastVersion34()) {
        const visualization = report.reportTable
        delete report.reportTable
        return {
            ...report,
            visualization,
        }
    }

    const rp = report.reportParams

    return {
        ...report,
        reportParams: {
            paramGrandParentOrganisationUnit: rp.grandParentOrganisationUnit,
            paramOrganisationUnit: rp.organisationUnit,
            paramParentOrganisationUnit: rp.parentOrganisationUnit,
            paramReportingPeriod: rp.reportingPeriod,
        },
    }
}
