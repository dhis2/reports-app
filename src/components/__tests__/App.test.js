import React from 'react'
import { shallow } from 'enzyme'
import { App } from '../../App'

jest.mock('@dhis2/ui/widgets/HeaderBar', () => 'HeaderBar')
jest.mock('../AppRouter.js', () => 'AppRouter')

describe('<App/>', () => {
    const props = {
        currentSection: 'test',
        d2: {},
        loadPeriodTypes: jest.fn(),
        loadDataSetOptions: jest.fn(),
        loadOrganisationUnits: jest.fn(),
    }
    const wrapper = shallow(<App {...props} />)

    it('Matches the snapshot', () => {
        expect(wrapper).toMatchSnapshot()
    })
    it('loads the correct data', () => {
        expect(props.loadPeriodTypes).toHaveBeenCalledTimes(1)
        expect(props.loadDataSetOptions).toHaveBeenCalledTimes(1)
        expect(props.loadOrganisationUnits).toHaveBeenCalledTimes(1)
    })
})
