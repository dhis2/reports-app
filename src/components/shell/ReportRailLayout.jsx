import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { RailToggleIcon } from './RailToggleIcon.jsx'
import styles from './ReportRailLayout.module.css'
import { ReportBreadcrumb } from './ReportBreadcrumb.jsx'

/*
 * Whether the options rail is collapsed is a per-viewer preference, not part
 * of what the report is — so it is remembered locally and deliberately kept
 * out of the URL, which stays a description of the report itself.
 *
 * The key is passed in rather than derived, so two pages sharing this layout
 * do not share one another's preference.
 */
const readCollapsed = (key) => {
    try {
        return window.localStorage.getItem(key) === '1'
    } catch {
        return false
    }
}

const writeCollapsed = (key, collapsed) => {
    try {
        window.localStorage.setItem(key, collapsed ? '1' : '0')
    } catch {
        // A remembered preference is a convenience, never worth an error.
    }
}

/**
 * The chrome shared by the redesigned report pages: a top bar carrying the
 * section switcher and the actions for what is on screen, a collapsible
 * options rail, and a report column that scrolls on its own.
 *
 * The page supplies the rail's contents and the report; everything about the
 * frame — the collapse behaviour, the stale badge's anchoring, the print and
 * narrow-screen rules — lives here. Pages import `ReportRailLayout.module.css`
 * alongside their own stylesheet, because filling in the rail means using its
 * vocabulary (`.railForm`, `.railScroll`, `.group`, `.railActions`).
 *
 * Requires the page's section to be listed in AppShell's SELF_MANAGED_LAYOUT,
 * which is what hands it the full content area at an exact height.
 */
export const ReportRailLayout = ({
    sectionKey,
    railTitle,
    railStorageKey,
    actions,
    staleNote,
    rail,
    children,
}) => {
    const [collapsed, setCollapsed] = useState(() =>
        readCollapsed(railStorageKey)
    )

    const toggle = () =>
        setCollapsed((current) => {
            writeCollapsed(railStorageKey, !current)
            return !current
        })

    return (
        <div className={styles.page}>
            {/* ---------------- top bar ---------------- */}
            <header className={styles.topbar}>
                {/*
                 * Where you are: the trail back to the report list.
                 */}
                <ReportBreadcrumb currentSection={sectionKey} />

                {actions && (
                    <div className={styles.topbarActions}>{actions}</div>
                )}
            </header>

            <div
                className={`${styles.work} ${
                    collapsed ? styles.workRailCollapsed : ''
                }`}
            >
                {/* ---------------- options rail ---------------- */}
                <aside
                    className={`${styles.rail} ${
                        collapsed ? styles.railCollapsed : ''
                    }`}
                >
                    {/*
                     * The panel says what it is, and carries the control that
                     * puts it away. The rule under it runs the full width of
                     * the rail, so the header reads as the panel's own bar
                     * rather than as a first row of options.
                     */}
                    <div className={styles.railHeader}>
                        <h2 className={styles.railTitle}>{railTitle}</h2>
                        <button
                            type="button"
                            className={styles.railToggle}
                            onClick={toggle}
                            aria-expanded={!collapsed}
                            aria-controls="report-options"
                            title={
                                collapsed
                                    ? i18n.t('Show report options')
                                    : i18n.t('Hide report options')
                            }
                        >
                            <RailToggleIcon collapsed={collapsed} />
                            <span className={styles.visuallyHidden}>
                                {collapsed
                                    ? i18n.t('Show report options')
                                    : i18n.t('Hide report options')}
                            </span>
                        </button>
                    </div>

                    <div id="report-options" className={styles.railBody}>
                        {rail}
                    </div>
                </aside>

                {/* ---------------- output ---------------- */}
                <div className={styles.outputPane}>
                    {/*
                     * Tagged onto the top of the output rather than announced
                     * inside it. Changing an option is the ordinary start of
                     * the next report, not a fault, so this labels what is on
                     * screen instead of raising an alert about it.
                     *
                     * It lives outside .output because .output is the scroll
                     * container, which clips anything hanging over its edge —
                     * and out here it also stays put while the report scrolls.
                     */}
                    {staleNote && (
                        <span className={styles.staleBadge}>{staleNote}</span>
                    )}

                    <section className={styles.output}>{children}</section>
                </div>
            </div>
        </div>
    )
}

ReportRailLayout.propTypes = {
    /** The rail's contents — normally the page's <form>. */
    rail: PropTypes.node.isRequired,
    /** Preference key for the collapsed state; unique per page. */
    railStorageKey: PropTypes.string.isRequired,
    /** Heading for the options panel. */
    railTitle: PropTypes.string.isRequired,
    /** Section key, for the switcher in the top bar. */
    sectionKey: PropTypes.string.isRequired,
    /** Top bar actions for whatever is on screen; omitted when there is none. */
    actions: PropTypes.node,
    /** The report itself. */
    children: PropTypes.node,
    /** Text for the badge shown when the output no longer matches the form. */
    staleNote: PropTypes.string,
}
