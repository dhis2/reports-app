import createComponentRenderer from '../../utils/createComponentRenderer'

/* App components */
import { AvailableOrganisationUnitsTree } from '../AvailableOrganisationUnitsTree'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTreeMultipleRoots: 'OrgUnitTreeMultipleRoots',
}))

describe('Test <OrganisationUnitGroupSets /> rendering:', () => {
    const selectMock = jest.fn()

    const defaultProps = {
        selectOrganisationUnit: selectMock,
        ready: true,
        loadingError: '',
        collection: [],
        selected: null,
    }

    const componentRenderer = createComponentRenderer(
        AvailableOrganisationUnitsTree,
        defaultProps
    )

    afterEach(() => {
        selectMock.mockClear()
    })

    it('Should render OrgUnitTree when ready', () => {
        expect(componentRenderer()).toMatchSnapshot()
    })

    it('Should render a loading message when not ready', () => {
        expect(componentRenderer({ ready: false })).toMatchSnapshot()
    })

    it('Should render an error message when it has a loadingError', () => {
        expect(componentRenderer({ loadingError: 'Oops' })).toMatchSnapshot()
    })
})
