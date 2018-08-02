const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const organisationUnitDistributionReport = require('../pages/organisationUnitDistributionReport.page');

const DEFAULT_WAIT_TIME = 5000;

const VALID_GROUP_SET = 'Area';

const assertCurrentGroupSet = (groupSet) => {
    expect(browser.element('#group-sets-selection > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)').getText()).to.equal(groupSet);
};

const getOneOrgUnitTreeFromTreeByIndex = (index) => {
    browser.element('.tree-view div[role=button]').waitForVisible(DEFAULT_WAIT_TIME);
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

const selectGroupSetWithName = (name) => {
    browser.element('#group-sets-selection').waitForVisible(DEFAULT_WAIT_TIME);
    browser.element('#group-sets-selection button').click();
    const menuItems = browser.elements('span[role=menuitem]').value;
    for (let menuItem of menuItems) {
        if (menuItem.element('div > div > div').getText() === name) {
            menuItem.click();
            break;
        }
    }
};

const selectValidGroupSet = () => {
    selectGroupSetWithName(VALID_GROUP_SET);
    browser.pause(DEFAULT_WAIT_TIME);
    assertCurrentGroupSet(VALID_GROUP_SET);
};

defineSupportCode(({Given, When, Then}) => {
    When(/^I open Organisation Unit Distribution Report page$/, () => {
        organisationUnitDistributionReport.open();
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^a column with parent organisation unit selection is displayed$/, () => {
        browser.element('.tree-view').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a group set without option selected$/, () => {
        browser.element('#group-sets-selection').waitForVisible(DEFAULT_WAIT_TIME);
        assertCurrentGroupSet('');
    });

    Then(/^a get report button disabled$/, () => {
        browser.element('#actions > div:nth-child(1) > button').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#actions > div:nth-child(1) > button').isEnabled()).to.equal(false);
    });

    Then(/^a get chart button disabled$/, () => {
        browser.element('#actions > div:nth-child(2) > button').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#actions > div:nth-child(2) > button').isEnabled()).to.equal(false);
    });

    // *********************************************************
    // Scenario: I want to get report
    // *********************************************************
    When(/^I select parent organisation unit$/, () => {
        getOneOrgUnitTreeFromTreeByIndex(0).click();
        expect(isOrganisationUnitSelected()).to.equal(true);
    });

    When(/^I select group set$/, () => {
        selectValidGroupSet();
    });

    When(/^click get report$/, () => {
        browser.element('#actions > div:nth-child(1) > button').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#actions > div:nth-child(1) > button').click();
    });

    Then(/^a new page is displayed$/, () => {
        browser.element('#report-container').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^button to return to previous page is displayed$/, () => {
        browser.element('#back-button').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a table with several columns with results is displayed$/, () => {
        browser.element('#report-container table').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^Option to download as XLS is displayed$/, () => {
        browser.element('#download-options-container').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    // Scenario: I want to get chart
    // *********************************************************
    When(/^click get chart/, () => {
        browser.element('#actions > div:nth-child(2) > button').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#actions > div:nth-child(2) > button').click();
    });

    Then(/^a chart with results is displayed$/, () => {
        browser.element('#report-container img').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    // Scenario: I want to return from results
    // *********************************************************
    When(/^click  button to return to previous page$/, () => {
        browser.element('#back-button').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#back-button').click();
    });

    Then(/^Organisation Unit Distribution Report page is displayed$/, () => {
        browser.element('#org-unit-dist-report-form').waitForVisible(DEFAULT_WAIT_TIME);
        expect(browser.element('#org-unit-dist-report-form').getCssProperty('display').value).to.equal('block');
    });

    // *********************************************************
    // Scenario: I want to se results for group set
    // *********************************************************
    When(/^I select group set value "(.+)"$/, (groupSet) => {
        selectGroupSetWithName(groupSet);
        browser.pause(DEFAULT_WAIT_TIME);
        assertCurrentGroupSet(groupSet);
    });
});