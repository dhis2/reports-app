import PropTypes from 'prop-types'
import React from 'react'
import {
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    sections,
    STANDARD_REPORT_NEXT_SECTION_KEY,
} from '../../config/sections.config.js'
import styles from './AppShell.module.css'
import { SectionSwitcher } from './SectionSwitcher.jsx'

/*
 * The platform renders the real DHIS2 header bar above this, so the shell owns
 * only the content area — and, for pages that have nowhere better to put it,
 * the section switcher.
 *
 * There is no permanent navigation rail. The nav and a tool's own options panel
 * have very different lifespans: you use the nav once to get into a tool, then
 * never again for the rest of the task, while the options panel is in constant
 * use. Giving both a permanent rail cost roughly 560px of width on every
 * screen, which the report needs more.
 */

/*
 * Prototype-only. Pages listed here manage their own chrome: they host the
 * section switcher themselves (so the shell must not render a second one) and
 * they lay themselves out edge to edge, so the shell hands over the full
 * content area with no padding and an exact height.
 *
 * As the other pages are rebuilt they will do the same, and the switcher bar —
 * along with this constant — goes away entirely.
 */
const SELF_MANAGED_LAYOUT = [
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
]

export const AppShell = ({ showNav, currentSection, children }) => {
    const isSelfManaged = SELF_MANAGED_LAYOUT.includes(currentSection)
    const showSwitcherBar =
        showNav && Boolean(sections[currentSection]) && !isSelfManaged

    return (
        <div
            className={`${styles.shell} ${
                isSelfManaged ? styles.shellFlush : ''
            }`}
        >
            {showSwitcherBar && (
                <div className={styles.switcherBar}>
                    <SectionSwitcher currentSection={currentSection} />
                </div>
            )}

            <div
                className={`${styles.main} ${
                    isSelfManaged ? styles.mainFlush : ''
                }`}
            >
                {children}
            </div>
        </div>
    )
}

AppShell.propTypes = {
    children: PropTypes.node,
    currentSection: PropTypes.string,
    showNav: PropTypes.bool,
}

AppShell.defaultProps = {
    currentSection: '',
    showNav: true,
}

export default AppShell
