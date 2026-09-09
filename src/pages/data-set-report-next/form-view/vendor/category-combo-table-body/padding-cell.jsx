import { TableCell } from '@dhis2/ui'
import React from 'react'
import styles from '../table-body.module.css'

export const PaddingCell = () => (
    <TableCell
        className={styles.paddingCell}
        dataTest="dhis2-dataentry-paddingcell"
    />
)

export default PaddingCell
