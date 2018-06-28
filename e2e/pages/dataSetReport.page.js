const Page = require('./page');

class DataSetReportPage extends Page {
    open() {
        browser.url('#/data-set-report');
    }
}

module.exports = new DataSetReportPage();
