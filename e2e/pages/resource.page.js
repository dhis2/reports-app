const Page = require('./page');

const DEFAULT_WAIT_TIME = 5000;

class ResourcePage extends Page {
    open() {
        browser.url('#/resource');
    }

    getContextMenuBtnForResourceFromList(index) {
        return browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value[index].element('<button>');
    }

    fillResourceName(name) {
        browser.element('#add-edit-resource-form-id')
            .element('input[id*=Name][type=text]')
            .setValue(name);
    }

    selectExternalUrlType() {
        browser.element('.d2-ui-selectfield div[id*=Type] button').click();
        browser.element('div[role=menu]').waitForVisible(DEFAULT_WAIT_TIME);
        browser.element('div[role=menu] :nth-child(2)').click();
    }

    insertExternalUrl() {
        browser.pause(DEFAULT_WAIT_TIME);
        browser.element('#add-edit-resource-form-id')
            .element('input[id*=URL][type=text]')
            .setValue('www.google.com');
    }

    // when adding / removing user access DOM structure has different number of divs
    processAccessRulesNumber(number) {
        return number > 3 ? number - 1 : number;
    }
}

module.exports = new ResourcePage();
