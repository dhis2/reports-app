const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');

defineSupportCode(({Given, When, Then}) => {
    Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
        dhis2Page.open();
        if (!dhis2Page.isLoggedIn()) {
            dhis2Page.submitLoginForm('admin', 'district');
        }
        expect(dhis2Page.isLoggedIn()).to.equal(true);
    });
});
