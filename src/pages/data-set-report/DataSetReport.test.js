/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DataSetReport from './DataSetReport';

import {
    sections,
    DATA_SET_REPORT_SECTION_KEY
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === DATA_SET_REPORT_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

const ownShallow = () => {
    return shallow(
        <DataSetReport
            sectionKey={DATA_SET_REPORT_SECTION_KEY}
            pageInfo={pageInfo}
            updateAppState={jest.fn()}
            currentSection={DATA_SET_REPORT_SECTION_KEY}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <DataSetReport /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});