import i18n from '@dhis2/d2-i18n'
import { flattenedRelativePeriods } from '../../../pages/standard-report/standard.report.conf'
import { isJasperReportTableReport } from '../../../utils/standardReport'

/* do not change property names, those are ids from period types server */
const fixedPeriodTranslations = {
    Daily: i18n.t('Daily'),
    Weekly: i18n.t('Weekly'),
    WeeklyWednesday: i18n.t('Weekly Wednesday'),
    WeeklyThursday: i18n.t('Weekly Thursday'),
    WeeklySaturday: i18n.t('Weekly Saturday'),
    WeeklySunday: i18n.t('Weekly Sunday'),
    BiWeekly: i18n.t('Bi-Weekly'),
    Monthly: i18n.t('Monthly'),
    BiMonthly: i18n.t('Bi-Monthly'),
    Quarterly: i18n.t('Quarterly'),
    SixMonthly: i18n.t('Six-Monthly'),
    SixMonthlyApril: i18n.t('Six-Monthly April'),
    SixMonthlyNov: i18n.t('Six-Monthly November'),
    Yearly: i18n.t('Yearly'),
    FinancialApril: i18n.t('Financial-April'),
    FinancialJuly: i18n.t('Financial-July'),
    FinancialOct: i18n.t('Financial-Oct'),
}

const relativePeriodsThatAreActuallyFixed = {
    thisDay: ['Daily'],
    thisWeek: [
        'Weekly',
        'WeeklyWednesday',
        'WeeklyThursday',
        'WeeklySaturday',
        'WeeklySunday',
    ],
    thisBiWeek: ['BiWeekly'],
    thisMonth: ['Monthly'],
    thisBimonth: ['BiMonthly'],
    thisQuarter: ['Quarterly'],
    thisSixMonth: ['SixMonthly', 'SixMonthlyApril', 'SixMonthlyNov'],
    thisYear: ['Yearly'],
    thisFinancialYear: [
        'FinancialApril',
        'FinancialJuly',
        'FinancialOct',
        'FinancialNov',
    ],
}

export const getFilteredPeriodTypes = state => {
    const fixedPeriodTypes = state.reportPeriod.collection.map(periodType => ({
        id: periodType.name,
        displayName: fixedPeriodTranslations[periodType.name],
    }))

    if (!state.standardReport.showReportParams) {
        return fixedPeriodTypes
    }

    // In report params modal we want to show a mix of fixed period types and relative periods
    const report = state.standardReport.selectedReport
    const reportConfig = isJasperReportTableReport(report)
        ? report.reportTable
        : report

    const periods = reportConfig.relativePeriods || {}

    return Object.keys(periods).reduce((acc, periodKey) => {
        const isSelected = periods[periodKey]

        if (isSelected) {
            const fixedPeriodTypes =
                relativePeriodsThatAreActuallyFixed[periodKey]

            if (fixedPeriodTypes) {
                fixedPeriodTypes.forEach(periodKey => {
                    acc.push({
                        id: periodKey,
                        displayName: fixedPeriodTranslations[periodKey],
                    })
                })
            } else {
                acc.push({
                    ...flattenedRelativePeriods[periodKey],
                    isRelative: true,
                })
            }
        }

        return acc
    }, [])
}

export const isFixedPeriodType = periodType =>
    !!fixedPeriodTranslations[periodType]
