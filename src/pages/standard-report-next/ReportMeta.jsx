import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { exactTime, timeAgo } from './relativeTime.js'
import styles from './StandardReportNext.module.css'

/*
 * Where this report came from, under the options that run it.
 *
 * A standard report is written by someone in your organisation rather than by
 * the app, so who wrote it and how long ago is part of deciding whether to
 * trust the numbers it produces — a report last touched five years ago is a
 * different proposition from one changed last week.
 *
 * Deliberately at the foot of the rail: it informs the choice, it is not part
 * of making it.
 */
export const ReportMeta = ({ report }) => {
    /*
     * DHIS2 timestamps are written in the server's timezone and carry no
     * offset, so reading them as local time makes something saved minutes ago
     * look hours old. app-runtime knows the server's zone; let it convert.
     */
    const { fromServerDate } = useTimeZoneConversion()

    const created = report.created ? fromServerDate(report.created) : null
    const updated = report.lastUpdated
        ? fromServerDate(report.lastUpdated)
        : null

    const createdBy = report.createdBy?.displayName
    const updatedBy = report.lastUpdatedBy?.displayName

    const createdAgo = timeAgo(created)
    const updatedAgo = timeAgo(updated)

    if (!createdAgo && !updatedAgo) {
        return null
    }

    /*
     * Saying "changed" a second time when nothing has happened since it was
     * written is noise — the two timestamps are identical on a report nobody
     * has touched.
     */
    const changed = updatedAgo && report.lastUpdated !== report.created

    return (
        <dl className={styles.meta}>
            {createdAgo && (
                <div className={styles.metaRow}>
                    <dt>{i18n.t('Created')}</dt>
                    <dd title={exactTime(created)}>
                        {createdBy
                            ? i18n.t('{{when}} by {{who}}', {
                                  when: createdAgo,
                                  who: createdBy,
                              })
                            : createdAgo}
                    </dd>
                </div>
            )}

            {changed && (
                <div className={styles.metaRow}>
                    <dt>{i18n.t('Last changed')}</dt>
                    <dd title={exactTime(updated)}>
                        {updatedBy
                            ? i18n.t('{{when}} by {{who}}', {
                                  when: updatedAgo,
                                  who: updatedBy,
                              })
                            : updatedAgo}
                    </dd>
                </div>
            )}
        </dl>
    )
}

ReportMeta.propTypes = {
    report: PropTypes.object.isRequired,
}
