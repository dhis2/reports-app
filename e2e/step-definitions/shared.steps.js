const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');

const DEFAULT_WAIT_TIME = 5000;

defineSupportCode(({Given, When, Then}) => {
    Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
        dhis2Page.open();
        if (!dhis2Page.isLoggedIn()) {
            dhis2Page.submitLoginForm('admin', 'district');
        }
        expect(dhis2Page.isLoggedIn()).to.equal(true);
    });

    // Standard Report and Resource
    Then(/^a pagination component is displayed$/, () => {
        browser.element('.data-table-pager').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^a search field is displayed$/, () => {
        browser.element('#search-box-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^each item of the list contains more options icon$/, () => {
        const elements = browser.elements('.d2-ui-table__rows__row').value;
        const contextMenuElements = browser.element('.d2-ui-table').elements('button').value;
        expect(elements.length).to.equal(contextMenuElements.length);
    });

    Then(/^confirm the deletion$/, () => {
        browser.waitForVisible('#feedbackSnackbarId', DEFAULT_WAIT_TIME);
        const snackbar = browser.element('#feedbackSnackbarId');
        snackbar.elements('<button>').value[0].click();
    });
});
