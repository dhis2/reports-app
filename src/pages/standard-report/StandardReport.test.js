/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import { Pagination, InputField } from '@dhis2/d2-ui-core';

import { ADD_NEW_REPORT_ACTION, CONTEXT_MENU_ACTION } from './standard.report.conf';

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
            updateFeedbackState={jest.fn()}
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

    it('Should render without crashing.', () => {
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

    it('Should not render "Standard Report" table rows when no elements.' , () => {
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

describe('Test <StandardReport /> actions:', () => {

    /* Load Initial Data */
    it('Should call loadData of standard report list when mount.', () => {
        const wrapper = ownShallow();
        wrapper.instance().loadData = jest.fn();
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().loadData).toHaveBeenCalled();
    });

    /* Search */
    it('Should call search action on search InputField "onChange".', () => {
        const wrapper = ownShallow();
        wrapper.instance().debounceSearch = jest.fn();
        wrapper.setState({
            search: 'searchWord',
        });
        wrapper.find(InputField).simulate('change');
        expect(wrapper.instance().debounceSearch).toHaveBeenCalled();
    });

    /* Add New */
    it('Should call addNewReport action when Add button clicked.', () => {
        const spy = spyOn(StandardReport.prototype, 'addNewReport').and.callThrough();
        const wrapper = ownShallow();
        wrapper.setState({
            selectedReport: 'newReport',
        });
        wrapper.find('#add-std-report-btn-id').simulate('click');
        expect(spy).toHaveBeenCalled();
        expect(wrapper.state().selectedAction).toBe(ADD_NEW_REPORT_ACTION);
        expect(wrapper.state().selectedReport).toBe('newReport');
        expect(wrapper.state().open).toBe(true);
    });

    /* Create */
    it('Should update state properly for "Create" menu action.', () => {
        const wrapper = ownShallow();
        const args = { displayName: 'nameCreate', reportTable: 'tableCreate', id: 'idCreate'};
        wrapper.instance().createReport(args);
        expect(wrapper.state().selectedReport.displayName).toBe('nameCreate');
        expect(wrapper.state().selectedAction).toBe(CONTEXT_MENU_ACTION.CREATE);
        expect(wrapper.state().open).toBe(true);
    });

    it('Should call correct component for "Create" action.', () => {
        const spy = spyOn(StandardReport.prototype, 'getCreateStdReportComponent');
        const wrapper = ownShallow();
        wrapper.setState({
            open: true,
            selectedReport: 'newReport',
            selectedAction: CONTEXT_MENU_ACTION.CREATE,
        });
        wrapper.instance().getActionComponent();
        expect(spy).toHaveBeenCalled();
    });

    /* Edit */
    it('Should update state properly for "Edit" menu action.', () => {
        const wrapper = ownShallow();
        const args = { displayName: 'nameEdit', reportTable: 'tableEdit', id: 'idEdit'};
        wrapper.instance().editReport(args);
        expect(wrapper.state().selectedReport.displayName).toBe('nameEdit');
        expect(wrapper.state().selectedAction).toBe(CONTEXT_MENU_ACTION.EDIT);
        expect(wrapper.state().open).toBe(true);
    });

    it('Should call correct component for "Edit" action.', () => {
        const spy = spyOn(StandardReport.prototype, 'getEditComponent');
        const wrapper = ownShallow();
        wrapper.setState({
            open: true,
            selectedReport: 'editReport',
            selectedAction: CONTEXT_MENU_ACTION.EDIT,
        });
        wrapper.instance().getActionComponent();
        expect(spy).toHaveBeenCalled();
    });

    /* Sharing Settings  */
    it('Should update state properly for "Sharing settings" menu action.', () => {
        const wrapper = ownShallow();
        const args = { displayName: 'nameSharingSettings', reportTable: 'tableSharingSettings', id: 'idSharingSettings'};
        wrapper.instance().sharingSettings(args);
        expect(wrapper.state().selectedReport.displayName).toBe('nameSharingSettings');
        expect(wrapper.state().selectedAction).toBe(CONTEXT_MENU_ACTION.SHARING_SETTINGS);
        expect(wrapper.state().open).toBe(true);
    });

    it('Should call correct component for "Sharing settings" action.', () => {
        const spy = spyOn(StandardReport.prototype, 'getSharingDialog');
        const wrapper = ownShallow();
        wrapper.setState({
            open: true,
            selectedReport: 'sharingSettingsReport',
            selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
        });
        wrapper.instance().getActionComponent();
        expect(spy).toHaveBeenCalled();
    });

    /* Delete */
    it('Should allow "Delete" a standard report.', () => {
        const wrapper = ownShallow();
        const args = { displayName: 'nameDelete', reportTable: 'tableDelete', id: 'idDelete'};
        wrapper.instance().delete(args);
        expect(wrapper.instance().props.updateFeedbackState).toHaveBeenCalled();
    });

    /* Close dialog */
    it('Should update state when close dialog action is trigger.', () => {
        const wrapper = ownShallow();
        wrapper.setState({
            open: true,
            selectedReport: 'closeReport',
        });
        expect(wrapper.state().open).toBe(true);
        expect(wrapper.state().selectedReport).toBe('closeReport');
        wrapper.instance().handleClose();
        expect(wrapper.state().open).toBe(false);
        expect(wrapper.state().selectedReport).toBe(null);
    });

    it('Should reload reports when close dialog action is trigger with true', () => {
        const spy = spyOn(StandardReport.prototype, 'loadData');
        const wrapper = ownShallow();
        wrapper.setState({
            open: true,
            selectedReport: 'closeReport',
        });
        expect(wrapper.state().open).toBe(true);
        expect(wrapper.state().selectedReport).toBe('closeReport');
        wrapper.instance().handleClose(true);
        expect(wrapper.state().open).toBe(false);
        expect(wrapper.state().selectedReport).toBe(null);
        expect(spy).toHaveBeenCalled();
    });

    /* Go Back */
    it('Should update state when Go Back action is trigger.', () => {
        const wrapper = ownShallow();
        wrapper.setState({
            htmlReport: 'htmlReport',
        });
        expect(wrapper.state().htmlReport).toBe('htmlReport');
        wrapper.instance().goBack();
        expect(wrapper.state().htmlReport).toBe(null);
    });

    /* Display Html Report*/
    it('Should update state on "handleDisplayHtmlReport" function.', () => {
        const wrapper = ownShallow();
        const report = { displayName: 'nameHtmlReport', reportTable: 'tableHtmlReport', id: 'idHtmlReport'};
        wrapper.instance().handleDisplayHtmlReport(report);
        expect(wrapper.state().htmlReport).toBe(report);
    });

    /* Pagination */
    describe('Test pagination actions:', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = ownShallow();
        });

        it('Should have a "hasNextPage" function.', () => {
            expect(wrapper.instance().hasNextPage).toBeDefined();
            expect(typeof wrapper.instance().hasNextPage).toBe('function');
            wrapper.setState({
                pager: { page: 1, pageCount: 10 },
            });
            expect(wrapper.instance().hasNextPage()).toBe(true);
            wrapper.setState({
                pager: { page: 10, pageCount: 10 },
            });
            expect(wrapper.instance().hasNextPage()).toBe(false);
        });

        it('Should have a "hasPreviousPage" function.', () => {
            expect(wrapper.instance().hasPreviousPage).toBeDefined();
            expect(typeof wrapper.instance().hasPreviousPage).toBe('function');
            wrapper.setState({
                pager: { page: 10, pageCount: 10 },
            });
            expect(wrapper.instance().hasPreviousPage()).toBe(true);
            wrapper.setState({
                pager: { page: 0, pageCount: 10 },
            });
            expect(wrapper.instance().hasPreviousPage()).toBe(false);
        });

        it('Should have a "onNextPageClick" function.', () => {
            const spy = spyOn(StandardReport.prototype, 'loadData');
            expect(wrapper.instance().onNextPageClick).toBeDefined();
            expect(typeof wrapper.instance().onNextPageClick).toBe('function');
            wrapper.setState({
                pager: { page: 1, pageCount: 10 },
            });
            wrapper.instance().onNextPageClick();
            expect(spy).toHaveBeenCalledWith({ page: 2, pageCount: 10 }, "");
        });

        it('Should have a "onPreviousPageClick" function.', () => {
            const spy = spyOn(StandardReport.prototype, 'loadData');
            expect(wrapper.instance().onPreviousPageClick).toBeDefined();
            expect(typeof wrapper.instance().onPreviousPageClick).toBe('function');
            wrapper.setState({
                pager: { page: 2, pageCount: 10 },
            });
            wrapper.instance().onPreviousPageClick();
            expect(spy).toHaveBeenCalledWith({ page: 1, pageCount: 10 }, "");
        });

    });

});
