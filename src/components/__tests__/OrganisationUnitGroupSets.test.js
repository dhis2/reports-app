import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer.js'
import { OrganisationUnitGroupSets } from '../OrganisationUnitGroupSets.js'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
}))

describe('Test <OrganisationUnitGroupSets /> rendering:', () => {
    const groupSets = [
        {
            id: 'organisationUnitGroupSet1',
            displayName: 'organisationUnitGroupSet1',
            organisationUnitGroups: [
                {
                    id: 'item1',
                    displayName: 'item1',
                },
            ],
        },
        {
            id: 'organisationUnitGroupSet2',
            displayName: 'organisationUnitGroupSet2',
            organisationUnitGroups: [
                {
                    id: 'item1',
                    displayName: 'item1',
                },
            ],
        },
    ]
    const selectGroupSet = jest.fn()
    const defaultProps = {
        groupSets,
        isLoading: false,
        selectGroupSet,
        values: {},
    }

    const componentRenderer = createComponentRenderer(
        OrganisationUnitGroupSets,
        defaultProps
    )

    it('It should match the snapshot', () => {
        expect(componentRenderer()).toMatchSnapshot()
    })

    it('Should render a loader when not ready', () => {
        expect(componentRenderer({ isLoading: true })).toMatchSnapshot()
    })
})
