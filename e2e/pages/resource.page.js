const Page = require('./page');

class ResourcePage extends Page {
    open() {
        browser.url('#/resource');
    }

    getContextMenuBtnForResourceFromList(index) {
        return browser.element('.d2-ui-table').elements('.d2-ui-table__rows__row').value[index].element('<button>');
    }

    confirmRemoveSnackbar() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        const snackbar = browser.element('#feedbackSnackbarId');
        const confirmBtn = snackbar.elements('<button>').value[0];
        return confirmBtn;
    }
}

module.exports = new ResourcePage();
