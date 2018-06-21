/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Resource from './Resource';

import fakerData from '../../helpers/fakerTests';

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
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ('OrgUnitTree'));

describe('Test <Resource /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});
