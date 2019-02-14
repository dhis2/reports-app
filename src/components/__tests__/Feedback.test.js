import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer'
import { SUCCESS, ERROR, WARNING } from '../../utils/feedbackTypes'
import { Feedback } from '../Feedback'

jest.mock('@dhis2/d2-ui-core', () => ({
    FeedbackSnackbar: 'FeedbackSnackbar',
    CircularProgress: 'CircularProgress',
}))

describe('<Feedback />', () => {
    const defaultProps = {
        showSnackbar: false,
        showLoader: false,
        message: '',
        type: '',
        action: undefined,
        onClose: jest.fn(),
    }
    const componentRenderer = createComponentRenderer(Feedback, defaultProps)

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render a loader when showLoader is true', () => {
        expect(componentRenderer({ showLoader: true })).toMatchSnapshot()
    })

    it('can render a default snackbar message', () => {
        expect(
            componentRenderer({ showSnackbar: true, message: 'Message body' })
        ).toMatchSnapshot()
    })

    it('can render a success snackbar message', () => {
        expect(
            componentRenderer({
                showSnackbar: true,
                message: 'Message body',
                type: SUCCESS,
            })
        ).toMatchSnapshot()
    })

    it('can render a warning snackbar message', () => {
        expect(
            componentRenderer({
                showSnackbar: true,
                message: 'Message body',
                type: WARNING,
            })
        ).toMatchSnapshot()
    })

    it('can render an error snackbar message', () => {
        expect(
            componentRenderer({
                showSnackbar: true,
                message: 'Message body',
                type: ERROR,
            })
        ).toMatchSnapshot()
    })
})
