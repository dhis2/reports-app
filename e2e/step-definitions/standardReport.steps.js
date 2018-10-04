const {expect} = require('chai');
const {defineSupportCode} = require('cucumber')
const path = require('path');

const standardReport = require('../pages/standardReport.page');

const DEFAULT_WAIT_TIME = 5000;

const fsExtra = require('fs-extra');

const fs = require('fs');

const pathToChromeDownloads = './chromeDownloads';

defineSupportCode(({Given, When, Then}) => {

    let numberOfItems;
    let fullDownloadReportFilePath;

    // *********************************************************
    // Shared
    // *********************************************************
    When(/^I open Standard Report page$/, () => {
        standardReport.open();
    });

    Then(/^I click more options icon in the reports list item$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table').elements('button').value[0].click();
    });

    Then(/^fill the form report options$/, () => {
        browser.waitForVisible('#create-std-report-form-id');
        standardReport.getOneOrgUnitTreeFromTreeByIndex(1).click();
    });

    Then(/^I select option to create report$/, () => {
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table__context-menu :nth-child(1)').click();
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^a pagination component is displayed$/, () => {
        browser.element('.data-table-pager').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a search field is displayed$/, () => {
        browser.element('#search-box-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a table with list of reports is displayed$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
        // Later we are going to download this report - used to assert downloaded file name
        let firstStdReportName =  browser.elements('.d2-ui-table__rows__row').value[0]
            .element(':first-child').getText();
        firstStdReportName = firstStdReportName.replace(/[/?%*:|"'<>.]/g, '');
        fullDownloadReportFilePath = `${pathToChromeDownloads}/${firstStdReportName}.xls`;
    });

    Then(/^each item of the list contains more options icon$/, () => {
        const elements = browser.elements('.d2-ui-table__rows__row').value;
        const contextMenuElements =  browser.element('.d2-ui-table').elements('button').value;
        expect(elements.length).to.equal(contextMenuElements.length);
    });

    Then(/^button to add report is displayed$/, () => {
        browser.element('#add-std-report-btn-container-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    // Scenario: I want to add a standart report
    // *********************************************************
    Then(/^I click add button$/, () => {
        browser.element('#add-std-report-btn-container-id button').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#add-std-report-btn-container-id button').click();
        browser.element('#add-edit-std-report-form-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^I fill the form$/, () => {
        const filePath = path.join(__dirname, '..', 'files', 'jasper-report-template.jrxml')
        browser.element('#add-edit-std-report-form-id .d2-ui-textfield input').setValue('Standard Report Name');
        browser.chooseFile('input[name=hiddenInputFile]', filePath);
        browser.element('.d2-ui-selectfield-reportTable button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(2)').click();
    });

    Then(/^click save$/, () => {
        numberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        browser.pause(DEFAULT_WAIT_TIME);
        browser.element('#save-action-btn-id').click();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^a new standard report was created$/, () => {
        const newNumberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        expect(parseInt(newNumberOfItems, 10)).to.equal(parseInt(numberOfItems, 10) + 1);
    });

    // *********************************************************
    // Scenario: I want to add a standart report
    // *********************************************************

    // Shared: I click more options icon in the reports list item

    Then(/^a list with several options is displayed$/, () => {
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^there is an option to create report$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(1) > span > div > div > div').getText())
            .to.equal('Create');
    });

    Then(/^there is an option to edit report$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(2) > span > div > div > div').getText())
            .to.equal('Edit Report');
    });

    Then(/^there is an option to configure share settings$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(3) > span > div > div > div').getText())
            .to.equal('Sharing Settings');
    });

    Then(/^there is an option to delete the standard report$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(4) > span > div > div > div').getText())
            .to.equal('Delete');
    });

    // *********************************************************
    // Scenario: I want to get a report
    // *********************************************************

    // Shared: I click more options icon in the reports list item

    // Shared: I select option to create report

    // Shared: fill the form report options

    Then(/^I click get report button$/, () => {
        this.tabsCount = browser.getTabIds().length;
        browser.waitForEnabled('#create-std-report-get-action-id');
        browser.element('#create-std-report-get-action-id').click();
    });

    Then(/^report is generated$/, () => {
        expect(browser.getTabIds().length).to.equal(this.tabsCount + 1);
    });

    // *********************************************************
    // Scenario: I want to download a report
    // *********************************************************

    // Shared: I click more options icon in the reports list item

    // Shared: I select option to create report

    // Shared: fill the form report options

    Then(/^I click download as excel button$/, () => {
        // Clean up the chromeDownloads folder and create a fresh one
        fsExtra.removeSync(pathToChromeDownloads);
        fsExtra.mkdirsSync(pathToChromeDownloads);
        expect(fs.existsSync(fullDownloadReportFilePath)).to.equal(false);
        browser.waitForEnabled('#create-std-report-export-action-id');
        browser.element('#create-std-report-export-action-id').click();
    });

    Then(/^report is downloaded/, () => {
        browser.pause(DEFAULT_WAIT_TIME);
        expect(fs.existsSync(fullDownloadReportFilePath)).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to abort the generation of a report
    // *********************************************************

    // Shared: I click more options icon in the reports list item

    // Shared: I select option to create report

    // Shared: fill the form report options

    Then(/^I click cancel button$/, () => {
        this.tabsCount = browser.getTabIds().length;
        browser.waitForEnabled('#create-std-report-cancel-action-id');
        browser.element('#create-std-report-cancel-action-id').click();
    });

    Then(/^the report was not generated$/, () => {
        expect(this.tabsCount).to.equal(browser.getTabIds().length);
    });

    Then(/^create report form is dismissed$/, () => {
        browser.pause(1000);
        expect(browser.element('#create-std-report-form-id').isVisible()).to.equal(false);
    });
});