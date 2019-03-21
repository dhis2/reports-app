import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress } from '@dhis2/d2-ui-core'
import styles from '../../utils/styles'
import { getShowLoading } from '../../redux/selectors/feedback/getShowLoading'

const Loader = props =>
    props.show ? (
        <div style={styles.loadingContainer}>
            <div style={styles.feedbackSnackBar}>
                <CircularProgress />
            </div>
        </div>
    ) : null

Loader.propTypes = {
    show: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    show: getShowLoading(state),
})

const connectedLoader = connect(mapStateToProps)(Loader)

export { connectedLoader as Loader, Loader as LoaderOriginal }
