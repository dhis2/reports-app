export const i18nKeys = {
    datasetsDropdown: {
        hintText: 'Select Data Set',
        dataSetLabel: 'Data set',
    },
    dimensionsDropdown: {
        hintText: 'Select Option',
    },
    organisationUnitGroupSetDropdown: {
        hintText: 'Select Option',
    },
    groupSetsDropdown: {
        hintText: 'Select Group Set',
        label: 'Group Set',
    },
    periodPicker: {
        periodLabel: 'Period',
        periodTypeHintText: 'Select Period Type',
        /* do not change property names, those are ids from period types server */
        labels: {
            Daily: 'Daily',
            Weekly: 'Weekly',
            WeeklyWednesday: 'Weekly Wednesday',
            WeeklyThursday: 'Weekly Thursday',
            WeeklySaturday: 'Weekly Saturday',
            WeeklySunday: 'Weekly Sunday',
            BiWeekly: 'Bi-Weekly',
            Monthly: 'Monthly',
            BiMonthly: 'Bi-Monthly',
            Quarterly: 'Quarterly',
            SixMonthly: 'Six-Monthly',
            SixMonthlyApril: 'Six-Monthly April',
            Yearly: 'Yearly',
            FinancialApril: 'Financial-April',
            FinancialJuly: 'Financial-July',
            FinancialOct: 'Financial-Oct',
        },
    },
    availableOrganisationUnitsTree: {
        updatingMessage: 'Updating Organisation Units Tree...',
    },
    standardReport: {
        homeLabel: 'Standard Report',
        homeAction: 'View Reports',
        header: 'Standard Report',
        description: 'View and add reports based on the JasperReports library. ' +
        'These can be based on report tables and can be designed in iReport.',
    },
    dataSetReport: {
        homeLabel: 'Data Set Report',
        homeAction: 'Get Report',
        header: 'Data Set Report',
        description: 'View data set reports. These reports are based on data entry screens and ' +
        'will produce a report with aggregated data.',
        reportPeriodLabel: 'Report period',
        selectedUnitOnlyLabel: 'Use data for selected unit only',
        organisationUnitLabel: 'Report organisation unit',
        sharePlaceholder: 'Write a comment, question or interpretation of this report',
        showMoreOptions: 'Show more options',
        showFewOptions: 'Show few options',
        mainAction: 'Get Report',
        exportReport: 'download as xls',
        share: 'Share',
        interpretationShared: 'Interpretation Shared',
    },
    reportingRateSummary: {
        homeLabel: 'Reporting Rate Summary',
        homeAction: 'Get Report',
        header: 'Reporting Rate Summary',
        description: 'Browse the reporting rates of data sets by organisation unit and period based' +
        ' on various criteria for submission.',
        reportPeriodLabel: 'Report period',
        organisationUnitLabel: 'Report organisation unit',
        showMoreOptions: 'Show more options',
        showFewOptions: 'Show few options',
        mainAction: 'Get Report',
        exportReport: 'download as xls',
        basedOnLabel: 'Based on',
        basedOnCompleteOptionLabel: 'Complete data set registrations',
        basedOnCompulsoryOptionLabel: 'Compulsory data elements',
    },
    resource: {
        homeLabel: 'Resource',
        homeAction: 'View Resources',
        header: 'Resource',
        description: 'View and add resources. These resources can be uploaded documents or URLs on the web.',
    },
    organisationUnitDistributionReport: {
        homeLabel: 'Organisation Unit Distribution Report',
        homeAction: 'Get Report',
        header: 'Organisation Unit Distribution Report',
        description: 'Browse the organisation unit distribution report based on the organisation unit group sets' +
        ' and its groups.',
        organisationUnitLabel: 'Report organisation unit',
        exportReport: 'download as xls',
        getReportAction: 'Get Report',
        getChartAction: 'Get Chart',
        chartImageAlt: 'Chart',
    },
    dataApproval: {
        homeLabel: 'Data Approval',
        homeAction: 'View Data Values',
        header: 'Data Approval',
        description: 'View data and manage data approval by approving or unapproving, accepting or unaccepting data.',
    },
    messages: {
        loading: 'Loading...',
        reportGenerated: 'Report generated',
        chartGenerated: 'Chart generated',
        unexpectedError: 'Unexpected Error',
    },
    d2UiComponents: {
        app_search_placeholder: 'Search',
        week: 'week',
        month: 'month',
        year: 'year',
        biMonth: 'bi monthly',
        day: 'day',
        jan: 'jan',
        feb: 'feb',
        mar: 'mar',
        apr: 'apr',
        may: 'may',
        jun: 'jun',
        jul: 'jul',
        aug: 'aug',
        sep: 'sep',
        oct: 'oct',
        nov: 'nov',
        dec: 'dec',
        janFeb: 'jan-feb',
        marApr: 'mar-apr',
        mayJun: 'may-jun',
        julAug: 'jul-aug',
        sepOct: 'sep-oct',
        novDec: 'nov-dec',
        quarter: 'quarter',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
        sixMonth: 'six monthly',
        janJun: 'jan-jun',
        julDec: 'jul-dec',
        aprSep: 'apr-sep',
        octMar: 'oct-mar',
    },
};

export default i18nKeys;
