const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const path = require('path');

const resource = require('../pages/resource.page');

const DEFAULT_WAIT_TIME = 5000;

defineSupportCode(({ Given, When, Then }) => {
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

    Then(/^I select option to view resource$/, () => {
        this.tabsCount = browser.getTabIds().length;
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table__context-menu :nth-child(1) > span').click();
    });

    Then(/^I click more options icon in the resource list item$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
        this.selectedResourceName = browser.elements('.d2-ui-table__rows__row').value[0]
            .element(':first-child').getText();
        resource.getContextMenuBtnForResourceFromList(0).click();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    Then(/^I select option to configure resource share settings$/, () => {
        browser.element('.d2-ui-table__context-menu :nth-child(3) > span').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table__context-menu :nth-child(3) > span').click();
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************

    // Global Shared: a pagination component is displayed

    // Global Shared: a search field is displayed

    Then(/^a table with list of resources is displayed$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
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
        resource.fillResourceName('1 Test - URL Resource');
    });

    Then(/^I select External URL$/, () => {
        resource.selectExternalUrlType();
    });
    Then(/^insert URL$/, () => {
        resource.insertExternalUrl();
    });

    // Shared: click save resource

    // Shared: a new resource was created

    // *********************************************************
    // Scenario: I want to add new resource from file
    // *********************************************************

    // Shared: I click add resource button

    Then(/^I insert name for file resource$/, () => {
        resource.fillResourceName('0 Test - File Resource');
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
    // Scenario: I want to cancel the add of new resource
    // *********************************************************

    // Shared: I click add resource button

    Then(/^fill resource form$/, () => {
        resource.fillResourceName('1 Test - URL Resource');
        resource.selectExternalUrlType();
        resource.insertExternalUrl();
    });

    Then(/^cancel add new resource action$/, () => {
        browser.waitForEnabled('#cancel-action-btn-id');
        browser.element('#cancel-action-btn-id').click();
    });

    Then(/^the new resource was not created$/, () => {
        const newNumberOfItems = browser.element('.data-table-pager > ul > li').getText().split('/')[1];
        expect(parseInt(newNumberOfItems, 10)).to.equal(parseInt(this.numberOfItems, 10));
    });

    // *********************************************************
    //  Scenario: I want see available options for resource
    // *********************************************************

    // Shared: I click more options icon in the resource list item

    Then(/^a list with several options for resource is displayed$/, () => {
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
    });

    Then(/^there is an option to view resource$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(1) > span > div > div > div').getText())
            .to.equal('View Resource');
    });

    Then(/^there is an option to edit resource$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(2) > span > div > div > div').getText())
            .to.equal('Edit Resource');
    });

    Then(/^there is an option to configure resource share settings$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(3) > span > div > div > div').getText())
            .to.equal('Sharing Settings');
    });

    Then(/^there is an option to delete the resource$/, () => {
        expect(browser.element('.d2-ui-table__context-menu :nth-child(4) > span > div > div > div').getText())
            .to.equal('Delete');
    });

    // *********************************************************
    //  Scenario: I want to see a resource from file
    // *********************************************************

    Then(/^I click more options icon in the resource list item configured with file$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
        resource.getContextMenuBtnForResourceFromList(0).click();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    // Shared: I select option to view resource

    Then(/^a resource from file is displayed$/, () => {
        expect(browser.getTabIds().length).to.equal(this.tabsCount + 1);
        // Switch to first open tab soo tests can continue
        browser.switchTab();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    //  Scenario: I want to see a resource from html
    // *********************************************************
    Then(/^I click more options icon in the resource list item configured with html$/, () => {
        browser.element('.d2-ui-table').waitForVisible(DEFAULT_WAIT_TIME);
        resource.getContextMenuBtnForResourceFromList(1).click();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    // Shared: I select option to view resource

    Then(/^a html resource is displayed$/, () => {
        expect(browser.getTabIds().length).to.equal(this.tabsCount + 1);
        // Switch to first open tab soo tests can continue
        browser.switchTab();
        browser.pause(DEFAULT_WAIT_TIME);
    });

    // *********************************************************
    //  Scenario: I want to edit a resource
    // *********************************************************

    // Shared: I click more options icon in the resource list item

    Then(/^I select option to edit resource$/, () => {
        browser.element('.d2-ui-table__context-menu').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('.d2-ui-table__context-menu :nth-child(2) > span').click();
    });

    Then(/^update the form resource$/, () => {
        resource.fillResourceName('0 Test - File Resource Edited');
    });

    // Shared: click save resource

    Then(/^the resource is updated$/, () => {
        expect(browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value[0].element('<div>')
            .getText()).to.equal('0 Test - File Resource Edited');
    });

    // *********************************************************
    //  Scenario: I want to see configure share settings of resource form
    // *********************************************************

    // Shared: I click more options icon in the resource list item

    // Shared: I select option to configure resource share settings

    Then(/^form with selected resource name is displayed$/, () => {
        browser.element('div[class^="MuiModal"]').waitForExist(DEFAULT_WAIT_TIME);
        browser.element('div[class^="MuiDialogTitle"]').waitForExist(DEFAULT_WAIT_TIME);
        expect(browser.element('div[class^="MuiDialogTitle"]').getText()).to.equal('Sharing settings');
        expect(browser.element('div[class^="MuiDialogContent"] > div > h2')
            .getText()).to.equal(this.selectedResourceName);
    });

    // *********************************************************
    //  Scenario: I want to configure share settings of resource
    // *********************************************************

    // Shared: I click more options icon in the resource list item

    // Shared: I select option to configure resource share settings

    Then(/^I change resource share rules/, () => {
        // nth-child(6) 6 - "rules list" once (1-title, 2-created by, 3-"div space", 4-label, 5-hr... )
        this.existingRules = browser.elements('div[class^="MuiDialogContent"] > div :nth-child(6) > div').value.length;
        this.existingRules = resource.processAccessRulesNumber(this.existingRules);
        if (this.existingRules > 3) {
            this.action = 'DELETE';
            browser.elements('div[class^="MuiDialogContent"] > div :nth-child(6) :nth-child(6) button')
                .value[1].click();
        } else {
            this.action = 'ADD';
            browser.element('#user-autocomplete-input').setValue('Jo');
            browser.element('div[role=tooltip]').waitForVisible(DEFAULT_WAIT_TIME);
            browser.element('div[role=tooltip] :nth-child(1)').click();
        }
    });

    Then(/^share settings of resource was updated$/, () => {
        browser.pause(DEFAULT_WAIT_TIME);
        const newRules = resource.processAccessRulesNumber(
            browser.elements('div[class^="MuiDialogContent"] > div :nth-child(6) > div').value.length,
        );
        if (this.action === 'DELETE') {
            expect(newRules).to.equal(this.existingRules - 1);
        } else {
            expect(newRules).to.equal(this.existingRules + 1);
        }
    });

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
