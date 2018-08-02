const Page = require('./page');

class OrganisationUnitDistributionReportPage extends Page {
    open() {
        browser.url('#/organisation-unit-distribution-report');
    }
}

module.exports = new OrganisationUnitDistributionReportPage();