/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import ReportingRateSummary from './ReportingRateSummary';

import fakerData from '../../helpers/fakerTests';

import {
    sections,
    REPORTING_RATE_SUMMARY_SECTION_KEY
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === REPORTING_RATE_SUMMARY_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

const ownShallow = () => {
    return shallow(
        <ReportingRateSummary
            sectionKey={REPORTING_RATE_SUMMARY_SECTION_KEY}
            pageInfo={pageInfo}
            updateAppState={jest.fn()}
            currentSection={REPORTING_RATE_SUMMARY_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <ReportingRateSummary /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('renders without crashing', () => {
        ownShallow();
    });
});