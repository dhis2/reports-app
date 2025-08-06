import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import { card } from '../utils/styles/shared.jsx'
import styles from './MenuElement.module.css'

const MenuElement = ({ entry }) => (
    <Paper className={card.className}>
        <div className={styles.sectionTitleBar}>
            <div className={styles.sectionName}>{entry.label}</div>
            <span className={`material-icons icon ${styles.sectionIcon}`}>
                {entry.icon}
            </span>
        </div>
        <div className={styles.sectionDescription}>{entry.description}</div>
        <div className={styles.sectionActionText}>{entry.actionText}</div>
        {card.styles}
    </Paper>
)

MenuElement.propTypes = {
    entry: PropTypes.shape({
        actionText: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        label: PropTypes.string,
    }).isRequired,
}

export default MenuElement
