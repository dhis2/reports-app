const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dataApproval = require('../pages/dataApproval.page');

const DEFAULT_WAIT_TIME = 5000;

const VALID_DATA_SET = 'Mortality < 5 years';

const getOneOrgUnitTreeFromTreeByIndex = (index) => {
    browser.element('.tree-view div[role=button]').waitForVisible(DEFAULT_WAIT_TIME);
    this.orgUnit = browser.elements('.tree-view div[role=button]').value[index].getText();
    return browser.elements('.tree-view div[role=button]').value[index].element('<input>');
};

const isOrganisationUnitSelected = () => {
    const checkboxes = browser.element('.tree-view').elements('.tree-view input[type=checkbox]').value;
    for (let currentCheckbox of checkboxes) {
        if (currentCheckbox.isSelected()) {
            return true;
        }
    }
    return false;
};

const selectDataSetWithName = (name) => {
    browser.element('#data-set-selection').waitForVisible(DEFAULT_WAIT_TIME);
    browser.element('#data-set-selection button').click();
    const menuItems = browser.elements('span[role=menuitem]').value;
    for (let menuItem of menuItems) {
        if (menuItem.element('div > div > div').getText() === name) {
            menuItem.click();
            break;
        }
    }
};

defineSupportCode(({ Given, When, Then }) => {
    // *********************************************************
    // Shared
    // *********************************************************
    When(/^I open Data Approval page$/, () => {
        dataApproval.open();
    });

    // *********************************************************
    //  Scenario: I want to see all items in the page
    // *********************************************************

    Then(/^organisation unit selection for data approval is displayed$/, () => {
        browser.element('.tree-view').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^data set selection for data approval is displayed$/, () => {
        browser.element('#data-set-selection').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^get data button disabled$/, () => {
        browser.element('#main-action-button button').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#main-action-button button').isEnabled()).to.equal(false);
    });

    // *********************************************************
    //  Scenario: I want to get data
    // *********************************************************
    Then(/^I select organisation unit for data approval$/, () => {
        getOneOrgUnitTreeFromTreeByIndex(1).click();
        expect(isOrganisationUnitSelected()).to.equal(true);
    });

    Then(/^I select data set for data approval$/, () => {
        selectDataSetWithName(VALID_DATA_SET);
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^I select period to retrieve data$/, () => {
        browser.element('#report-period').waitForVisible(DEFAULT_WAIT_TIME);
        // Select Year
        browser.element('#report-period div[id*=year] button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(2)').click();
        browser.pause(DEFAULT_WAIT_TIME);
        this.selectedYear = browser.element('#report-period div[id*=year]').getText();
        // Select Month
        browser.element('#report-period div[id*=month] button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(2)').click();
        browser.pause(DEFAULT_WAIT_TIME);
        this.selecteMonth = browser.element('#report-period div[id*=month]').getText();
    });

    Then(/^click get data button$/, () => {
        browser.element('#main-action-button button').click();
    });

    Then(/^new page with data approval is displayed$/, () => {
        browser.element('h1').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('h1').getText().includes('Data Approval')).to.equal(true);
    });

    Then(/^return to previous page is displayed$/, () => {
        expect(browser.element('h1 span[class=material-icons]').getText()).to.equal('arrow_back');
    });

    Then(/^sub-title with selected filters is displayed$/, () => {
        browser.element('div[class=gridDiv]').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('div[class=gridDiv] h3').getText().includes(VALID_DATA_SET)).to.equal(true);
        expect(browser.element('div[class=gridDiv] h4').getText().includes(this.orgUnit)).to.equal(true);
        expect(browser.element('div[class=gridDiv] h4').getText().includes(this.selectedYear)).to.equal(true);
    });

    Then(/^approval status is displayed$/, () => {
        browser.element('#data-approval-status').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^table with results is displayed$/, () => {
        browser.element('.listTable').waitForVisible(DEFAULT_WAIT_TIME);
    });
});
