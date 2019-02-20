import createComponentRenderer from '../../../utils/test-helpers/createComponentRenderer'
import { SUCCESS, ERROR, WARNING } from '../../../utils/feedbackTypes'
import { SnackbarOriginal as Snackbar } from '../Snackbar'

jest.mock('@dhis2/d2-ui-core', () => ({
    SnackbarSnackbar: 'SnackbarSnackbar',
    CircularProgress: 'CircularProgress',
}))

describe('<Snackbar />', () => {
    const defaultProps = {
        showSnackbar: false,
        showLoader: false,
        message: '',
        type: '',
        action: undefined,
        onClose: jest.fn(),
    }
    const renderSnackbar = createComponentRenderer(Snackbar, defaultProps)

    // for whatever reason jest can't import the feedbacksnackbar from d2-ui
    // and throws console errors....
    jest.spyOn(console, 'error').mockImplementation(() => null)

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('can render a default snackbar message', () => {
        expect(
            renderSnackbar({ showSnackbar: true, message: 'Message body' })
        ).toMatchSnapshot()
    })

    it('can render a success snackbar message', () => {
        expect(
            renderSnackbar({
                showSnackbar: true,
                message: 'Message body',
                type: SUCCESS,
            })
        ).toMatchSnapshot()
    })

    it('can render a warning snackbar message', () => {
        expect(
            renderSnackbar({
                showSnackbar: true,
                message: 'Message body',
                type: WARNING,
            })
        ).toMatchSnapshot()
    })

    it('can render an error snackbar message', () => {
        expect(
            renderSnackbar({
                showSnackbar: true,
                message: 'Message body',
                type: ERROR,
            })
        ).toMatchSnapshot()
    })
})
