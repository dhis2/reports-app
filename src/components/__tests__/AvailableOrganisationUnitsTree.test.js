import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer'

/* App components */
import { AvailableOrganisationUnitsTree } from '../AvailableOrganisationUnitsTree'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTreeMultipleRoots: 'OrgUnitTreeMultipleRoots',
}))

describe('Test <AvailableOrganisationUnitsTree /> rendering:', () => {
    const selectMock = jest.fn()

    const defaultProps = {
        selectOrganisationUnit: selectMock,
        loading: false,
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
        expect(componentRenderer({ loading: true })).toMatchSnapshot()
    })
})
