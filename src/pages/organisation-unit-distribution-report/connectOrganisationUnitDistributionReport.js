import { connect } from 'react-redux'
import {
    loadingChartImageUrlStart,
    loadingChartImageUrlSuccessWithFeedback,
    loadingChartImageUrlErrorWithFeedback,
} from '../../redux/actions/orgUnitDistReport'
import { getChartImageUrl } from '../../redux/selectors/orgUnitDistReport/getChartImageUrl'
import { getLoading } from '../../redux/selectors/orgUnitDistReport/getLoading'

const mapStateToProps = state => ({
    imageUrl: getChartImageUrl(state),
    displayImage: state.orgUnitDistReport.displayImage,
    loading: getLoading(state),
})

const mapDispatchToProps = dispatch => ({
    loadImage: () => dispatch(loadingChartImageUrlStart()),
    handleChartLoaded: () =>
        dispatch(loadingChartImageUrlSuccessWithFeedback()),
    handleChartLoadingError: () =>
        dispatch(loadingChartImageUrlErrorWithFeedback()),
})

export const connectOrganisationUnitDistributionReport = connect(
    mapStateToProps,
    mapDispatchToProps
)
