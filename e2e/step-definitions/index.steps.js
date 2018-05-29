const steps = [
    require('./shared.steps'),
    require('./home.steps'),
];

module.exports = function () {
    steps.forEach(function (step) {
        step.call(this);
    }.bind(this));
};
