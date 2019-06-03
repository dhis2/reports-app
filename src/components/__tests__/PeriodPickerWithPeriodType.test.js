import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer'
import { PeriodPickerWithPeriodType } from '../PeriodPickerWithPeriodType'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
    PeriodPicker: 'PeriodPicker',
}))

describe('Test <PeriodPickerWithPeriodType /> rendering:', () => {
    const selectPeriodTypeMock = jest.fn()
    const selectPeriodMock = jest.fn()
    const collectionMock = [
        { id: '1', displayName: 'Yes' },
        { id: '2', displayName: 'No' },
    ]

    const defaultProps = {
        selectPeriodType: selectPeriodTypeMock,
        selectPeriod: selectPeriodMock,
        label: 'This is my label',
        collection: collectionMock,
        loading: false,
        selectedPeriodType: '',
    }

    const componentRenderer = createComponentRenderer(
        PeriodPickerWithPeriodType,
        defaultProps
    )

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('It should render a <PeriodTypeDropDown/> when selectedPeriodType is falsy', () => {
        expect(componentRenderer()).toMatchSnapshot()
    })

    it('It should render a <PeriodTypeDropDown/> and <PeriodPicker/> when selectedPeriodType is truthy', () => {
        expect(
            componentRenderer({ selectedPeriodType: 'Quarterly' })
        ).toMatchSnapshot()
    })

    it('It should render the parsed period when a period has been selected', () => {
        expect(
            componentRenderer({
                selectedPeriodType: 'Daily',
                selectedPeriod: '20180101',
            })
        ).toMatchSnapshot()
    })
})
