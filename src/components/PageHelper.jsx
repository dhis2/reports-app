import PropTypes from 'prop-types'
import styles from './PageHelper.module.css'

const PageHelper = ({ url }) => (
    <a
        className={`helper-icon material-icons ${styles.helperIcon}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
    >
        help
    </a>
)

PageHelper.propTypes = {
    url: PropTypes.string.isRequired,
}

export default PageHelper
