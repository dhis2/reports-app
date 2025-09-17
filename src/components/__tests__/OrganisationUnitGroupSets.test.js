import { CircularProgress } from '@material-ui/core'
import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer.jsx'
import {
    __OrganisationUnitGroupSets,
    OrganisationUnitGroupSetDropdown,
} from '../OrganisationUnitGroupSets.jsx'

describe('<OrganisationUnitGroupSets />', () => {
    const groupSets = [
        {
            id: 'organisationUnitGroupSet1',
            displayName: 'organisationUnitGroupSet1',
            organisationUnitGroups: [{ id: 'item1', displayName: 'item1' }],
        },
        {
            id: 'organisationUnitGroupSet2',
            displayName: 'organisationUnitGroupSet2',
            organisationUnitGroups: [{ id: 'item2', displayName: 'item2' }],
        },
    ]
    const selectGroupSet = jest.fn()
    const defaultProps = {
        groupSets,
        isLoading: false,
        selectGroupSet,
        values: {},
    }

    const render = createComponentRenderer(
        __OrganisationUnitGroupSets,
        defaultProps
    )

    it('renders a loader when isLoading is true', () => {
        const wrapper = render({ isLoading: true })
        expect(wrapper.find(CircularProgress).exists()).toBe(true)
    })

    it('renders one OrganisationUnitGroupSetDropdown per group set when not loading', () => {
        const wrapper = render()
        expect(wrapper.find(OrganisationUnitGroupSetDropdown)).toHaveLength(
            groupSets.length
        )
    })

    it('passes correct props to the first OrganisationUnitGroupSetDropdown', () => {
        const wrapper = render()
        const dropdown = wrapper.find(OrganisationUnitGroupSetDropdown).first()

        expect(dropdown.prop('groupSet')).toEqual(groupSets[0])
        expect(dropdown.prop('value')).toBe('')
        expect(typeof dropdown.prop('onChange')).toBe('function')
        expect(dropdown.prop('fullWidth')).toBe(true)
    })
})
