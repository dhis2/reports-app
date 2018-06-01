import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontIcon, GridTile } from 'material-ui';

import injectSheet from 'react-jss';
import classNames from 'classnames';
import styles from './GridMenu.style';

const MenuGrid = ({ classes, sections }) => {
    const menuCells = sections.map(section => (
        <div key={section.key} className={classNames('col-sm-12 col-md-6 col-lg-4', classes.elementContainer)}>
            <Link to={section.path}>
                <GridTile className={classNames('section', classes.element)}>
                    <div className={classNames('row', classes.elementTitleBar)}>
                        <span className={classNames('section-title', classes.sectionName)}>{section.info.label}</span>
                        <FontIcon className={classNames('material-icons', 'icon', classes.sectionIcon)}>
                            {section.info.icon}
                        </FontIcon>
                    </div>
                    <span className={classNames('section-description', 'row', classes.sectionDescription)}>
                        {section.info.description}
                    </span>
                    <span className={classNames('section-action-text', 'row', classes.sectionActionText)}>
                        {section.info.actionText}
                    </span>
                </GridTile>
            </Link>
        </div>
    ));
    return (
        <div id={'menu-grid-id'} className={'row'}>
            {menuCells}
        </div>
    );
};

MenuGrid.propTypes = {
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

export default injectSheet(styles)(MenuGrid);
