import Checkbox from '@material-ui/core/Checkbox'
import PropTypes from 'prop-types'
import { formInput } from '../../utils/react/propTypes.js'
import styles from './CheckBox.module.css'

export const CheckBox = (props) => (
    <div className={styles.formCheckbox}>
        <div className={styles.inputContainer}>
            <Checkbox
                id={props.input.name + props.input.value}
                {...props.input}
                type="checkbox"
                className={styles.checkbox}
            />
        </div>

        <label
            className={styles.labelContainer}
            htmlFor={props.input.name + props.input.value}
        >
            {props.label}
        </label>
    </div>
)

CheckBox.propTypes = {
    input: formInput.isRequired,
    label: PropTypes.string.isRequired,
}
