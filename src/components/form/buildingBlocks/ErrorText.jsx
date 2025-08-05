import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import styles from './ErrorText.module.css'

export const ErrorText = (props) => {
    if (!props.showErrorText) {
        return null
    }

    return (
        <FormHelperText>
            <span className={styles.errorText}>
                {props.error && props.touched ? props.error : ''}
            </span>
        </FormHelperText>
    )
}

ErrorText.propTypes = {
    error: PropTypes.string.isRequired,
    touched: PropTypes.bool.isRequired,
    showErrorText: PropTypes.bool,
}

ErrorText.defaultProps = {
    showErrorText: true,
}
