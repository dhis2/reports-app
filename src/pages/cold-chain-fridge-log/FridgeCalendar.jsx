import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ColdChainFridgeLog.module.css'
import { DAY_STATUS } from './fridgeData.js'

/*
 * A month as a grid: one cell per day, coloured by whether the fridge stayed
 * in range. This is the output the core reports would never render — a
 * logbook, not a table — which is the whole point of the plugin example.
 *
 * Weeks run Monday–Sunday. getDay() is 0 for Sunday, so the lead offset is
 * (weekday + 6) % 7: Monday → 0 empty cells before it, Sunday → 6.
 */
const WEEKDAY_LABELS = [
    i18n.t('Mon'),
    i18n.t('Tue'),
    i18n.t('Wed'),
    i18n.t('Thu'),
    i18n.t('Fri'),
    i18n.t('Sat'),
    i18n.t('Sun'),
]

const cellClass = (status) => {
    switch (status) {
        case DAY_STATUS.COLD:
            return styles.dayCold
        case DAY_STATUS.WARM:
            return styles.dayWarm
        case DAY_STATUS.MISSING:
            return styles.dayMissing
        default:
            return styles.dayOk
    }
}

export const FridgeCalendar = ({ log }) => {
    const leadOffset = (log.days[0].weekday + 6) % 7

    return (
        <div className={styles.calendar}>
            <div className={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className={styles.weekday}>
                        {label}
                    </div>
                ))}
            </div>

            <div className={styles.grid}>
                {/* Blank cells so day 1 lands under its weekday. */}
                {Array.from({ length: leadOffset }).map((_, i) => (
                    <div key={`lead-${i}`} className={styles.dayEmpty} />
                ))}

                {log.days.map((day) => (
                    <div
                        key={day.day}
                        className={`${styles.day} ${cellClass(day.status)}`}
                        title={day.note || undefined}
                    >
                        <span className={styles.dayNumber}>{day.day}</span>
                        {day.status === DAY_STATUS.MISSING ? (
                            <span className={styles.dayReading}>
                                {i18n.t('—')}
                            </span>
                        ) : (
                            <span className={styles.dayReading}>
                                {day.min}–{day.max}°
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
                <span className={styles.legendItem}>
                    <span
                        className={`${styles.swatch} ${styles.dayOk}`}
                        aria-hidden="true"
                    />
                    {i18n.t('In range (2–8 °C)')}
                </span>
                <span className={styles.legendItem}>
                    <span
                        className={`${styles.swatch} ${styles.dayCold}`}
                        aria-hidden="true"
                    />
                    {i18n.t('Too cold')}
                </span>
                <span className={styles.legendItem}>
                    <span
                        className={`${styles.swatch} ${styles.dayWarm}`}
                        aria-hidden="true"
                    />
                    {i18n.t('Too warm')}
                </span>
                <span className={styles.legendItem}>
                    <span
                        className={`${styles.swatch} ${styles.dayMissing}`}
                        aria-hidden="true"
                    />
                    {i18n.t('No reading')}
                </span>
            </div>
        </div>
    )
}

FridgeCalendar.propTypes = {
    log: PropTypes.shape({
        days: PropTypes.arrayOf(
            PropTypes.shape({
                day: PropTypes.number,
                weekday: PropTypes.number,
                min: PropTypes.number,
                max: PropTypes.number,
                status: PropTypes.string,
                note: PropTypes.string,
            })
        ),
    }).isRequired,
}
