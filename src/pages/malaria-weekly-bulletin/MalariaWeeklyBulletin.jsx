import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
    NoticeBox,
    OrganisationUnitTree,
} from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { ReportEmptyState } from '../../components/shell/ReportEmptyState.jsx'
import { ReportRailLayout } from '../../components/shell/ReportRailLayout.jsx'
import railStyles from '../../components/shell/ReportRailLayout.module.css'
import { MALARIA_WEEKLY_BULLETIN_SECTION_KEY } from '../../config/sections.config.js'
import { AGE_BANDS, buildBulletin, delta, thisWeek } from './bulletinData.js'
import styles from './MalariaWeeklyBulletin.module.css'
import { idFromPath, ORG_UNIT_ROOTS_QUERY } from './queries.js'
import { TrendChart } from './TrendChart.jsx'

/*
 * The second plugin example.
 *
 * A weekly malaria surveillance bulletin — the printed one-pager a district
 * team emails round every Monday. It is a normal route reusing the shared
 * frame: the rail hosts a live org unit tree and an epi-week picker, and the
 * output pane is a bulletin sheet — a narrative lead, a row of stat tiles with
 * sparklines, a trend chart, and an age breakdown. The org unit is real; every
 * case count is invented in the browser (see bulletinData.js).
 */

/* A signed percentage for the delta chips, e.g. -12% / +8%. */
const pctChange = (fraction) =>
    `${fraction > 0 ? '+' : ''}${Math.round(fraction * 100)}%`

/* The one-line story at the top of the sheet. */
const leadSentence = (bulletin) => {
    const { current, previous } = bulletin
    const change = delta(current.confirmed, previous?.confirmed)
    const positivity = Math.round(current.positivity * 100)

    const trend =
        change === null || Math.abs(change) < 0.02
            ? i18n.t('about level with the week before')
            : change > 0
            ? i18n.t('up {{pct}} on the week before', {
                  pct: pctChange(change),
              })
            : i18n.t('down {{pct}} on the week before', {
                  pct: pctChange(-change),
              })

    return i18n.t(
        '{{confirmed}} confirmed cases, {{trend}}. Test positivity {{positivity}}%.',
        { confirmed: current.confirmed, trend, positivity }
    )
}

