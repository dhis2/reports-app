import i18n from '@dhis2/d2-i18n'
import { TableCell, TableRow } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './table-body.module.css'

export const TableBodyHiddenByFiltersRow = ({ hiddenItemsCount }) => (
    <TableRow>
        <TableCell className={styles.hiddenByFilterCell} colSpan="100%">
            {hiddenItemsCount === 1
                ? i18n.t('1 item hidden by filter')
                : i18n.t('{{count}} items hidden by filter', {
                      count: hiddenItemsCount,
                  })}
        </TableCell>
    </TableRow>
)

TableBodyHiddenByFiltersRow.propTypes = {
    hiddenItemsCount: PropTypes.number.isRequired,
}
