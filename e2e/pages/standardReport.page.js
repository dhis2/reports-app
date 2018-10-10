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

    // when adding / removing user access DOM structure has different number of divs
    processAccessRulesNumber(number) {
        return number > 3 ? number - 1 : number;
    }

    confirmRemoveSnackbar() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        const snackbar = browser.element('#feedbackSnackbarId');
        const confirmBtn = snackbar.elements('<button>').value[0];
        return confirmBtn;
    }
}

module.exports = new StandardReportPage();
