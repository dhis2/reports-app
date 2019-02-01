export const i18nKeys = {
    buttons: {
        cancel: 'Cancel',
        save: 'Save',
        getReport: 'Get Report',
        downloadAsExcel: 'Download as excel',
    },
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
    relativePeriods: {
        // days
        days: 'Days',
        thisDay: 'Reporting day',
        yesterday: 'Yesterday',
        last3Days: 'Last 3 days',
        last7Days: 'Last 7 days',
        last14Days: 'Last 14 days',
        // weeks
        weeks: 'Weeks',
        thisWeek: 'Reporting week',
        lastWeek: 'Last Week',
        last4Weeks: 'Last 2 weeks',
        last12Weeks: 'Last 12 weeks',
        last52Weeks: 'Last 52 weeks',
        weeksThisYear: 'Weeks this year',
        // month
        months: 'Months',
        thisMonth: 'Reporting month',
        lastMonth: 'Last month',
        last3Months: 'Last 3 months',
        last6Months: 'Last 6 months',
        last12Months: 'Last 12 months',
        monthsThisYear: 'Months this year',
        // bi-month
        biMonths: 'Bi-months',
        thisBimonth: 'Reporting bi-month',
        lastBimonth: 'Last bi-month',
        last6BiMonths: 'Last 6 bi-month',
        biMonthsThisYear: 'Bi-months this year',
        // quarters
        quarters: 'Quarters',
        thisQuarter: 'Reporting quarter',
        lastQuarter: 'Last quarter',
        last4Quarters: 'Last 4 quarters',
        quartersThisYear: 'Quarters of reporting year',
        // six-months
        sixMonths: 'Six-Months',
        thisSixMonth: 'Reporting six-month',
        lastSixMonth: 'Last six-month',
        last2SixMonths: 'Last 2 six-months',
        // financial years
        financialYears: 'Financial Years',
        thisFinancialYear: 'Reporting financial year',
        lastFinancialYear: 'Last financial year',
        last5FinancialYears: 'Last 5 financial years',
        // years
        years: 'Years',
        thisYear: 'Reporting year',
        lastYear: 'Last year',
        last5Years: 'Last 5 years',
        // not used
        monthsLastYear: 'Months last year',
        quartersLastYear: 'Quartes last year',
        thisBiWeek: 'This bi-week',
        lastBiWeek: 'Last bi-week',
        last4BiWeeks: 'Last 4 bi-weeks',
    },
    availableOrganisationUnitsTree: {
        updatingMessage: 'Updating Organisation Units Tree...',
        treeLabel: 'Organisation Unit',
    },
    standardReport: {
        createReportTitle: 'Create Report Table',
        none: '[ None ]',
        noCache: 'No cache',
        respectSystemSettings: 'Respect system setting',
        cacheForOneHour: 'Cache for one hour',
        cache6AmTomorrow: 'Cache until 6 AM tomorrow',
        cacheFour2Weeks: 'Cache for two weeks',
        homeLabel: 'Standard Report',
        homeAction: 'View Reports',
        header: 'Standard Report',
        description: 'View and add reports based on the JasperReports library. ' +
        'These can be based on report tables and can be designed in iReport.',
        search: 'Search',
        details: 'Details',
        settings: 'Settings',
        relativePeriods: 'Relative periods',
        reportParameters: 'Report parameters',
        cacheStrategy: 'Cache Strategy',
        reportingPeriod: 'Reporting Period',
        reportingOrganisationUnit: 'Organization Unit',
        nameLabel: 'Name',
        typeLabel: 'Type',
        designFileLabel: 'Design File',
        reportTableLabel: 'Report table',
        addNewReportTitle: 'Add New Report',
        editReportTitle: 'Edit Report',
        removeReportTitle: 'Remove Report',
        noFileChosen: 'No File Chosen',
        getCurrentDesign: 'Get current design',
        getJasperTemplate: 'Get Jasper Report Template',
        getHTMLTemplate: 'Get HTML Report Template',
        htmlReportType: 'HTML report',
        jasperJDBCReportType: 'Jasper report with JDBC data source',
        jasperReportTable: 'Jasper report with report table data source',
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
        search: 'Search',
        addNewResourceTitle: 'Add New Resource',
        editResourceTitle: 'Edit Resource',
        details: 'Details',
        nameLabel: 'Name',
        typeLabel: 'Type',
        attachmentLabel: 'Attachment',
        fileLabel: 'File',
        urlLabel: 'URL',
        uploadResourceType: 'Upload File',
        externalResourceType: 'External URL',
        noFileChosen: 'No File Chosen',
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
        organisationUnitLabel: 'Organisation unit',
        reportPeriodLabel: 'Period',
        mainAction: 'Get Data',
        approvalStatusLabel: 'Approval status',
        statusNotifications: {
            NONE: 'Please make a selection below',
            UNAPPROVABLE: 'Approval not relevant',
            UNAPPROVED_ABOVE: 'Ready for approval at a higher level',
            UNAPPROVED_WAITING: 'Waiting for lower levels to approve',
            UNAPPROVED_ELSEWHERE: 'Waiting for approval elsewhere',
            UNAPPROVED_READY: 'Ready for approval',
            PARTIALLY_APPROVED_HERE: 'Approved for part of this period',
            APPROVED_ABOVE: 'approved_at_a_higher_level',
            APPROVED_HERE: 'Approved',
            PARTIALLY_APPROVED_ELSEWHERE: 'Approved elsewhere for part of this period',
            APPROVED_ELSEWHERE: 'Approved elsewhere',
            PARTIALLY_ACCEPTED_HERE: 'Accepted for part of this period',
            ACCEPTED_HERE: 'Approved and accepted',
            PARTIALLY_ACCEPTED_ELSEWHERE: 'Accepted elsewhere for part of this period',
            ACCEPTED_ELSEWHERE: 'Accepted elsewhere',
        },
        confirmActionNotifications: {
            APPROVE: 'Are you sure you want to approve this data set?',
            UNAPPROVE: 'Are you sure you want to unapprove this data set?',
            ACCEPT: 'Are you sure you want to accept this data set approval?',
            UNACCEPT: 'Are you sure you want to unaccept this data set approval?',
        },
        buttonLabels: {
            approve: 'Approve',
            unapprove: 'Unapprove',
            accept: 'Accept',
            unaccept: 'Unaccept',
        },
        confirmDialog: {
            title: 'Confirm',
            cancel: 'Cancel',
            confirm: 'Confirm',
        },
    },
    messages: {
        loading: 'Loading...',
        reportGenerated: 'Report generated',
        reportDeleted: 'Report deleted',
        resourceDeleted: 'Resource deleted',
        chartGenerated: 'Chart generated',
        unexpectedError: 'Unexpected Error',
        interpretationShared: 'Interpretation Shared',
        noResultsFound: 'No results have been found',
        rightsMessage: 'This object will be created with public edit and view rights',
        confirmDelete: 'Confirm delete',
    },
    d2UiComponents: {
        settings: 'Settings',
        app_search_placeholder: 'Search apps',
        profile: 'Profile',
        account: 'Account',
        help: 'Help',
        log_out: 'Log out',
        about_dhis2: 'About DHIS 2',
        manage_my_apps: 'Manage my apps',
        no_results_found: 'No results found',
        interpretations: 'Interpretations',
        messages: 'Messages',
        display_name: 'Name',
        report_table: 'Report Table',
        id: 'ID',
        // Context Menu Standard Report
        createReport: 'Create',
        editReport: 'Edit Report',
        // Context Menu Common
        actions: 'Actions',
        delete: 'Delete',
        sharingSettings: 'Sharing Settings',
        // Context Menu Resource
        viewResource: 'View Resource',
        editResource: 'Edit Resource',
        // Sharing Settings
        add_users_and_user_groups: 'Add users and user groups',
        enter_names: 'Enter names',
        share: 'Sharing settings',
        metadata: 'Permissions',
        created_by: 'Created By',
        who_has_access: 'Who has access',
        external_access: 'External access (without login)',
        can_edit_and_view: 'Can edit and view',
        can_view: 'Can view',
        can_view_only: 'Can view only',
        no_access: 'No access',
        public_access: 'Public access (with login)',
        public_can_edit: 'Public can edit',
        public_can_view: 'Public can view',
        anyone_can_find_view_and_edit: 'Public can find, view and edit',
        anyone_can_find_and_view: 'Public can find and view',
        // Buttons
        close: 'Close',
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
        'jan-feb': 'jan-feb',
        'mar-apr': 'mar-apr',
        'may-jun': 'may-jun',
        'jul-aug': 'jul-aug',
        'sep-oct': 'sep-oct',
        'nov-dec': 'nov-dec',
        quarter: 'quarter',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
        sixMonth: 'six monthly',
        'jan-jun': 'jan-jun',
        'jul-dec': 'jul-dec',
        'apr-sep': 'apr-sep',
        'oct-mar': 'oct-mar',

    },
};

export default i18nKeys;
