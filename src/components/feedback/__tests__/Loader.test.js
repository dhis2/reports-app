import createComponentRenderer from '../../../utils/test-helpers/createComponentRenderer'
import { Loader } from '../Loader'

jest.mock('@dhis2/d2-ui-core', () => ({
    FeedbackSnackbar: 'FeedbackSnackbar',
    CircularProgress: 'CircularProgress',
}))

describe('<Loader />', () => {
    const renderLoader = createComponentRenderer(Loader, {})

    it('should render loader when show is true', () => {
        expect(renderLoader({ show: true })).toMatchSnapshot()
    })

    it('should not render the loader when show is false', () => {
        expect(renderLoader({ show: false })).toMatchSnapshot()
    })
})
