/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

const ownShallow = () => {
    return shallow(
        <Home />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <Home /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});
