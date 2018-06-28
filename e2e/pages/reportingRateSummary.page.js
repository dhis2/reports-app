const Page = require('./page');

class ReportingRateSummaryPage extends Page {
    open() {
        browser.url('#/reporting-rate-summary');
    }
}

module.exports = new ReportingRateSummaryPage();