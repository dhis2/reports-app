/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Resource from './Resource';

import {
    sections,
    RESOURCE_SECTION_KEY
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === RESOURCE_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

const ownShallow = () => {
    return shallow(
        <Resource
            sectionKey={RESOURCE_SECTION_KEY}
            pageInfo={pageInfo}
            updateAppState={jest.fn()}
            currentSection={RESOURCE_SECTION_KEY}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <Resource /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});