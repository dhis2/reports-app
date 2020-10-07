import { fixedPeriodTranslations } from './fixedPeriods'
import { getFixedPeriodStartDate } from './fixedPeriods'
import { getRelativePeriodStartDate } from './relativePeriods'

export const isFixedPeriodType = periodType =>
    !!fixedPeriodTranslations[periodType]

export const getPeriodStartDate = periodCode => {
    return (
        getRelativePeriodStartDate(periodCode) ||
        getFixedPeriodStartDate(periodCode)
    )
}
