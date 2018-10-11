const Page = require('./page');

class DataApprovalPage extends Page {
    open() {
        browser.url('#/data-approval');
    }
}

module.exports = new DataApprovalPage();
