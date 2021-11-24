import { getFixedPeriodStartDate } from './fixedPeriods.js'
import { getRelativePeriodStartDate } from './relativePeriods.js'

export const getPeriodStartDate = (periodCode) => {
    return (
        getRelativePeriodStartDate(periodCode) ||
        getFixedPeriodStartDate(periodCode)
    )
}
