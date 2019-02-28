import i18n from '../utils/i18n/locales'
import { ConnectedStandardReport } from '../pages/StandardReport'
import { ConnectedDataSetReport } from '../pages/DataSetReport'
import { ConnectedReportingRateSummary } from '../pages/ReportingRateSummary'
import { ConnectedOrganisationUnitDistributionReport } from '../pages/OrganisationUnitDistributionReport'
import { ConnectedResource } from '../pages/Resource'
export const STANDARD_REPORT_SECTION_KEY = 'standard-report'
export const DATA_SET_REPORT_SECTION_KEY = 'data-set-report'
export const REPORTING_RATE_SUMMARY_SECTION_KEY = 'reporting-rate-summary'
export const RESOURCE_SECTION_KEY = 'resource'
export const ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY =
    'organisation-unit-distribution-report'
export const DATA_APPROVAL_SECTION_KEY = 'data-approval'

export const DEBOUNCE_DELAY = 500

export const sections = [
    {
        key: STANDARD_REPORT_SECTION_KEY,
        path: '/standard-report',
        component: ConnectedStandardReport,
        info: {
            label: i18n.t('Standard Report'),
            icon: i18n.t('bar_chart'),
            description: i18n.t(
                'View and add reports based on the JasperReports library. These can be based on report tables and can be designed in iReport.'
            ),
            actionText: i18n.t('View Reports'),
            docs: 'using_reporting_standard_reports',
        },
    },
    {
        key: DATA_SET_REPORT_SECTION_KEY,
        path: '/data-set-report',
        component: ConnectedDataSetReport,
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
    {
        key: REPORTING_RATE_SUMMARY_SECTION_KEY,
        path: '/reporting-rate-summary',
        component: ConnectedReportingRateSummary,
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
    {
        key: RESOURCE_SECTION_KEY,
        path: '/resource',
        component: ConnectedResource,
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
    {
        key: ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
        path: '/organisation-unit-distribution-report',
        component: ConnectedOrganisationUnitDistributionReport,
        info: {
            label: i18n.t('Organisation Unit Distribution Report'),
            description: i18n.t(
                'Browse the organisation unit distribution report based on the organisation unit group sets and its groups.'
            ),
            actionText: i18n.t('Get Report'),
            icon: 'device_hub',
            docs: 'using_reporting_orgunit_distribution_reports',
        },
    },
]

export const getDocsKeyForSection = sectionKey => {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        if (section.key === sectionKey) {
            return section.info.docs
        }
    }

    return ''
}