export const MalariaWeeklyBulletin = () => {
    /* The rail's selection: an org unit (path + name) and an epi-week. */
    const [ou, setOu] = useState(null)
    const [week, setWeek] = useState(thisWeek)

    const [bulletin, setBulletin] = useState(null)

    const rootsQuery = useDataQuery(ORG_UNIT_ROOTS_QUERY)
    const roots = useMemo(() => {
        const me = rootsQuery.data?.me
        const units = me?.dataViewOrganisationUnits?.length
            ? me.dataViewOrganisationUnits
            : me?.organisationUnits ?? []
        return units.map((unit) => unit.id)
    }, [rootsQuery.data])

    const canGenerate = Boolean(ou && week)

    const onGenerate = (event) => {
        event?.preventDefault()
        if (canGenerate) {
            setBulletin(
                buildBulletin(idFromPath(ou.path), ou.displayName, week)
            )
        }
    }

    const onClear = () => {
        setOu(null)
        setWeek(thisWeek())
        setBulletin(null)
    }

    const isStale = Boolean(
        bulletin &&
            (bulletin.orgUnitId !== idFromPath(ou?.path) ||
                bulletin.week !== week)
    )

    /* The tiles across the top, each with its own sparkline series and — where
     * a rise is a bad thing — a red/green delta. */
    const tiles = useMemo(() => {
        if (!bulletin) {
            return []
        }
        const { current, previous, series } = bulletin
        return [
            {
                key: 'suspected',
                label: i18n.t('Suspected'),
                value: current.suspected,
                change: delta(current.suspected, previous?.suspected),
            },
            {
                key: 'tested',
                label: i18n.t('Tested'),
                value: current.tested,
                change: delta(current.tested, previous?.tested),
            },
            {
                key: 'confirmed',
                label: i18n.t('Confirmed'),
                value: current.confirmed,
                change: delta(current.confirmed, previous?.confirmed),
            },
            {
                key: 'positivity',
                label: i18n.t('Positivity'),
                value: `${Math.round(current.positivity * 100)}%`,
                change: delta(current.positivity, previous?.positivity),
            },
            {
                key: 'deaths',
                label: i18n.t('Deaths'),
                value: current.deaths,
                change: delta(current.deaths, previous?.deaths),
            },
        ]
    }, [bulletin])

    const actions = bulletin ? (
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
                            {i18n.t('Organisation unit')}
                        </h3>
                        <div className={railStyles.treeCard}>
                            <div className={railStyles.treeBox}>
                                {rootsQuery.loading && <CircularLoader small />}
                                {rootsQuery.error && (
                                    <NoticeBox error>
                                        {i18n.t(
                                            'Could not load organisation units.'
                                        )}
                                    </NoticeBox>
                                )}
                                {!rootsQuery.loading && roots.length > 0 && (
                                    <OrganisationUnitTree
                                        roots={roots}
                                        singleSelection
                                        selected={ou ? [ou.path] : []}
                                        initiallyExpanded={roots.map(
                                            (id) => `/${id}`
                                        )}
                                        onChange={({ path, displayName }) =>
                                            setOu({ path, displayName })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={railStyles.group}>
                        <h3 className={railStyles.groupTitle}>
                            {i18n.t('Epidemiological week')}
                        </h3>
                        <input
                            className={styles.weekInput}
                            type="week"
                            value={week}
                            max={thisWeek()}
                            onChange={(event) => setWeek(event.target.value)}
                        />
                    </section>
                </div>

                <div className={railStyles.railActions}>
                    <Button primary type="submit" disabled={!canGenerate}>
                        {i18n.t('Get bulletin')}
                    </Button>
                    <Button small secondary onClick={onClear}>
                        {i18n.t('Clear')}
                    </Button>
                </div>
            </div>
        </form>
    )

    const current = bulletin?.current

    return (
        <ReportRailLayout
            sectionKey={MALARIA_WEEKLY_BULLETIN_SECTION_KEY}
            railTitle={i18n.t('Configure bulletin')}
            actions={actions}
            staleNote={
                bulletin && isStale
                    ? i18n.t('Not updated with latest options')
                    : undefined
            }
            rail={rail}
        >
            {!bulletin && <ReportEmptyState />}

            {bulletin && (
                <div
                    className={`${railStyles.reportCard} ${
                        isStale ? railStyles.staleOutput : ''
                    }`}
                >
                    {/*
                     * The sheet is a fixed-width page, so it is the region
                     * around it that scrolls — the card itself stays put.
                     */}
                    <div className={railStyles.reportScroll}>
                        <article className={styles.sheet}>
                            {/* ---------------- doc header ---------------- */}
                            <header className={styles.docHeader}>
                                <div className={styles.docHeaderTop}>
                                    <div>
                                        <p className={styles.docOrg}>
                                            {i18n.t(
                                                'National Malaria Control Programme'
                                            )}
                                        </p>
                                        <p className={styles.docTitle}>
                                            {i18n.t(
                                                'Weekly Malaria Surveillance Bulletin'
                                            )}
                                        </p>
                                    </div>
                                    <p className={styles.docRef}>
                                        MAL-WSB-
                                        {String(current.week).padStart(2, '0')}/
                                        {current.year}
                                    </p>
                                </div>
                            </header>

                            {/* --- meta fields --- */}
                            <table className={styles.metaTable}>
                                <tbody>
                                    <tr>
                                        <td className={styles.metaLabel}>
                                            {i18n.t('Reporting unit')}
                                        </td>
                                        <td className={styles.metaValue}>
                                            {bulletin.orgUnitName}
                                        </td>
                                        <td className={styles.metaLabel}>
                                            {i18n.t('Epi week')}
                                        </td>
                                        <td className={styles.metaValue}>
                                            {i18n.t('W{{week}} / {{year}}', {
                                                week: current.week,
                                                year: current.year,
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={styles.metaLabel}>
                                            {i18n.t('Prepared by')}
                                        </td>
                                        <td className={styles.metaValue}>
                                            {'_____________________'}
                                        </td>
                                        <td className={styles.metaLabel}>
                                            {i18n.t('Date')}
                                        </td>
                                        <td className={styles.metaValue}>
                                            {'____/____/________'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* --- 1. summary --- */}
                            <h2 className={styles.sectionHead}>
                                {i18n.t('1. Summary')}
                            </h2>
                            <p className={styles.bodyText}>
                                {leadSentence(bulletin)}
                            </p>

                            {/* --- 2. key indicators --- */}
                            <h2 className={styles.sectionHead}>
                                {i18n.t('2. Key indicators')}
                            </h2>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>{i18n.t('Indicator')}</th>
                                        <th>{i18n.t('This week')}</th>
                                        <th>{i18n.t('Prev. week')}</th>
                                        <th>{i18n.t('% change')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tiles.map((tile) => {
                                        const hasChange =
                                            tile.change !== null &&
                                            Math.abs(tile.change) >= 0.005
                                        return (
                                            <tr key={tile.key}>
                                                <td>{tile.label}</td>
                                                <td className={styles.numCell}>
                                                    {tile.value}
                                                </td>
                                                <td className={styles.numCell}>
                                                    {tile.key === 'positivity'
                                                        ? bulletin.previous
                                                            ? `${Math.round(
                                                                  bulletin
                                                                      .previous
                                                                      .positivity *
                                                                      100
                                                              )}%`
                                                            : '—'
                                                        : bulletin.previous?.[
                                                              tile.key
                                                          ] ?? '—'}
                                                </td>
                                                <td className={styles.numCell}>
                                                    {hasChange
                                                        ? pctChange(tile.change)
                                                        : '—'}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {/* --- 3. trend --- */}
                            <h2 className={styles.sectionHead}>
                                {i18n.t(
                                    '3. Confirmed cases — last {{n}} weeks',
                                    {
                                        n: bulletin.series.length,
                                    }
                                )}
                            </h2>
                            <TrendChart series={bulletin.series} />

                            {/* --- 4. age breakdown --- */}
                            <h2 className={styles.sectionHead}>
                                {i18n.t('4. Confirmed cases by age group')}
                            </h2>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>{i18n.t('Age group')}</th>
                                        <th>{i18n.t('Cases')}</th>
                                        <th>{i18n.t('% of total')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AGE_BANDS.map((band) => {
                                        const count = current.ages[band.key]
                                        const pct = current.confirmed
                                            ? Math.round(
                                                  (count / current.confirmed) *
                                                      100
                                              )
                                            : 0
                                        return (
                                            <tr key={band.key}>
                                                <td>{band.label}</td>
                                                <td className={styles.numCell}>
                                                    {count}
                                                </td>
                                                <td className={styles.numCell}>
                                                    {pct}%
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr className={styles.totalRow}>
                                        <td>
                                            <strong>{i18n.t('Total')}</strong>
                                        </td>
                                        <td className={styles.numCell}>
                                            <strong>{current.confirmed}</strong>
                                        </td>
                                        <td className={styles.numCell}>
                                            <strong>100%</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* --- 5. sign-off --- */}
                            <h2 className={styles.sectionHead}>
                                {i18n.t('5. Review and approval')}
                            </h2>
                            <table className={styles.signTable}>
                                <thead>
                                    <tr>
                                        <th>{i18n.t('Role')}</th>
                                        <th>{i18n.t('Name')}</th>
                                        <th>{i18n.t('Signature')}</th>
                                        <th>{i18n.t('Date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {i18n.t('Surveillance Officer')}
                                        </td>
                                        <td />
                                        <td />
                                        <td />
                                    </tr>
                                    <tr>
                                        <td>
                                            {i18n.t('District Medical Officer')}
                                        </td>
                                        <td />
                                        <td />
                                        <td />
                                    </tr>
                                </tbody>
                            </table>

                            <p className={styles.footer}>
                                {i18n.t(
                                    'CONFIDENTIAL — For official use only. Compiled from routine HMIS surveillance data.'
                                )}
                            </p>
                        </article>
                    </div>
                </div>
            )}
        </ReportRailLayout>
    )
}
