import createComponentRenderer from '../../../utils/test-helpers/createComponentRenderer.jsx'
import { LoaderOriginal as Loader } from '../Loader.jsx'

jest.mock('@dhis2/d2-ui-core', () => ({
    FeedbackSnackbar: 'FeedbackSnackbar',
    CircularProgress: 'CircularProgress',
}))

describe('<Loader />', () => {
    const renderLoader = createComponentRenderer(Loader, {})

    it('renders loader when show is true', () => {
        const wrapper = renderLoader({ show: true })
        expect(wrapper.find('CircularProgress').exists()).toBe(true)
    })

    it('does not render loader when show is false', () => {
        const wrapper = renderLoader({ show: false })
        expect(wrapper.find('CircularProgress').exists()).toBe(false)
    })
})
