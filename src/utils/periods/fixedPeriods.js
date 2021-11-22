import i18n from '@dhis2/d2-i18n'
import parseFixedPeriod from 'd2/period/parser'

/* do not change property names, those are ids from period types server */
export const fixedPeriodTranslations = {
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

export const relativePeriodsThatAreActuallyFixed = {
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

export const isFixedPeriodType = (periodType) =>
    !!fixedPeriodTranslations[periodType]

export const getFixedPeriodStartDate = (periodCode) => {
    try {
        const period = parseFixedPeriod(periodCode)
        return period.startDate
    } catch {
        return null
    }
}
