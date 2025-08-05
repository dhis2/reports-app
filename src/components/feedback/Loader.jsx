import { CircularProgress } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getShowLoading } from '../../redux/selectors/feedback/getShowLoading.js'
import styles from './Loader.module.css'

const Loader = ({ show }) =>
    show ? (
        <div className={styles.loadingContainer}>
            <div className={styles.progressWrap}>
                <CircularProgress />
            </div>
        </div>
    ) : null

Loader.propTypes = {
    show: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    show: getShowLoading(state),
})

const connectedLoader = connect(mapStateToProps)(Loader)

export { connectedLoader as Loader, Loader as LoaderOriginal }
