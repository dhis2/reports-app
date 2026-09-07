import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconDownload24,
    NoticeBox,
    SingleSelectField,
    SingleSelectOption,
    Tooltip,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { ReportEmptyState } from '../../components/shell/ReportEmptyState.jsx'
import { ReportRailLayout } from '../../components/shell/ReportRailLayout.jsx'
import railStyles from '../../components/shell/ReportRailLayout.module.css'
import { COLD_CHAIN_FRIDGE_LOG_SECTION_KEY } from '../../config/sections.config.js'
import styles from './ColdChainFridgeLog.module.css'
import { DayTrace } from './DayTrace.jsx'
import { FridgeCalendar } from './FridgeCalendar.jsx'
import { buildFridgeLog, FACILITIES, DAY_STATUS } from './fridgeData.js'

/*
 * The plugin example.
 *
 * A cold-chain fridge log — the kind of niche report a local immunisation team
 * might build for its own use and ship as a "report plugin", not something the
 * core app would ever carry. It is a normal route like the others, and it
 * borrows the shared frame: the rail hosts its two questions, the output pane
 * shows a month calendar of temperatures. All of its data is invented in the
 * browser (see fridgeData.js) — there is no real cold-chain API behind it.
 */

/* The month input wants YYYY-MM; default to the current month. */
const thisMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const monthLabel = (log) =>
    new Date(log.year, log.monthNo - 1, 1).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
    })

/* How the day of an excursion is written in the list beneath the calendar. */
const excursionDate = (date) =>
    date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/* The heading over an opened day's trace, e.g. "Tuesday 12 September". */
const dayLabel = (dayObj) =>
    dayObj.date.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })

