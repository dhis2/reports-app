import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer.jsx'
import { AvailableOrganisationUnitsTree } from '../AvailableOrganisationUnitsTree.jsx'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTreeMultipleRoots: 'OrgUnitTreeMultipleRoots',
}))

describe('<AvailableOrganisationUnitsTree />', () => {
    const selectMock = jest.fn()

    const defaultProps = {
        selectOrganisationUnit: selectMock,
        loading: false,
        loadingError: '',
        collection: [
            { id: 'abc123', path: '/abc123', displayName: 'Org 1' },
            { id: 'def456', path: '/def456', displayName: 'Org 2' },
        ],
        selected: { id: 'abc123', path: '/abc123' },
    }

    const render = createComponentRenderer(
        AvailableOrganisationUnitsTree,
        defaultProps
    )

    afterEach(() => {
        selectMock.mockClear()
    })

    it('renders a loading message when loading=true', () => {
        const wrapper = render({ loading: true })
        expect(wrapper.text()).toContain('Updating Organisation Units Tree...')
        expect(wrapper.find('OrgUnitTreeMultipleRoots').exists()).toBe(false)
    })

    it('renders OrgUnitTreeMultipleRoots when ready', () => {
        const wrapper = render({ loading: false })

        const tree = wrapper.find('OrgUnitTreeMultipleRoots')
        expect(tree.exists()).toBe(true)
        expect(tree.prop('roots')).toEqual(defaultProps.collection)
        expect(tree.prop('selected')).toEqual(['/abc123'])
        expect(tree.prop('initiallyExpanded')).toEqual(['/abc123', '/def456'])
    })

    it('calls selectOrganisationUnit on node select', () => {
        const wrapper = render()
        const tree = wrapper.find('OrgUnitTreeMultipleRoots')
        tree.prop('onSelectClick')({ id: 'xyz', path: '/xyz' })

        expect(selectMock).toHaveBeenCalledWith({ id: 'xyz', path: '/xyz' })
    })
})
