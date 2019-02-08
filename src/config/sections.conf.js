/* Page Components */
import { ConnectedStandardReport } from '../pages/StandardReport'
import { ConnectedDataSetReport } from '../pages/DataSetReport'
import { ConnectedReportingRateSummary } from '../pages/ReportingRateSummary'
import { ConnectedResource } from '../pages/resource/Resource'
import { ConnectedOrganisationUnitDistributionReport } from '../pages/organisation-unit-distribution-report/OrganisationUnitDistributionReport'
import { ConnectedDataApproval } from '../pages/data-approval/DataApproval'

/* i18n */
import { i18nKeys } from '../utils/i18n/i18nKeys'

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
            label: i18nKeys.standardReport.homeLabel,
            icon: 'bar_chart',
            description: i18nKeys.standardReport.description,
            actionText: i18nKeys.standardReport.homeAction,
            docs: 'using_reporting_standard_reports',
        },
    },
    {
        key: DATA_SET_REPORT_SECTION_KEY,
        path: '/data-set-report',
        component: ConnectedDataSetReport,
        info: {
            label: i18nKeys.dataSetReport.homeLabel,
            icon: 'assignment',
            description: i18nKeys.dataSetReport.description,
            actionText: i18nKeys.dataSetReport.homeAction,
            docs: 'using_reporting_dataset_reports',
        },
    },
    {
        key: REPORTING_RATE_SUMMARY_SECTION_KEY,
        path: '/reporting-rate-summary',
        component: ConnectedReportingRateSummary,
        info: {
            label: i18nKeys.reportingRateSummary.homeLabel,
            icon: 'format_list_bulleted',
            description: i18nKeys.reportingRateSummary.description,
            actionText: i18nKeys.reportingRateSummary.homeAction,
            docs: 'using_reporting_reporting_rate_summary',
        },
    },
    {
        key: RESOURCE_SECTION_KEY,
        path: '/resource',
        component: ConnectedResource,
        info: {
            label: i18nKeys.resource.homeLabel,
            icon: 'cloud_upload',
            description: i18nKeys.resource.description,
            actionText: i18nKeys.resource.homeAction,
            docs: 'using_reporting_resources',
        },
    },
    {
        key: ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
        path: '/organisation-unit-distribution-report',
        component: ConnectedOrganisationUnitDistributionReport,
        info: {
            label: i18nKeys.organisationUnitDistributionReport.homeLabel,
            icon: 'device_hub',
            description:
                i18nKeys.organisationUnitDistributionReport.description,
            actionText: i18nKeys.organisationUnitDistributionReport.homeAction,
            docs: 'using_reporting_orgunit_distribution_reports',
        },
    },
    {
        key: DATA_APPROVAL_SECTION_KEY,
        path: '/data-approval',
        component: ConnectedDataApproval,
        info: {
            label: i18nKeys.dataApproval.homeLabel,
            icon: 'playlist_add_check',
            description: i18nKeys.dataApproval.description,
            actionText: i18nKeys.dataApproval.homeAction,
            docs: 'data_approval',
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
