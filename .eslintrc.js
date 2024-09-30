const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        'max-params': [
            'error',
            {
                max: 4,
            },
        ],
        'react/no-unknown-property': [
            'error',
            {
                ignore: ['jsx', 'global'],
            },
        ],
    },
}
