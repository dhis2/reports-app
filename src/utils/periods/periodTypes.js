import { getFixedPeriodStartDate } from './fixedPeriods'
import { getRelativePeriodStartDate } from './relativePeriods'

export const getPeriodStartDate = periodCode => {
    return (
        getRelativePeriodStartDate(periodCode) ||
        getFixedPeriodStartDate(periodCode)
    )
}
