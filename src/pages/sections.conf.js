// i18n
import { i18nKeys } from '../i18n';

export const STANDARD_REPORT_SECTION_KEY = 'standardReport';
export const DATA_SET_REPORT_SECTION_KEY = 'dataSetReport';
export const REPORTING_RATE_SUMMARY_SECTION_KEY = 'reportingRateSummary';
export const RESOURCE_SECTION_KEY = 'resource';
export const ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY = 'orgUnitDistReport';
export const DATA_APPROVAL_SECTION_KEY = 'dataApproval';

export const sections = [
    {
        key: STANDARD_REPORT_SECTION_KEY,
        path: '/standard-report',
        component: null,
        info: {
            label: i18nKeys.standardReport.homeLabel,
            icon: 'done_all',
            description: i18nKeys.standardReport.description,
            actionText: i18nKeys.standardReport.homeAction,
            docs: 'using_reporting_standard_reports',
        },
    },
    {
        key: DATA_SET_REPORT_SECTION_KEY,
        path: '/data-set-report',
        component: null,
        info: {
            label: i18nKeys.dataSetReport.homeLabel,
            icon: 'done_all',
            description: i18nKeys.dataSetReport.description,
            actionText: i18nKeys.dataSetReport.homeAction,
            docs: 'using_reporting_dataset_reports',
        },
    },
    {
        key: REPORTING_RATE_SUMMARY_SECTION_KEY,
        path: '/reporting-rate-summary',
        component: null,
        info: {
            label: i18nKeys.reportingRateSummary.homeLabel,
            icon: 'done_all',
            description: i18nKeys.reportingRateSummary.description,
            actionText: i18nKeys.reportingRateSummary.homeAction,
            docs: 'using_reporting_reporting_rate_summary',
        },
    },
    {
        key: RESOURCE_SECTION_KEY,
        path: '/resource',
        component: null,
        info: {
            label: i18nKeys.resource.homeLabel,
            icon: 'done_all',
            description: i18nKeys.resource.description,
            actionText: i18nKeys.resource.homeAction,
            docs: 'using_reporting_resources',
        },
    },
    {
        key: ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_KEY,
        path: '/organisation-unit-distribution-report',
        component: null,
        info: {
            label: i18nKeys.organisationUnitDistributionReport.homeLabel,
            icon: 'done_all',
            description: i18nKeys.organisationUnitDistributionReport.description,
            actionText: i18nKeys.organisationUnitDistributionReport.homeAction,
            docs: 'using_reporting_orgunit_distribution_reports',
        },
    },
    {
        key: DATA_APPROVAL_SECTION_KEY,
        path: '/data-approval',
        component: null,
        info: {
            label: i18nKeys.dataApproval.homeLabel,
            icon: 'done_all',
            description: i18nKeys.dataApproval.description,
            actionText: i18nKeys.dataApproval.homeAction,
            docs: 'data_approval',
        },
    },
];