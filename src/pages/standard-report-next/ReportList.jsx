import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, InputField, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { needsCaption } from './reportShape.js'
import styles from './StandardReportNext.module.css'

/*
 * The browse half of the rail: find a report among however many the instance
 * has, and pick one.
 *
 * Searching happens here rather than at the server. The whole list is already
 * in memory, so filtering it costs nothing and the results appear as you type
 * — worth more on a list of this kind than paging is.
 */
export const ReportList = ({
    reports,
    loading,
    error,
    canCreate,
    onSelect,
    onCreate,
}) => {
    const [search, setSearch] = useState('')

    const matches = useMemo(() => {
        const term = search.trim().toLowerCase()

        if (!term) {
            return reports
        }

        return reports.filter((report) =>
            report.displayName.toLowerCase().includes(term)
        )
    }, [reports, search])

    return (
        <div className={styles.browse}>
            <div className={styles.searchRow}>
                <InputField
                    dense
                    type="search"
                    label={i18n.t('Search reports')}
                    value={search}
                    onChange={({ value }) => setSearch(value)}
                    placeholder={i18n.t('Search reports')}
                />
            </div>

            <div className={styles.listScroll}>
                {loading && (
                    <div className={styles.listState}>
                        <CircularLoader small />
                    </div>
                )}

                {error && (
                    <div className={styles.listState}>
                        <NoticeBox error>
                            {i18n.t('Could not load the list of reports.')}
                        </NoticeBox>
                    </div>
                )}

                {!loading && !error && matches.length === 0 && (
                    <p className={styles.listEmpty}>
                        {search
                            ? i18n.t('No report matches “{{search}}”.', {
                                  search,
                              })
                            : i18n.t('There are no standard reports yet.')}
                    </p>
                )}

                <ul className={styles.list}>
                    {matches.map((report) => {
                        const caption = needsCaption(report)

                        return (
                            <li key={report.id}>
                                <button
                                    type="button"
                                    className={styles.row}
                                    onClick={() => onSelect(report)}
                                >
                                    <span className={styles.rowName}>
                                        {report.displayName}
                                    </span>
                                    {/*
                                     * What this report will do when clicked.
                                     * Without it a click is a coin flip
                                     * between running the report and being
                                     * asked for parameters.
                                     */}
                                    {caption && (
                                        <span className={styles.rowCaption}>
                                            {caption}
                                        </span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/*
             * Pinned to the foot of the rail rather than sitting above the
             * list: adding a report is rare next to finding one, and a
             * control at the top would push the list down on every visit to
             * serve the once-in-a-while case.
             */}
            {canCreate && (
                <div className={styles.listActions}>
                    <Button secondary onClick={onCreate}>
                        {i18n.t('New standard report…')}
                    </Button>
                </div>
            )}
        </div>
    )
}

ReportList.propTypes = {
    reports: PropTypes.array.isRequired,
    canCreate: PropTypes.bool,
    error: PropTypes.object,
    loading: PropTypes.bool,
    onCreate: PropTypes.func,
    onSelect: PropTypes.func,
}
