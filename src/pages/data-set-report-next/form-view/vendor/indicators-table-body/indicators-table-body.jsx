import i18n from '@dhis2/d2-i18n'
import {
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { TableBodyHiddenByFiltersRow } from '../table-body-hidden-by-filter-row.jsx'
import styles from '../table-body.module.css'
import { IndicatorTableCell } from './indicator-table-cell.jsx'

export const IndicatorsTableBody = ({
    indicators,
    maxColumnsInSection,
    renderRowTotals,
    filterText,
    globalFilterText,
}) => {
    const filteredIndicators = indicators.filter((indicator) => {
        const name = indicator.displayFormName.toLowerCase()
        return (
            (!filterText || name.includes(filterText.toLowerCase())) &&
            (!globalFilterText || name.includes(globalFilterText.toLowerCase()))
        )
    })
    const hiddenItemsCount = indicators.length - filteredIndicators.length
    const nrOfPadColumns = maxColumnsInSection - (renderRowTotals ? 0 : 1)
    const padColumns = nrOfPadColumns > 0 ? Array(nrOfPadColumns).fill(0) : []

    return (
        <TableBody>
            <TableRowHead>
                <TableCellHead className={styles.categoryNameHeader}>
                    {i18n.t('Indicators')}
                </TableCellHead>
                <TableCellHead className={styles.tableHeader}>
                    {i18n.t('Values')}
                </TableCellHead>
                {padColumns.map((_, i) => (
                    <TableCell
                        key={i}
                        className={styles.paddingCell}
                    ></TableCell>
                ))}
            </TableRowHead>

            {filteredIndicators.map((indicator) => {
                return (
                    <TableRow
                        key={indicator.id}
                        dataTest="dhis2-dataentry-indicatorstablerow"
                    >
                        <TableCell className={cx(styles.dataElementName)}>
                            {indicator.displayFormName}
                        </TableCell>
                        <IndicatorTableCell
                            denominator={indicator.denominator}
                            numerator={indicator.numerator}
                            factor={indicator.indicatorType.factor}
                            decimals={indicator.decimals}
                        />
                        {padColumns.map((_, i) => (
                            <TableCell
                                key={i}
                                className={styles.paddingCell}
                                dataTest="dhis2-dataentry-indicatorspaddingcell"
                            ></TableCell>
                        ))}
                    </TableRow>
                )
            })}
            {hiddenItemsCount > 0 && (
                <TableBodyHiddenByFiltersRow
                    hiddenItemsCount={hiddenItemsCount}
                />
            )}
        </TableBody>
    )
}

IndicatorsTableBody.propTypes = {
    indicators: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayFormName: PropTypes.string,
        })
    ).isRequired,
    filterText: PropTypes.string,
    globalFilterText: PropTypes.string,
    maxColumnsInSection: PropTypes.number,
    renderRowTotals: PropTypes.bool,
}
