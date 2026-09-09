import { Parser } from 'expr-eval'
import { parseFieldId as parseFieldOperand } from '../get-field-id.jsx'

export const NONCALCULABLE_VALUE = 'noncalculable_value'
export const MATHEMATICALLY_INVALID_VALUE = 'mathematically_invalid_value'
/**
 * --- INDICATOR VALUE CALCULATION ---
 * The general formula for computing an indicator value is:
 * (numerator / denominator) * factor
 * The values for the `numerator` and `denominator` are obtained by
 * parsing an expression template string and then evaluating the
 * resulting arithmetic expression.
 * The `factor` is provided as a numerical value so that can just be
 * used directly.
 */
// Use a mathematical expression parser instead of `eval`
const parser = new Parser()
const evaluate = (expression) => {
    try {
        return parser.parse(expression).evaluate()
    } catch {
        return NONCALCULABLE_VALUE
    }
}
/*
 * In an indicator expression template an `operand` can have one of these shapes:
 * 1. #{deId} for a data element
 * 2. #{deId.cocId} for a category option combo
 */
export const operandInterpolationPattern = /#\{.+?\}/g

/**
 * Calculates the sum of category option combos in a data element
 * @param {Object.<string, string>} dataElementCocValues A data element object from ReactFinalForm `values`
 * @returns {number} The sum of form values, ignoring non-numerical values
 */
const getDataElementTotalValue = (dataElementCocValues) => {
    if (!dataElementCocValues || typeof dataElementCocValues !== 'object') {
        return 0
    }

    return Object.values(dataElementCocValues).reduce((sum, valueObject) => {
        if (!isNaN(valueObject?.value)) {
            sum = sum + Number(valueObject?.value)
        }
        return sum
    }, 0)
}
/**
 * Populates an expression template with values
 *
 * @example
 * // returns `'3+2*3'`
 * const expressionTemplate = '#{hfdmMSPBgLG}+#{ImspTQPwCqd.PT59n8BQbqM}*#{Jtf34kNZhzP.pq2XI5kz2BY}'
 * const values = {
 *     hfdmMSPBgLG: {
 *         fbfJHSPpUQD: '1',
 *         cYeuwXTCPkU: '2',
 *     },
 *     ImspTQPwCqd: {
 *         PT59n8BQbqM: '2',
 *     },
 *     Jtf34kNZhzP: {
 *         pq2XI5kz2BY: '3',
 *     },
 * }
 * parseExpressionTemplate(expressionTemplate, values)
 *
 * @param {string} expressionTemplate An indicator expression template
 * @param {Object} values ReactFinalForm `values`
 * @returns {string} a parsed expression template
 */
const parseExpressionTemplate = (expression, dataValues) => {
    const matches = expression.match(operandInterpolationPattern)

    /*
     * Not all expression templates contain references to data elements
     * and/or category combo options. They can also be plain string
     * representations of numerical values, i.e. `'4.23'`
     */
    if (!matches?.length > 0) {
        return expression
    }

    return matches.reduce((substitudedExpression, match) => {
        const operand = match.replace(/[#{}]/g, '')
        const { dataElementId, categoryOptionComboId } =
            parseFieldOperand(operand)
        const value =
            (categoryOptionComboId
                ? // For COCs we read the data directly from the form values
                  dataValues?.[dataElementId]?.[categoryOptionComboId]?.value
                : // For data elements we need the sum of all COC form values
                  getDataElementTotalValue(dataValues?.[dataElementId])) || 0

        return substitudedExpression.replace(match, value)
    }, expression)
}

/*
 * round(value, decimals)
 *
 * @param {number} value unrounded computed indicactorValue
 * @param {number} decimals number of decimal places to include output
 * @returns {number} number rounded to number of decimals
 */

export const round = (value, decimals) => {
    if (decimals < 0 || !Number.isInteger(decimals)) {
        return value
    }
    // Math.round only rounds to whole digit, so multiply by 10^x, round, then divide by 10^x
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}

/**
 * Parses and evaluates the denominator and numerator expressions
 * and then computes the indicator value
 * @param {Object} options
 * @param {string} options.denominator Indicator expression template
 * @param {string} options.numerator Indicator expression template
 * @param {number} options.factor Indicator multiplier
 * @param {Object} options.dataValues {[de]:{[coc]:{...rest,value}}}
 * @returns {number} Indicator value
 */

export const computeIndicatorValue = ({
    denominator,
    numerator,
    factor,
    dataValues,
    decimals,
}) => {
    const numeratorExpression = parseExpressionTemplate(numerator, dataValues)
    const denominatorExpression = parseExpressionTemplate(
        denominator,
        dataValues
    )
    const numeratorValue = evaluate(numeratorExpression)
    const denominatorValue = evaluate(denominatorExpression)

    if (
        numeratorValue === NONCALCULABLE_VALUE ||
        denominatorValue === NONCALCULABLE_VALUE
    ) {
        return {
            value: NONCALCULABLE_VALUE,
            numeratorValue,
            denominatorValue,
        }
    }
    const indicatorValue = (numeratorValue / denominatorValue) * factor
    const isReadableNumber = isFinite(indicatorValue) && !isNaN(indicatorValue)

    if (!isReadableNumber) {
        return {
            value: MATHEMATICALLY_INVALID_VALUE,
            numeratorValue,
            denominatorValue,
        }
    }
    return {
        value: decimals ? round(indicatorValue, decimals) : indicatorValue,
        numeratorValue,
        denominatorValue,
    }
}
