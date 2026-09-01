import { Card } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './MenuElement.module.css'
import { sectionIcon, sectionQuestion } from './shell/navigation.js'

/**
 * A section card on the landing page.
 *
 * Was a @material-ui/core Paper with a 50px icon-font glyph and 38px of
 * hard-coded margin. Now a @dhis2/ui Card with a real icon component, so the
 * landing page uses the same surface, radius and shadow as everything else.
 */
const MenuElement = ({ entry, sectionKey }) => {
    const Icon = sectionIcon(sectionKey)
    const question = sectionQuestion(sectionKey)

    return (
        <Card>
            <div className={styles.card} data-test="menu-element">
                <div
                    className={styles.sectionTitleBar}
                    data-test="section-title-bar"
                >
                    {Icon && (
                        <span className={styles.sectionIcon} aria-hidden="true">
                            <Icon />
                        </span>
                    )}
                    <span className={styles.sectionName}>{entry.label}</span>
                </div>

                {question && <p className={styles.sectionQuestion}>{question}</p>}

                <p
                    className={styles.sectionDescription}
                    data-test="section-description"
                >
                    {entry.description}
                </p>

                <span
                    className={styles.sectionActionText}
                    data-test="section-action-text"
                >
                    {entry.actionText}
                </span>
            </div>
        </Card>
    )
}

MenuElement.propTypes = {
    entry: PropTypes.shape({
        actionText: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        label: PropTypes.string,
    }).isRequired,
    sectionKey: PropTypes.string,
}

MenuElement.defaultProps = {
    sectionKey: '',
}

export default MenuElement
