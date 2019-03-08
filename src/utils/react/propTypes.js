import PropTypes from 'prop-types'

/**
 *
 * Form prop types
 *
 */
export const formInput = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
})

export const formOption = PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
})

export const formOptions = PropTypes.arrayOf(formOption)
