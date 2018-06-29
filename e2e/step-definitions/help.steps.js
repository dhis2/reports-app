const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {
    When(/^I click help icon$/, () => {
        this.tabsCount = browser.getTabIds().length;
        browser.waitForVisible('.helper-icon', 5000);
        browser.element('.helper-icon').click();
    });

    Then(/^A documentation page in a new tab is opened$/, () => {
        expect(browser.getTabIds().length).to.equal(this.tabsCount + 1);
    });
});