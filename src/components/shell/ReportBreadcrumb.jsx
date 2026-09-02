import i18n from '@dhis2/d2-i18n'
import { IconChevronRight16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { sections } from '../../config/sections.config.js'
import styles from './ReportBreadcrumb.module.css'

/*
 * Where you are, as a trail: "Reports" — the home page, and the way back to it
 * — then the section you are in. The current section is plain text rather than
 * a control; switching section is what the home page is for, so the bar says
 * where you are instead of doubling as navigation.
 */
export const ReportBreadcrumb = ({ currentSection }) => {
    const section = sections[currentSection]

    return (
        <nav className={styles.wrap} aria-label={i18n.t('Breadcrumb')}>
            <Link className={styles.root} to="/">
                {i18n.t('Reports')}
            </Link>

            {section && (
                <>
                    <span className={styles.separator} aria-hidden="true">
                        <IconChevronRight16 />
                    </span>
                    <span className={styles.current} aria-current="page">
                        {section.info.label}
                    </span>
                </>
            )}
        </nav>
    )
}

ReportBreadcrumb.propTypes = {
    currentSection: PropTypes.string,
}

ReportBreadcrumb.defaultProps = {
    currentSection: '',
}

export default ReportBreadcrumb
