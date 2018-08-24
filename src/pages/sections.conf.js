/* Page Components */
import StandardReport from './standard-report/StandardReport';
import DataSetReport from './data-set-report/DataSetReport';
import ReportingRateSummary from './reporting-rate-summary/ReportingRateSummary';
import { ConnectedResource } from './resource/Resource';
import OrganisationUnitDistributionReport
    from './organisation-unit-distribution-report/OrganisationUnitDistributionReport';
import DataApproval from './data-approval/DataApproval';

/* i18n */
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
        component: StandardReport,
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
        component: DataSetReport,
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
        component: ReportingRateSummary,
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
        component: OrganisationUnitDistributionReport,
        info: {
            label: i18nKeys.organisationUnitDistributionReport.homeLabel,
            icon: 'device_hub',
            description: i18nKeys.organisationUnitDistributionReport.description,
            actionText: i18nKeys.organisationUnitDistributionReport.homeAction,
            docs: 'using_reporting_orgunit_distribution_reports',
        },
    },
    {
        key: DATA_APPROVAL_SECTION_KEY,
        path: '/data-approval',
        component: DataApproval,
        info: {
            label: i18nKeys.dataApproval.homeLabel,
            icon: 'playlist_add_check',
            description: i18nKeys.dataApproval.description,
            actionText: i18nKeys.dataApproval.homeAction,
            docs: 'data_approval',
        },
    },
];

export const getDocsKeyForSection = (sectionKey) => {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.key === sectionKey) {
            return section.info.docs;
        }
    }

    return '';
};
