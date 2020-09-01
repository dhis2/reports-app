const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        'max-params': [
            2,
            {
                max: 4,
            },
        ],
    },
}
