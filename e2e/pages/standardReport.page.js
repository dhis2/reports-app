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
}

module.exports = new StandardReportPage();
