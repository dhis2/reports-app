/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import MenuElement from './MenuElement';

import { sections } from '../../pages/sections.conf';

const ownShallow = () => {
    return shallow(
        <MenuElement entry={sections[0].info} />,
        {
            disableLifecycleMethods: true
        }
    );
};

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ('OrgUnitTree'));

describe('Test <MenuElement /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Renders without crashing.', () => {
        ownShallow();
    });

    it('Renders a section.', () => {
        expect(wrapper.find('.section')).toHaveLength(1);
    });

    it('Renders correct section title.', () => {
        expect(wrapper.find('.section-title')).toHaveLength(1);
    });

    it('Renders correct section description.', () => {
        expect(wrapper.find('.section-description')).toHaveLength(1);
    });

    it('Renders correct section action text.', () => {
        expect(wrapper.find('.section-action-text')).toHaveLength(1);
    });
});
