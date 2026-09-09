import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './StandardReportNext.module.css'

/*
 * Per-row management, for people who have it.
 *
 * Spelled out as buttons rather than hidden behind a three-dot menu: this is
 * a management table, the row is wide enough to say what it offers, and every
 * action here is one click from the list instead of two.
 *
 * An action the current user cannot perform is left out rather than disabled —
 * a greyed-out row of controls says nothing useful about why.
 */
export const ReportRowActions = ({
    report,
    onView,
    onEdit,
    onShare,
    onDelete,
}) => {
    const access = report.access ?? {}
    const canEdit = Boolean(access.update)
    const canShare = Boolean(access.manage || access.externalize)
    const canDelete = Boolean(access.delete)

    return (
        <div className={styles.rowActions}>
            <Button small secondary onClick={() => onView(report)}>
                {i18n.t('View')}
            </Button>
            {canEdit && (
                <Button small secondary onClick={() => onEdit(report)}>
                    {i18n.t('Edit')}
                </Button>
            )}
            {canShare && (
                <Button small secondary onClick={() => onShare(report)}>
                    {i18n.t('Share')}
                </Button>
            )}
            {canDelete && (
                <Button small secondary onClick={() => onDelete(report)}>
                    {i18n.t('Delete')}
                </Button>
            )}
        </div>
    )
}

ReportRowActions.propTypes = {
    report: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
}

export default ReportRowActions
