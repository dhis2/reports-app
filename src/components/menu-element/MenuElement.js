import React from 'react';
import PropTypes from 'prop-types';

import { Paper } from 'material-ui';

import styles from './MenuElement.style';

const MenuElement = ({ entry }) => (
    <Paper className={'section'} style={styles.section}>
        <div style={styles.sectionTitleBar}>
            <div className={'section-title'} style={styles.sectionName}>{entry.label}</div>
            <span className={'material-icons icon'} style={styles.sectionIcon}>
                {entry.icon}
            </span>
        </div>
        <div className={'section-description'} style={styles.sectionDescription}>
            {entry.description}
        </div>
        <div className={'section-action-text'} style={styles.sectionActionText}>
            {entry.actionText}
        </div>
    </Paper>
);

MenuElement.propTypes = {
    entry: PropTypes.shape({
        label: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        actionText: PropTypes.string,
    }).isRequired,
};

export default MenuElement;
