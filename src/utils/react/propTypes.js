import PropTypes from 'prop-types'

export const children = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
])

export const reportContent = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
])

/**
 *
 * Form prop types
 *
 */
export const formInput = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
})

export const formInputMeta = PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string, // is undefined when no error..
})

export const formOption = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
})

export const formOptions = PropTypes.arrayOf(formOption)
