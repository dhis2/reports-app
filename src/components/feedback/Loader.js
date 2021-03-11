import { CircularProgress } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getShowLoading } from '../../redux/selectors/feedback/getShowLoading'

const Loader = props =>
    props.show ? (
        <div className="loading-container">
            <div className="progress-wrap">
                <CircularProgress />
            </div>
            <style jsx>{`
                .loading-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 3000;
                }
                .progress-wrap {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: 'translate(-50%, -50%)';
                }
            `}</style>
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
