import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontIcon, GridTile } from 'material-ui';

import injectSheet from 'react-jss';
import classNames from 'classnames';
import styles from './GridMenu.style';

const MenuGrid = ({ classes }) => (
    <div id={'menu-grid-id'} className={'row'}>
        <div className={classNames('col-sm-12 col-md-6 col-lg-4', classes.elementContainer)}>
            <Link to={'/standard-report'}>
                <GridTile className={classNames('section', classes.element)}>
                    <div className={classNames('row', classes.elementTitleBar)}>
                        <span className={classNames('section-title', classes.sectionName)}>Standard Report</span>
                        <FontIcon className={classNames('material-icons', 'icon', classes.sectionIcon)}>
                            done
                        </FontIcon>
                    </div>
                    <span className={classNames('section-description', 'row', classes.sectionDescription)}>
                        This is a great description of this feature!
                    </span>
                    <span className={classNames('section-action-text', 'row', classes.sectionActionText)}>
                        This is the action Text!
                    </span>
                </GridTile>
            </Link>
        </div>
    </div>
);

MenuGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(MenuGrid);
