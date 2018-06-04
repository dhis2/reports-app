import React from 'react';
import PropTypes from 'prop-types';

import { Card, FontIcon } from 'material-ui';

import styles from './MenuElement.style';

const MenuElement = ({ entry }) => (
    <Card className={'section'} style={styles.section}>
        <div style={styles.sectionTitleBar}>
            <div className={'section-title'} style={styles.sectionName}>{entry.label}</div>
            <FontIcon className={'material-icons icon'} style={styles.sectionIcon}>
                {entry.icon}
            </FontIcon>
        </div>
        <div className={'section-description'} style={styles.sectionDescription}>
            {entry.description}
        </div>
        <div className={'section-action-text'} style={styles.sectionActionText}>
            {entry.actionText}
        </div>
    </Card>
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
