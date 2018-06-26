/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

const relativePeriods = [
    // Days
    {
        label: i18n.t(i18nKeys.relativePeriods.days),
        periods: [
            {
                id: 'thisDay',
                name: i18n.t(i18nKeys.relativePeriods.thisDay),
            },
            {
                id: 'yesterday',
                name: i18n.t(i18nKeys.relativePeriods.yesterday),
            },
            {
                id: 'last3Days',
                name: i18n.t(i18nKeys.relativePeriods.last3Days),
            },
            {
                id: 'last7Days',
                name: i18n.t(i18nKeys.relativePeriods.last7Days),
            },
            {
                id: 'last14Days',
                name: i18n.t(i18nKeys.relativePeriods.last14Days),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t(i18nKeys.relativePeriods.weeks),
        periods: [
            {
                id: 'thisWeek',
                name: i18n.t(i18nKeys.relativePeriods.thisWeek),
            },
            {
                id: 'lastWeek',
                name: i18n.t(i18nKeys.relativePeriods.lastWeek),
            },
            {
                id: 'last4Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last4Weeks),
            },
            {
                id: 'last12Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last12Weeks),
            },
            {
                id: 'last52Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last52Weeks),
            },
            {
                id: 'weeksThisYear',
                name: i18n.t(i18nKeys.relativePeriods.weeksThisYear),
            },
        ],
    },
    // Months
    {
        label: i18n.t(i18nKeys.relativePeriods.months),
        periods: [
            {
                id: 'thisMonth',
                name: i18n.t(i18nKeys.relativePeriods.thisMonth),
            },
            {
                id: 'lastMonth',
                name: i18n.t(i18nKeys.relativePeriods.lastMonth),
            },
            {
                id: 'last3Months',
                name: i18n.t(i18nKeys.relativePeriods.last3Months),
            },
            {
                id: 'last6Months',
                name: i18n.t(i18nKeys.relativePeriods.last6Months),
            },
            {
                id: 'last12Months',
                name: i18n.t(i18nKeys.relativePeriods.last12Months),
            },
            {
                id: 'monthsThisYear',
                name: i18n.t(i18nKeys.relativePeriods.monthsThisYear),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t(i18nKeys.relativePeriods.biMonths),
        periods: [
            {
                id: 'thisBiMonth',
                name: i18n.t(i18nKeys.relativePeriods.thisBimonth),
            },
            {
                id: 'lastBiMonth',
                name: i18n.t(i18nKeys.relativePeriods.lastBimonth),
            },
            {
                id: 'last6BiMonths',
                name: i18n.t(i18nKeys.relativePeriods.last6BiMonths),
            },
            {
                id: 'biMonthsThisYear',
                name: i18n.t(i18nKeys.relativePeriods.biMonthsThisYear),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t(i18nKeys.relativePeriods.quarters),
        periods: [
            {
                id: 'thisQuarter',
                name: i18n.t(i18nKeys.relativePeriods.thisQuarter),
            },
            {
                id: 'lastQuarter',
                name: i18n.t(i18nKeys.relativePeriods.lastQuarter),
            },
            {
                id: 'last4Quarters',
                name: i18n.t(i18nKeys.relativePeriods.last4Quarters),
            },
            {
                id: 'quartersThisYear',
                name: i18n.t(i18nKeys.relativePeriods.quartersThisYear),
            },
        ],
    },
];

export default relativePeriods;
