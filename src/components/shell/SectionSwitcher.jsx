import i18n from '@dhis2/d2-i18n'
import {
    FlyoutMenu,
    IconChevronDown16,
    IconChevronUp16,
    IconHome16,
    Layer,
    MenuDivider,
    MenuItem,
    MenuSectionHeader,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { sections } from '../../config/sections.config.js'
import { navGroups } from './navigation.js'
import styles from './SectionSwitcher.module.css'

/*
 * The name of the current section, which is also the control that switches to
 * another one. Doing both jobs with one element means the section name is not
 * repeated as a separate page heading, and navigation costs no layout of its
 * own — it lives at the top of whatever panel the page already has.
 *
 * Hand-rolled rather than using DropdownButton because this has to read as a
 * title, not as a button; Layer and Popper are the same primitives
 * DropdownButton uses internally.
 */
export const SectionSwitcher = ({ currentSection }) => {
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const anchor = useRef(null)
    const section = sections[currentSection]

    const goTo = (path) => {
        setOpen(false)
        history.push(path)
    }

    return (
        <div className={styles.wrap}>
            <div ref={anchor}>
                <button
                    type="button"
                    className={styles.button}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <span className={styles.label}>
                        {section ? section.info.label : i18n.t('Reports')}
                    </span>
                    <span className={styles.chevron} aria-hidden="true">
                        {open ? <IconChevronUp16 /> : <IconChevronDown16 />}
                    </span>
                </button>
            </div>

            {open && (
                <Layer transparent onBackdropClick={() => setOpen(false)}>
                    <Popper reference={anchor} placement="bottom-start">
                        <FlyoutMenu dense closeMenu={() => setOpen(false)}>
                            <MenuItem
                                dense
                                icon={<IconHome16 />}
                                label={i18n.t('All reports')}
                                onClick={() => goTo('/')}
                            />

                            {navGroups.map((group) => (
                                <React.Fragment key={group.label}>
                                    <MenuDivider dense />
                                    <MenuSectionHeader
                                        dense
                                        label={group.label}
                                    />
                                    {group.items.map((item) => {
                                        const { Icon } = item

                                        return (
                                            <MenuItem
                                                dense
                                                key={item.key}
                                                active={
                                                    item.key === currentSection
                                                }
                                                icon={
                                                    Icon ? <Icon /> : undefined
                                                }
                                                label={item.label}
                                                onClick={() => goTo(item.path)}
                                            />
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

SectionSwitcher.propTypes = {
    currentSection: PropTypes.string,
}

SectionSwitcher.defaultProps = {
    currentSection: '',
}

export default SectionSwitcher
