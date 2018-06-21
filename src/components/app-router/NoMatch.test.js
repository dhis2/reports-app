/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import NoMatch from './NoMatch';

const location = {
    path: 'path',
};

const ownShallow = () => {
    return shallow(
        <NoMatch location={location} />,
        {
            disableLifecycleMethods: true
        }
    );
};

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ('OrgUnitTree'));

it('NoMatch renders without crashing', () => {
    ownShallow();
});

it('NoMatch renders a div element', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('div')).toHaveLength(1);
});

it('NoMatch renders a h3 element', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('h3')).toHaveLength(1);
});

it('NoMatch renders a code element', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('code')).toHaveLength(1);
});

