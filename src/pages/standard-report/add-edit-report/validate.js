import { reportTypes } from '../standard.report.conf'

export const validateNewReport = (values) => {
    const errors = {}

    validateName(errors, values)
    validateReportTable(errors, values)
    validateDesignContent(errors, values)
    validateCacheStrategy(errors, values)

    return errors
}

export const validateReportUpdate = (values) => {
    const errors = {}

    validateName(errors, values)
    validateReportTable(errors, values)
    validateCacheStrategy(errors, values)

    return errors
}

const validateName = (errors, values) => {
    if (!values.name) {
        errors.name = 'Required'
    }
}

const validateReportTable = (errors, values) => {
    if (
        values.type === reportTypes.JASPER_REPORT_TABLE &&
        !values.reportTable
    ) {
        errors.reportTable = 'Required'
    }
}

const validateDesignContent = (errors, values) => {
    if (!values.designContent) {
        errors.designContent = 'Required'
    }
}

const validateCacheStrategy = (errors, values) => {
    if (!values.cacheStrategy) {
        errors.cacheStrategy = 'Required'
    }
}