export const ColdChainFridgeLog = () => {
    const [facilityId, setFacilityId] = useState(FACILITIES[0].id)
    const [month, setMonth] = useState(thisMonth)

    /*
     * The report is a snapshot taken when "Get log" is pressed, not a live view
     * of the rail — same as the other redesigned pages, so the badge and the
     * summary describe what is on screen rather than the current form.
     */
    const [log, setLog] = useState(null)

    /* Which day's hourly trace is open beneath the calendar, if any. Per-view
     * state, not part of the report — cleared whenever a new log is built. */
    const [selectedDay, setSelectedDay] = useState(null)

    const canGenerate = Boolean(facilityId && month)

    const onGenerate = (event) => {
        event?.preventDefault()
        if (canGenerate) {
            setLog(buildFridgeLog(facilityId, month))
            setSelectedDay(null)
        }
    }

    const onClear = () => {
        setFacilityId(FACILITIES[0].id)
        setMonth(thisMonth())
        setLog(null)
        setSelectedDay(null)
    }

    const isStale = Boolean(
        log && (log.facility.id !== facilityId || log.month !== month)
    )

    /* The opened day, resolved against the current log. A day with no hourly
     * trace (a missing day) is never openable, so this is always chartable. */
    const selectedDayObj =
        log && selectedDay
            ? log.days.find(
                  (day) => day.day === selectedDay && day.hourly
              )
            : null

    const actions = log ? (
        <Button small onClick={() => window.print()}>
            {i18n.t('Print')}
        </Button>
    ) : null

    const rail = (
        <form className={railStyles.railForm} onSubmit={onGenerate}>
            <div className={railStyles.railScroll}>
                <div className={railStyles.railFields}>
                    <section className={railStyles.group}>
                        <h3 className={railStyles.groupTitle}>
                            {i18n.t('Facility')}
                        </h3>
                        <SingleSelectField
                            dense
                            selected={facilityId}
                            onChange={({ selected }) =>
                                setFacilityId(selected)
                            }
                        >
                            {FACILITIES.map((facility) => (
                                <SingleSelectOption
                                    key={facility.id}
                                    label={facility.name}
                                    value={facility.id}
                                />
                            ))}
                        </SingleSelectField>
                    </section>

                    <section className={railStyles.group}>
                        <h3 className={railStyles.groupTitle}>
                            {i18n.t('Month')}
                        </h3>
                        {/*
                         * A native month input — the app's UI kit has no month
                         * picker, and for a throwaway this is exactly enough.
                         */}
                        <input
                            className={styles.monthInput}
                            type="month"
                            value={month}
                            max={thisMonth()}
                            onChange={(event) => setMonth(event.target.value)}
                        />
                    </section>
                </div>

                <div className={railStyles.railActions}>
                    <Button
                        primary
                        type="submit"
                        disabled={!canGenerate}
                    >
                        {i18n.t('Get log')}
                    </Button>
                    <Button small secondary onClick={onClear}>
                        {i18n.t('Clear')}
                    </Button>
                </div>
            </div>
        </form>
    )

    return (
        <ReportRailLayout
            sectionKey={COLD_CHAIN_FRIDGE_LOG_SECTION_KEY}
            railTitle={i18n.t('Configure log')}
            railStorageKey="reports-app:cold-chain-fridge-log:rail-collapsed"
            actions={actions}
            staleNote={
                log && isStale
                    ? i18n.t('Not updated with latest options')
                    : undefined
            }
            rail={rail}
        >
            {!log && <ReportEmptyState />}

            {log && (
                <div className={isStale ? railStyles.staleOutput : undefined}>
                    <div className={railStyles.summary}>
                        <p className={railStyles.summaryLine}>
                            {log.facility.name} · {monthLabel(log)}
                        </p>
                        <p className={styles.summaryDetail}>
                            {log.excursions.length === 0
                                ? i18n.t('{{count}} days logged · no breaches', {
                                      count: log.logged,
                                  })
                                : i18n.t(
                                      '{{count}} days logged · {{breaches}} breach(es)',
                                      {
                                          count: log.logged,
                                          breaches: log.excursions.length,
                                      }
                                  )}
                            {log.missing > 0 &&
                                ` · ${i18n.t('{{count}} day(s) missing', {
                                    count: log.missing,
                                })}`}
                        </p>
                    </div>

                    <div className={styles.body}>
                        <FridgeCalendar
                            log={log}
                            selectedDay={selectedDay}
                            onSelectDay={setSelectedDay}
                        />

                        {selectedDayObj && (
                            <section className={styles.trace}>
                                <div className={styles.traceHead}>
                                    <div>
                                        <h3 className={styles.traceTitle}>
                                            {dayLabel(selectedDayObj)}
                                        </h3>
                                        <p className={styles.traceSub}>
                                            {i18n.t(
                                                'Low {{min}} °C · High {{max}} °C',
                                                {
                                                    min: selectedDayObj.min,
                                                    max: selectedDayObj.max,
                                                }
                                            )}
                                        </p>
                                    </div>
                                    {/*
                                     * The hint that this is an application, not
                                     * a printed report: an action a plugin can
                                     * offer that an HTML template never could.
                                     * Inert in the prototype — it only has to
                                     * suggest the possibility.
                                     */}
                                    <Tooltip
                                        content={i18n.t(
                                            'Prototype — a plugin could push these readings back into DHIS2 as data values.'
                                        )}
                                    >
                                        <Button
                                            small
                                            icon={<IconDownload24 />}
                                            onClick={() => {}}
                                        >
                                            {i18n.t('Import as data elements…')}
                                        </Button>
                                    </Tooltip>
                                </div>

                                <DayTrace hourly={selectedDayObj.hourly} />
                            </section>
                        )}

                        {log.excursions.length > 0 ? (
                            <section className={styles.excursions}>
                                <h3 className={styles.excursionsTitle}>
                                    {i18n.t('Cold chain breaches')}
                                </h3>
                                <ul className={styles.excursionList}>
                                    {log.excursions.map((e) => (
                                        <li
                                            key={e.day}
                                            className={styles.excursionItem}
                                        >
                                            <span
                                                className={`${styles.dot} ${
                                                    e.status === DAY_STATUS.WARM
                                                        ? styles.dotWarm
                                                        : styles.dotCold
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={styles.excursionDate}
                                            >
                                                {excursionDate(e.date)}
                                            </span>
                                            <span
                                                className={styles.excursionNote}
                                            >
                                                {e.note}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ) : (
                            <NoticeBox
                                valid
                                title={i18n.t('No cold chain breaches')}
                            >
                                {i18n.t(
                                    'The fridge stayed between 2 °C and 8 °C every day it was logged.'
                                )}
                            </NoticeBox>
                        )}
                    </div>
                </div>
            )}
        </ReportRailLayout>
    )
}
