/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import StandardReport from './StandardReport';

import fakerData from '../../helpers/fakerTests';

import {
    sections,
    STANDARD_REPORT_SECTION_KEY
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === STANDARD_REPORT_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const ownShallow = () => {
    return shallow(
        <StandardReport
            sectionKey={STANDARD_REPORT_SECTION_KEY}
            pageInfo={pageInfo}
            updateAppState={jest.fn()}
            currentSection={STANDARD_REPORT_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <StandardReport /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});