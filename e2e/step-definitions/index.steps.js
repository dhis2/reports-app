const steps = [
    require('./shared.steps'),
    require('./home.steps'),
    require('./help.steps'),
    require('./standardReport.steps'),
    require('./getReportPages.steps'),
    require('./organisationUnitDistributionReport.steps'),
];

module.exports = function () {
    steps.forEach(function (step) {
        step.call(this);
    }.bind(this));
};
