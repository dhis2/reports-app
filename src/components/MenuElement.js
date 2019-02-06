import React from 'react'
import PropTypes from 'prop-types'

/* Material UI */
import { Paper } from 'material-ui'

import styles from '../utils/styles'

const style = styles.menuGrid

const MenuElement = ({ entry }) => (
    <Paper className={'section'} style={style.section}>
        <div style={style.sectionTitleBar}>
            <div className={'section-title'} style={style.sectionName}>
                {entry.label}
            </div>
            <span className={'material-icons icon'} style={style.sectionIcon}>
                {entry.icon}
            </span>
        </div>
        <div className={'section-description'} style={style.sectionDescription}>
            {entry.description}
        </div>
        <div className={'section-action-text'} style={style.sectionActionText}>
            {entry.actionText}
        </div>
    </Paper>
)

MenuElement.propTypes = {
    entry: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        actionText: PropTypes.string,
    }).isRequired,
}

export default MenuElement
