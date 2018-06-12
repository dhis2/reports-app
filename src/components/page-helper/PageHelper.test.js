/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* App components */
import PageHelper from './PageHelper';

const ownShallow = () => {
    return shallow(
        <PageHelper
            url="http://dummy.com"
        />,
    );
};

it('Page Helper renders without crashing.', () => {
    ownShallow();
});
