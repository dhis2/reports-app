/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';
import MenuElement from "../../components/menu-element/MenuElement";

import { sections } from '../sections.conf';

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

    it('Renders without crashing.', () => {
        ownShallow();
    });

    it('Renders the correct number of elements', () => {
        expect(wrapper.find(MenuElement)).toHaveLength(sections.length);
    });
});
