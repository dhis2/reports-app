import { fixedPeriodTranslations } from './fixedPeriods'

export const isFixedPeriodType = periodType =>
    !!fixedPeriodTranslations[periodType]
