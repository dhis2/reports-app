/* eslint-disable */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { i18nKeys } from '../../../i18n';

import { relativePeriods, NONE, TYPES, CACHE_STRATEGIES } from '../standard.report.conf';

import AddEditStdReport from './AddEditStdReport';

/* material-ui */
import { Dialog } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* d2-ui */
import { Button, SelectField, SvgIcon, CheckBox } from '@dhis2/d2-ui-core';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

import fakerData from '../../../helpers/fakerTests';

const mockReport = {
    id: 'reportId',
    name: 'reportName',
    cacheStrategy: CACHE_STRATEGIES[1].id, // default RESPECT_SYSTEM_SETTING
    type: TYPES.JASPER_REPORT_TABLE, // default JASPER_REPORT_TABLE
    designContent: 'fileContent',
    reportTable: NONE,
    reportParams: {
        paramReportingPeriod: false, // paramReportingMonth
        paramOrganisationUnit: false,
    },
    relativePeriods: {
        // days
        thisDay: false,
        yesterday: false,
        last3Days: false,
        last7Days: false,
        last14Days: false,
        // weeks
        thisWeek: false,
        lastWeek: false,
        last4Weeks: false,
        last12Weeks: false,
        last52Weeks: false,
        weeksThisYear: false,
        // month
        thisMonth: false,
        lastMonth: false,
        last3Months: false,
        last6Months: false,
        last12Months: false,
        monthsThisYear: false,
        // bi-motnhs
        thisBimonth: false,
        lastBimonth: false,
        last6BiMonths: false,
        biMonthsThisYear: false,
        // quartes
        thisQuarter: false,
        lastQuarter: false,
        last4Quarters: false,
        quartersThisYear: false,
        // six-months
        sixMonths: false,
        thisSixMonth: false,
        lastSixMonth: false,
        last2SixMonths: false,
        // financial years
        financialYears: false,
        thisFinancialYear: false,
        lastFinancialYear: false,
        last5FinancialYears: false,
        // years
        years: false,
        thisYear: false,
        lastYear: false,
        last5Years: false,
    },
};

const ownShallow = (selectedReport) => {
    return shallow(
        <AddEditStdReport
            d2={fakerData.d2}
            updateFeedbackState={jest.fn()}
            onRequestClose={jest.fn()}
            open={true}
            onError={jest.fn()}
            selectedReport={selectedReport}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <AddEditStdReport /> rendering EDIT:', () => {
    let wrapper;
    let dialog;
    beforeEach(() => {
        wrapper = ownShallow({ report: 'ReportName', id: 'ReportId' });
        wrapper.setState({ report: mockReport });
        dialog = wrapper.find(Dialog);
    });

    it('Should render Edit component without crashing', () => {
        ownShallow({ report: 'ReportName', id: 'ReportId' });
    });

    it('Should render correct title when "Editing" a standard report.', () => {
        expect(dialog.props().title).toBe(`${i18nKeys.standardReport.editReportTitle}`);
    });

    /* rights message */
    it('Should display object creation rights information message.', () => {
        expect(dialog.find('#display-right-message-id')).toHaveLength(1);
        expect(dialog.find('#display-right-message-id').text()).toBe(`${i18nKeys.messages.rightsMessage}`);
    });

    /* name */
    it('Should display report "name" input with correct value.', () => {
        expect(dialog.find('[name="name"]')).toHaveLength(1);
        expect(dialog.find('[name="name"]').props().value).toBe(mockReport.name);
    });

    /* type */
    it('Should display "type" selector with correct value.', () => {
        expect(dialog.find('[name="reportType"]')).toHaveLength(1);
        expect(dialog.find('[name="reportType"]').props().value).toBe(mockReport.type);
    });

    /* upload file */
    it('Should display an input to "Upload" report design.', () => {
        expect(dialog.find(SvgIcon)).toHaveLength(1);
        expect(dialog.find('[name="fileName"]')).toHaveLength(1);
    });

    /* current design */
    it('Should display "Get Current Design" link.', () => {
        expect(dialog.find('a')).toHaveLength(1);
        expect(dialog.find('a').text()).toBe(`${i18nKeys.standardReport.getCurrentDesign}`);
    });

    /* reportTable */
    it('Should display report "reportTable" input with correct value.', () => {
        expect(dialog.find('[selector="reportTable"]')).toHaveLength(1);
        expect(dialog.find('[selector="reportTable"]').props().value).toBe(mockReport.reportTable.id);
    });

    /* cache strategy */
    it('Should allow "Cache Strategy" selection.', () => {
        expect(dialog.find('#cache-strategy-id')).toHaveLength(1);
        expect(dialog.find('#cache-strategy-id').find(SelectField).props().value).toBe(mockReport.cacheStrategy);
    });

    /* relative periods */
    it('Should not display "Relative Periods" inputs for TYPES.JASPER_REPORT_TABLE.', () => {
        expect(dialog.find('#relative-periods-id')).toHaveLength(1);
        expect(dialog.find('#relative-periods-id').props().style.display).toBe('none');
    });

    it('Should not display "Report Parameters" inputs for TYPES.JASPER_REPORT_TABLE.', () => {
        expect(dialog.find('#report-parameters-id')).toHaveLength(1);
        expect(dialog.find('#report-parameters-id').props().style.display).toBe('none');
    });

    /* Actions */
    it('Should display "Cancel" and "Save" actions.', () => {
        const actions = mount(<MuiThemeProvider><span>{dialog.props().actions}</span></MuiThemeProvider>);
        expect(actions.find(Button)).toHaveLength(2);
        expect(actions.find(Button).at(0).text()).toBe(`${i18nKeys.buttons.cancel}`);
        expect(actions.find(Button).at(1).text()).toBe(`${i18nKeys.buttons.save}`);
    });

});

