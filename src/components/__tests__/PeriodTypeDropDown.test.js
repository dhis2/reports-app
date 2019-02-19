import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer'
import PeriodTypeDropDown from '../PeriodTypeDropDown'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
    PeriodPicker: 'PeriodPicker',
}))

describe('Test <PeriodTypeDropDown /> rendering:', () => {
    const defaultProps = {
        loading: false,
    }

    const componentRenderer = createComponentRenderer(
        PeriodTypeDropDown,
        defaultProps
    )

    it('It should render a <DropDown /> when ready', () => {
        expect(componentRenderer()).toMatchSnapshot()
    })

    it('It should render a loading message when not ready', () => {
        expect(componentRenderer({ loading: true })).toMatchSnapshot()
    })
})
