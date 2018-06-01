import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardText, FontIcon } from 'material-ui';

import classNames from 'classnames';

const MenuGrid = () => (
    <div id={'menu-grid-id'} className={'row'}>
        <Card className={classNames('col-sm-12 col-md-6 col-lg-4')}>
            <Link to={'/standard-report'}>
                <CardHeader>
                    <span>Standard Report</span>
                    <FontIcon>done</FontIcon>
                </CardHeader>
                <CardText>
                    <div>
                        This is a great description of this feature!
                    </div>
                    <div>
                        This is the action Text!
                    </div>
                </CardText>
            </Link>
        </Card>
        <Card className={classNames('col-sm-12 col-md-6 col-lg-4')}>
            <Link to={'/standard-report'}>
                <CardHeader>
                    <span>Data Set Report</span>
                    <FontIcon>done</FontIcon>
                </CardHeader>
                <CardText>
                    <div>
                        This is a great description of this feature!
                    </div>
                    <div>
                        This is the action Text!
                    </div>
                </CardText>
            </Link>
        </Card>
        <Card className={classNames('col-sm-12 col-md-6 col-lg-4')}>
            <Link to={'/standard-report'}>
                <CardHeader>
                    <span>Report Rate Summary</span>
                    <FontIcon>done</FontIcon>
                </CardHeader>
                <CardText>
                    <div>
                        This is a great description of this feature!
                    </div>
                    <div>
                        This is the action Text!
                    </div>
                </CardText>
            </Link>
        </Card>
        <Card className={classNames('col-sm-12 col-md-6 col-lg-4')}>
            <Link to={'/standard-report'}>
                <CardHeader>
                    <span>Resource</span>
                    <FontIcon>done</FontIcon>
                </CardHeader>
                <CardText>
                    <div>
                        This is a great description of this feature!
                    </div>
                    <div>
                        This is the action Text!
                    </div>
                </CardText>
            </Link>
        </Card>
        <Card className={classNames('col-sm-12 col-md-6 col-lg-4')}>
            <Link to={'/standard-report'}>
                <CardHeader>
                    <span>Resource</span>
                    <FontIcon>done</FontIcon>
                </CardHeader>
                <CardText>
                    <div>
                        This is a great description of this feature!
                    </div>
                    <div>
                        This is the action Text!
                    </div>
                </CardText>
            </Link>
        </Card>
    </div>
);

export default MenuGrid;