describe('Test <AddEditStdReport /> rendering ADD:', () => {
    let wrapper;
    let dialog;
    beforeEach(() => {
        wrapper = ownShallow();
        dialog = wrapper.find(Dialog);
    });

    it('Should render Add component without crashing', () => {
        ownShallow();
    });

    it('Should render correct title when "Adding" a standard report.', () => {
        expect(dialog.props().title).toBe(`${i18nKeys.standardReport.addNewReportTitle}`);
    });

    /* rights message */
    it('Should display object creation rights information message.', () => {
        expect(dialog.find('#display-right-message-id')).toHaveLength(1);
        expect(dialog.find('#display-right-message-id').text()).toBe(`${i18nKeys.messages.rightsMessage}`);
    });

    /* name */
    it('Should display report "name" input with correct value.', () => {
        expect(dialog.find('[name="name"]')).toHaveLength(1);
        expect(dialog.find('[name="name"]').props().value).toBe('');
    });

    /* type */
    it('Should display "type" selector with correct value.', () => {
        expect(dialog.find('[name="reportType"]')).toHaveLength(1);
        expect(dialog.find('[name="reportType"]').props().value).toBe(mockReport.type);
    });

    /* upload file */
    it('Should display an input to "Upload" report design.', () => {
        expect(dialog.find(SvgIcon)).toHaveLength(1);
        expect(dialog.find('[name="fileName"]')).toHaveLength(1);
    });

    /* get jasper template */
    it('Should display correct "Get Jasper Template" message when type !== HTML.', () => {
        expect(dialog.find('a')).toHaveLength(1);
        expect(dialog.find('a').text()).toBe(`${i18nKeys.standardReport.getJasperTemplate}`);

    });

    /* get html template */
    it('Should display correct "Get Html Template" message when type === HTML.', () => {
        wrapper.setState({ report: { ...mockReport, id: null, type: TYPES.HTML }});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('a')).toHaveLength(1);
        expect(dialog.find('a').text()).toBe(`${i18nKeys.standardReport.getHTMLTemplate}`);

    });

    /* reportTable */
    it('Should display report "reportTable" input with correct value.', () => {
        expect(dialog.find('[selector="reportTable"]')).toHaveLength(1);
        expect(dialog.find('[selector="reportTable"]').props().value).toBe(mockReport.reportTable.id);
    });

    /* cache strategy */
    it('Should allow "Cache Strategy" selection.', () => {
        expect(dialog.find('#cache-strategy-id')).toHaveLength(1);
        expect(dialog.find('#cache-strategy-id').find(SelectField).props().value).toBe(mockReport.cacheStrategy);
    });

    /* relative periods */
    it('Should display "Relative Periods" section for TYPES.HTML and TYPES.JASPER_JDBC.', () => {
        expect(dialog.find('#relative-periods-id')).toHaveLength(1);
        wrapper.setState({ report: { ...mockReport, id: null, type: TYPES.HTML }});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('#relative-periods-id').props().style.display).not.toBe('none');
        wrapper.setState({ report: { ...mockReport, id: null, type: TYPES.JASPER_JDBC }});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('#relative-periods-id').props().style.display).not.toBe('none');
    });

    /* relative periods values and labels */
    it('Should display "Periods" inputs for TYPES.HTML and TYPES.JASPER_JDBC.', () => {
        const relativePeriodsRow = dialog.find('#relative-periods-row-id');
        const cols = relativePeriodsRow.children();
        for(let i = 0; i < cols.length; i++) {
            expect(cols.at(i).find('h4').text()).toBe(relativePeriods[i].label);
            for(let j = 0; j < relativePeriods[i].periods.length; j++) {
                expect(cols.at(i).find(CheckBox).at(j).props().label).toBe(relativePeriods[i].periods[j].name);
            }
        }
    });

    /* report parameters */
    it('Should display "Report Parameters" inputs for TYPES.HTML and TYPES.JASPER_JDBC.', () => {
        expect(dialog.find('#report-parameters-id')).toHaveLength(1);
        wrapper.setState({ report: { ...mockReport, id: null, type: TYPES.HTML }});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('#report-parameters-id').props().style.display).not.toBe('none');
        wrapper.setState({ report: { ...mockReport, id: null, type: TYPES.JASPER_JDBC }});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('#report-parameters-id').props().style.display).not.toBe('none');
    });

    /* Actions */
    it('Should display "Cancel" and "Save" actions.', () => {
        const actions = mount(<MuiThemeProvider><span>{dialog.props().actions}</span></MuiThemeProvider>);
        expect(actions.find(Button)).toHaveLength(2);
        expect(actions.find(Button).at(0).text()).toBe(`${i18nKeys.buttons.cancel}`);
        expect(actions.find(Button).at(1).text()).toBe(`${i18nKeys.buttons.save}`);
    });

});


