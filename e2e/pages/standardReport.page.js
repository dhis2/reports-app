const Page = require('./page');

class StandardReportPage extends Page {
    open() {
        browser.url('#/standard-report');
    }

    get organisationUnitTreeView() {
        return browser.element('.tree-view');
    }

    getOneOrgUnitTreeFromTreeByIndex(index) {
        return this.organisationUnitTreeView.elements('div[role=button]').value[index].element('<input>');
    }

    getContextMenuBtnForReportFromList(index) {
        return browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value[index].element('<button>');
    }

    getNameOfReportFromList(index) {
        return browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value[index]
            .element('div > span').getText();
    }
}

module.exports = new StandardReportPage();
