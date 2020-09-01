import i18n from '../locales'

export const STANDARD_REPORT_SECTION_KEY = 'standard-report'
export const DATA_SET_REPORT_SECTION_KEY = 'data-set-report'
export const REPORTING_RATE_SUMMARY_SECTION_KEY = 'reporting-rate-summary'
export const RESOURCE_SECTION_KEY = 'resource'
export const ORG_UNIT_DIST_REPORT_SECTION_KEY =
    'organisation-unit-distribution-report'
export const DATA_APPROVAL_SECTION_KEY = 'data-approval'

export const sectionOrder = [
    STANDARD_REPORT_SECTION_KEY,
    DATA_SET_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
]

export const sections = {
    [STANDARD_REPORT_SECTION_KEY]: {
        key: STANDARD_REPORT_SECTION_KEY,
        path: `/${STANDARD_REPORT_SECTION_KEY}`,
        info: {
            label: i18n.t('Standard Report'),
            icon: 'bar_chart',
            description: i18n.t(
                'View and add reports based on the JasperReports library. These can be based on report tables and can be designed in iReport.'
            ),
            actionText: i18n.t('View Reports'),
            docs: 'using_reporting_standard_reports',
        },
    },
    [DATA_SET_REPORT_SECTION_KEY]: {
        key: DATA_SET_REPORT_SECTION_KEY,
        path: `/${DATA_SET_REPORT_SECTION_KEY}`,
        info: {
            label: i18n.t('Data Set Report'),
            icon: 'assignment',
            description: i18n.t(
                'View data set reports. These reports are based on data entry screens and will produce a report with aggregated data.'
            ),
            actionText: i18n.t('Get Report'),
            docs: 'using_reporting_dataset_reports',
        },
    },
    [REPORTING_RATE_SUMMARY_SECTION_KEY]: {
        key: REPORTING_RATE_SUMMARY_SECTION_KEY,
        path: `/${REPORTING_RATE_SUMMARY_SECTION_KEY}`,
        info: {
            label: i18n.t('Reporting Rate Summary'),
            description: i18n.t(
                'Browse the reporting rates of data sets by organisation unit and period based on various criteria for submission.'
            ),
            actionText: i18n.t('Get Report'),
            icon: 'format_list_bulleted',
            docs: 'using_reporting_reporting_rate_summary',
        },
    },
    [RESOURCE_SECTION_KEY]: {
        key: RESOURCE_SECTION_KEY,
        path: `/${RESOURCE_SECTION_KEY}`,
        info: {
            label: i18n.t('Resource'),
            description: i18n.t(
                'View and add resources. These resources can be uploaded documents or URLs on the web.'
            ),
            actionText: i18n.t('View Resources'),
            icon: 'cloud_upload',
            docs: 'using_reporting_resources',
        },
    },
    [ORG_UNIT_DIST_REPORT_SECTION_KEY]: {
        key: ORG_UNIT_DIST_REPORT_SECTION_KEY,
        path: `/${ORG_UNIT_DIST_REPORT_SECTION_KEY}`,
        info: {
            label: i18n.t('Org unit distribution report'),
            description: i18n.t(
                'Browse the organisation unit distribution report based on the organisation unit group sets and its groups.'
            ),
            actionText: i18n.t('Get Report'),
            icon: 'device_hub',
            docs: 'using_reporting_orgunit_distribution_reports',
        },
    },
}
