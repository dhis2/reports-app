/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { Pagination } from '@dhis2/d2-ui-core';

import StandardReport from './StandardReport';

/* React Components */
import PageHelper from '../../components/page-helper/PageHelper';

import fakerData from '../../helpers/fakerTests';

import {
    sections,
    STANDARD_REPORT_SECTION_KEY
} from '../sections.conf';

/* Helpers */
import { i18nKeys } from '../../i18n';

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

const reports = [
    {displayName: 'report1', reportTable: 'reportTable1', id: 'id1'},
    {displayName: 'report2', reportTable: 'reportTable2', id: 'id2'},
    {displayName: 'report3', reportTable: 'reportTable3', id: 'id3'},
];

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

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should show correct title.', () =>{
        expect(wrapper.find('h1')).toHaveLength(1);
        expect(wrapper.find('h1').text()).toBe(`${i18nKeys.standardReport.header}<PageHelper />`);
    });

    it('Should have a "PageHelper" component.', () => {
        expect(wrapper.find(PageHelper)).toHaveLength(1);
    });

    it('Should have a "Search" input.', () => {
        expect(wrapper.find('#search-box-id')).toHaveLength(1);
    });

    it('Should render header and footer pagination.', () => {
        const pageContent = wrapper.find('#std-report-content');
        expect(pageContent.find(Pagination)).toHaveLength(2);
    });

    it('Should not render a "Standard Report" table when no elements.' , () => {
        const reports = [];
        wrapper.setState({
            reports,
        });
        expect(wrapper.find(Table)).toHaveLength(1);
        expect(wrapper.find(Table).props().rows.length).toBe(0);
    });


    it('Should render a "Standard Report" table with correct columns.' , () => {
        wrapper.setState({
            reports,
        });
        expect(wrapper.find(Table)).toHaveLength(1);
        expect(wrapper.find(Table).props().columns.length).toBe(3);
        expect(wrapper.find(Table).props().columns[0]).toBe('displayName');
        expect(wrapper.find(Table).props().columns[1]).toBe('reportTable');
        expect(wrapper.find(Table).props().columns[2]).toBe('id');
        expect(wrapper.find('#no-std-report-find-message-id').props().style.display).toBe('none');
    });

    it('Should render a "Standard Report" table with correct rows.' , () => {
        wrapper.setState({
            reports,
        });
        expect(wrapper.find(Table)).toHaveLength(1);
        expect(wrapper.find(Table).props().rows.length).toBe(3);
        expect(wrapper.find(Table).props().rows[0].displayName).toBe(reports[0].displayName);
        expect(wrapper.find(Table).props().rows[0].reportTable).toBe(reports[0].reportTable);
        expect(wrapper.find(Table).props().rows[0].id).toBe(reports[0].id);
        expect(wrapper.find('#no-std-report-find-message-id').props().style.display).toBe('none');
    });

    it('Standard Report component renders Floating add button', () => {
        expect(wrapper.find('#add-std-report-btn-id')).toHaveLength(1);
    });

});
