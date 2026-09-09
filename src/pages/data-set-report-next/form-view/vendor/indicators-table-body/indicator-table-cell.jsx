import i18n from '@dhis2/d2-i18n'
import { TableCell, Tooltip, IconInfo16, IconWarning16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from '../table-body.module.css'
import {
    NONCALCULABLE_VALUE,
    MATHEMATICALLY_INVALID_VALUE,
} from './compute-indicator-value.js'
import { useIndicatorValue } from './use-indicator-value.js'

const InvalidIndicatorWrapper = ({ tooltipText, invalid }) => (
    <TableCell className={styles.indicatorCellNoncalculable}>
        <Tooltip content={tooltipText}>
            {invalid ? <IconWarning16 /> : <IconInfo16 />}
        </Tooltip>
    </TableCell>
)

InvalidIndicatorWrapper.propTypes = {
    invalid: PropTypes.bool,
    tooltipText: PropTypes.string,
}

export const IndicatorTableCell = ({
    denominator,
    factor,
    numerator,
    decimals,
}) => {
    const {
        value: indicatorValue,
        numeratorValue,
        denominatorValue,
    } = useIndicatorValue({
        denominator,
        factor,
        numerator,
        decimals,
    })

    if (indicatorValue === NONCALCULABLE_VALUE) {
        return (
            <InvalidIndicatorWrapper
                tooltipText={i18n.t(
                    'This value cannot be calculated in this app'
                )}
            />
        )
    }

    if (indicatorValue === MATHEMATICALLY_INVALID_VALUE) {
        return (
            <InvalidIndicatorWrapper
                tooltipText={i18n.t(
                    `This expression is not mathematically calculable {{numeratorValue}}/{{denominatorValue}}`,
                    { numeratorValue, denominatorValue }
                )}
                invalid={true}
            />
        )
    }

    return (
        <TableCell className={styles.indicatorCell}>{indicatorValue}</TableCell>
    )
}

IndicatorTableCell.propTypes = {
    denominator: PropTypes.string.isRequired,
    factor: PropTypes.number.isRequired,
    numerator: PropTypes.string.isRequired,
    decimals: PropTypes.number,
}
