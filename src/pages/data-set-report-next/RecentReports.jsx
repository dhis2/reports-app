import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './RecentReports.module.css'

/**
 * The reports this person ran before, offered where they would otherwise be
 * looking at nothing. Picking one refills the rail and runs it.
 *
 * One line per report: the same three things the summary strip names, in the
 * same order, separated by middle dots. The data set carries the weight —
 * it is what you scan the list for; period and place only tell two runs of
 * the same report apart.
 */
export const RecentReports = ({ entries, onSelect }) => {
    if (!entries.length) {
        return null
    }

    return (
        <div className={styles.recent}>
            <h3 className={styles.heading}>
                {i18n.t('Recently created reports')}
            </h3>

            <ul className={styles.list}>
                {entries.map((entry, index) => (
                    <li key={`${entry.dsId}-${entry.pe}-${index}`}>
                        <button
                            type="button"
                            className={styles.item}
                            onClick={() => onSelect(entry)}
                        >
                            <span className={styles.name}>
                                {entry.dataSetName}
                            </span>
                            {[
                                entry.periodName,
                                entry.selectedUnitOnly
                                    ? entry.orgUnitName
                                    : i18n.t('{{orgUnit}} and units inside', {
                                          orgUnit: entry.orgUnitName,
                                      }),
                            ]
                                .filter(Boolean)
                                .map((part) => ` · ${part}`)
                                .join('')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

RecentReports.propTypes = {
    entries: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
}
