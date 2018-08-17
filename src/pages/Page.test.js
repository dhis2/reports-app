/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Page from './Page';
import DataSetReport from './data-set-report/DataSetReport';
import Home from './home/Home';

import fakerData from '../helpers/fakerTests';

import {DATA_SET_REPORT_SECTION_KEY} from './sections.conf';

jest.mock('./Page'); // Page is now a mock constructor
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

const notPageComponentShallow = () => {
    return shallow(
        <Home t={jest.fn()} />
    );
};

const pageComponentShallow = () => {
    return shallow(
        <DataSetReport
            sectionKey={DATA_SET_REPORT_SECTION_KEY}
            d2={fakerData.d2}
        />,
    );
};

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ('OrgUnitTree'));

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Page.mockClear();
});

it('Page constructor is called', () => {
    const page = new Page();
    expect(Page).toHaveBeenCalled();
});

it('Not Page component does not call page constructor', () => {
    notPageComponentShallow();
    expect(Page).toHaveBeenCalledTimes(0);
});

it('Page component calls page constructor', () => {
    pageComponentShallow();
    expect(Page).toHaveBeenCalledTimes(1);
});

it('componentDidMount was called after component being mounted', () => {
    const spy = spyOn(Page.prototype, 'componentDidMount');
    pageComponentShallow();
    expect(spy).toHaveBeenCalled();
});

it('componentWillUnmount was called after component being unmounted', () => {
    const spy = spyOn(Page.prototype, 'componentWillUnmount');
    const wrapper = pageComponentShallow();
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
});

