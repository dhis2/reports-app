import i18n from '@dhis2/d2-i18n'
import {
    FlyoutMenu,
    IconEdit16,
    IconMore16,
    IconShare16,
    Layer,
    MenuItem,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import styles from './StandardReportNext.module.css'

/*
 * Per-row management, for people who have it.
 *
 * The same two actions live in the rail once a report is open. Having them in
 * the list as well is what makes it a management surface rather than only a
 * picker: an admin tidying up several reports should not have to open each
 * one to get at its settings.
 *
 * Hand-rolled on Layer and Popper rather than DropdownButton, because the
 * trigger has to be an icon with no label — the same reason ReportBreadcrumb
 * does it this way.
 */
export const ReportRowMenu = ({ report, onEdit, onShare }) => {
    const [open, setOpen] = useState(false)
    const anchor = useRef(null)

    const access = report.access ?? {}
    const canEdit = Boolean(access.update)
    const canShare = Boolean(access.manage || access.externalize)

    /* Nothing to offer, so no affordance suggesting there is. */
    if (!canEdit && !canShare) {
        return null
    }

    const choose = (action) => {
        setOpen(false)
        action(report)
    }

    return (
        <div ref={anchor} className={styles.rowMenu}>
            <button
                type="button"
                className={styles.rowMenuButton}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                <IconMore16 />
                <span className={styles.visuallyHidden}>
                    {i18n.t('Actions for {{name}}', {
                        name: report.displayName,
                    })}
                </span>
            </button>

            {open && (
                <Layer transparent onBackdropClick={() => setOpen(false)}>
                    <Popper reference={anchor} placement="bottom-end">
                        <FlyoutMenu dense closeMenu={() => setOpen(false)}>
                            {canEdit && (
                                <MenuItem
                                    dense
                                    icon={<IconEdit16 />}
                                    label={i18n.t('Edit report…')}
                                    onClick={() => choose(onEdit)}
                                />
                            )}
                            {canShare && (
                                <MenuItem
                                    dense
                                    icon={<IconShare16 />}
                                    label={i18n.t('Manage sharing…')}
                                    onClick={() => choose(onShare)}
                                />
                            )}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

ReportRowMenu.propTypes = {
    report: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
}
