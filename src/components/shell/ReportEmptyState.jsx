import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './ReportEmptyState.module.css'

/**
 * What the output side shows before a report has been run.
 *
 * A drawing rather than an explanation: the rail beside it already names every
 * option, so prose here would only read them back. The picture is a report
 * page with the options still blank — it says "this is where the report will
 * be" without asking to be read.
 */
export const ReportEmptyState = () => (
    <div className={styles.empty}>
        <svg
            className={styles.art}
            viewBox="0 0 96 96"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="20"
                y="12"
                width="56"
                height="72"
                rx="4"
                fill="var(--white)"
                stroke="var(--grey400)"
                strokeWidth="2"
            />
            {/* The title line of a report that has not been filled in yet. */}
            <rect
                x="30"
                y="26"
                width="26"
                height="4"
                rx="2"
                fill="var(--grey400)"
            />
            <rect
                x="30"
                y="40"
                width="36"
                height="3"
                rx="1.5"
                fill="var(--grey300)"
            />
            <rect
                x="30"
                y="50"
                width="36"
                height="3"
                rx="1.5"
                fill="var(--grey300)"
            />
            <rect
                x="30"
                y="60"
                width="22"
                height="3"
                rx="1.5"
                fill="var(--grey300)"
            />
        </svg>

        <p className={styles.message}>
            {i18n.t('Configure and create a report to get started.')}
        </p>
    </div>
)
