const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const home = require('../pages/home.page');

defineSupportCode(({Given, When, Then}) => {
    Given(/^I am on home$/, () => {
        home.open();
    });
});