describe('Test <AddEditStdReport /> actions:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    /* load report tables */
    it('Should call loadReportTables when mount.', () => {
        wrapper.instance().loadReportTables = jest.fn();
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().loadReportTables).toHaveBeenCalled();
    });

    it('Should call onChangeName when input name value changes.', () => {
        wrapper.instance().onChangeName = jest.fn();
        wrapper.setState({ report: mockReport });
        wrapper.find('[name="name"]').simulate('change', 'newName');
        expect(wrapper.instance().onChangeName).toHaveBeenCalled();
    });

    it('Should call onChangeType when selected report type changes.', () => {
        wrapper.instance().onChangeType = jest.fn();
        wrapper.setState({ report: mockReport });
        wrapper.find('[name="reportType"]').simulate('change', 'newType');
        expect(wrapper.instance().onChangeType).toHaveBeenCalled();
    });

    it('Should call onChangeCacheStrategy when selected report type changes.', () => {
        wrapper.instance().onChangeCacheStrategy = jest.fn();
        wrapper.setState({ report: mockReport });
        wrapper.find('#cache-strategy-id').find(SelectField).simulate('change', 'strategy');
        expect(wrapper.instance().onChangeCacheStrategy).toHaveBeenCalled();
    });

    it('Should call onChangeReportTable when selected report table changes.', () => {
        wrapper.instance().onChangeReportTable = jest.fn();
        wrapper.setState({ report: mockReport });
        wrapper.find('[selector="reportTable"]').simulate('change', 'reportTable');
        expect(wrapper.instance().onChangeReportTable).toHaveBeenCalled();
    });

    it('Should call onChangeCheck when period checkbox changes state.', () => {
        wrapper.instance().onChangeCheck = jest.fn();
        wrapper.setState({ report: mockReport });
        wrapper.find(CheckBox).at(0).simulate('change');
        expect(wrapper.instance().onChangeCheck).toHaveBeenCalled();
    });

    it('Should have a getDownloadLink action.', () => {
        expect(wrapper.instance().getDownloadLink).toBeDefined();
        expect(typeof wrapper.instance().getDownloadLink).toBe('function');
    });

    it('Should have a getTitle function.', () => {
        expect(wrapper.instance().getTitle).toBeDefined();
        expect(typeof wrapper.instance().getTitle).toBe('function');
    });

    it('Should have a close function.', () => {
        expect(wrapper.instance().close).toBeDefined();
        expect(typeof wrapper.instance().close).toBe('function');
    });

    it('Should have a loadSelectedReport function.', () => {
        expect(wrapper.instance().loadSelectedReport).toBeDefined();
        expect(typeof wrapper.instance().loadSelectedReport).toBe('function');
    });

    it('Should call addReport function when save button is clicked.', () => {
        expect(wrapper.instance().addReport).toBeDefined();
        expect(typeof wrapper.instance().addReport).toBe('function');
        wrapper.instance().addReport = jest.fn();
        wrapper.setState({ report: { ...mockReport, reportTable: { id: 'tableId', name: 'tableName'} }});
        const actions = mount(<MuiThemeProvider><span>{wrapper.find(Dialog).props().actions}</span></MuiThemeProvider>);
        actions.find(Button).at(1).find('button').simulate('click');
        expect(wrapper.instance().addReport).toHaveBeenCalled();
    });

    it('Should have a ifFormValid function.', () => {
        wrapper.setState({ report: { ...mockReport, name: null }});
        const isValid = wrapper.instance().ifFormValid();
        expect(wrapper.instance().ifFormValid).toBeDefined();
        expect(typeof wrapper.instance().ifFormValid).toBe('function');
        expect(isValid).toBe(false);
    });
});
