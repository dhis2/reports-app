import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Card, FontIcon } from 'material-ui';

import injectSheet from 'react-jss';
import classNames from 'classnames';
import styles from './GridMenu.style';

const GridMenu = ({ classes, sections }) => {
    const menuCells = sections.map(section => (
        <div key={section.key} className={classNames('col-sm-12 col-md-6 col-lg-4', classes.elementContainer)}>
            <Link to={section.path}>
                <Card className={'section'} style={styles.element}>
                    <div style={styles.elementTitleBar}>
                        <div className={'section-title'} style={styles.sectionName}>{section.info.label}</div>
                        <FontIcon className={'material-icons icon'} style={styles.sectionIcon}>
                            {section.info.icon}
                        </FontIcon>
                    </div>
                    <div className={'section-description'} style={styles.sectionDescription}>
                        {section.info.description}
                    </div>
                    <div className={'section-action-text'} style={styles.sectionActionText}>
                        {section.info.actionText}
                    </div>
                </Card>
            </Link>
        </div>
    ));
    return (
        <div id={'menu-grid-id'} className={'row'}>
            {menuCells}
        </div>
    );
};

GridMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    sections: PropTypes.arrayOf(
        PropTypes.shape(
            PropTypes.shape({
                key: PropTypes.string,
                path: PropTypes.string,
                info: PropTypes.shape({
                    label: PropTypes.string,
                    description: PropTypes.string,
                    icon: PropTypes.string,
                    actionText: PropTypes.string,
                }),
            }),
        ),
    ).isRequired,
};

export default injectSheet(styles)(GridMenu);
