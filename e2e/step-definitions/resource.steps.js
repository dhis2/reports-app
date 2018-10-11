const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const path = require('path');

const resource = require('../pages/resource.page');

const DEFAULT_WAIT_TIME = 5000;

defineSupportCode(({Given, When, Then}) => {

    // *********************************************************
    // Shared
    // *********************************************************
    When(/^I open Resource page$/, () => {
        resource.open();
    });

    Then(/^I click add resource button$/, () => {
        browser.element('.data-table-pager > ul > li').waitForVisible(DEFAULT_WAIT_TIME);
        this.numberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        browser.element('#add-resource-btn-container-id button').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('#add-resource-btn-container-id button').click();
        browser.element('#add-edit-resource-form-id').waitForVisible(DEFAULT_WAIT_TIME);
    });


    Then(/^click save resource$/, () => {
        browser.element('#save-action-btn-id').click();
    });

    Then(/^a new resource was created$/, () => {
        browser.pause(DEFAULT_WAIT_TIME * 2); // Upload takes a little bit "more"
        const newNumberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        expect(parseInt(newNumberOfItems, 10)).to.equal(parseInt(this.numberOfItems, 10) + 1);
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************

    // Global Shared: a pagination component is displayed

    // Global Shared: a search field is displayed

    Then(/^a table with list of resources is displayed$/, () => {
    });

    // Global Shared: each item of the list contains more options icon

    Then(/^button to add resource is displayed$/, () => {
        browser.element('#add-resource-btn-container-id').waitForVisible(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    // Scenario: I want to add new resource from URL
    // *********************************************************

    // Shared: I click add resource button

    Then(/^I insert name for url resourse$/, () => {
        browser.element('#add-edit-resource-form-id')
            .element('input[id*=Name][type=text]')
            .setValue('1 Test - URL Resource');
    });

    Then(/^I select External URL$/, () => {
        browser.element('.d2-ui-selectfield div[id*=Type] button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(2)').click();
    });
    Then(/^insert URL$/, () => {
        browser.pause(DEFAULT_WAIT_TIME);
        browser.element('#add-edit-resource-form-id')
            .element('input[id*=URL][type=text]')
            .setValue('www.google.com');
    });

    // Shared: click save resource

    // Shared: a new resource was created

    // *********************************************************
    // Scenario: I want to add new resource from file
    // *********************************************************

    // Shared: I click add resource button

    Then(/^I insert name for file resource$/, () => {
        browser.element('#add-edit-resource-form-id')
            .element('input[id*=Name][type=text]')
            .setValue('0 Test - File Resource');
    });

    Then(/^I select Upload File$/, () => {
        browser.element('.d2-ui-selectfield div[id*=Type] button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(1)').click();
    });

    Then(/^choose file from computer$/, () => {
        const filePath = path.join(__dirname, '..', 'files', 'pdf_resource.pdf');
        browser.chooseFile('input[name=hiddenInputFile]', filePath);
    });

    // Shared: click save resource

    // Shared: a new resource was created

    // *********************************************************
    // Scenario: I want to delete a resource
    // *********************************************************

    Then(/^I click more options icon on the resource I want to delete$/, () => {
        browser.element('.data-table-pager > ul > li').waitForVisible(DEFAULT_WAIT_TIME);
        this.numberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        this.oldVisibleReports = browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value.length;
        resource.getContextMenuBtnForResourceFromList(0).click();
    });

    Then(/^I select option to delete resource$/, () => {
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table__context-menu :nth-child(4) > span').click();
    });

    // Global Shared: confirm the deletion

    Then(/^the resource is removed form resources list$/, () => {
        browser.pause(DEFAULT_WAIT_TIME); // Reload list
        const newNumberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        expect(parseInt(newNumberOfItems, 10)).to.equal(parseInt(this.numberOfItems, 10) - 1);
    });
});
