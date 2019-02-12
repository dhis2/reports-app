import i18n from '@dhis2/d2-i18n'

/* do not change property names, those are ids from period types server */
const translations = {
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

export default function pluckPeriodTypes(collection) {
    return collection.reduce((acc, periodType) => {
        // The API returns a bi-weekly periodType but this is not supported by the d2ui/core PeriodPicker
        if (periodType.name !== 'BiWeekly') {
            acc.push({
                id: periodType.name,
                displayName: translations[periodType.name],
            })
        }
        return acc
    }, [])
}
