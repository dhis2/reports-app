import React from 'react'
import { shallow } from 'enzyme'
import createComponentRenderer from '../../utils/test-helpers/createComponentRenderer'
import {
    DimensionDropdown,
    DataDimensionsContent,
    OriginalComponent as DataSetDimensions,
} from '../DataSetDimensions'

describe('<DimensionDropdown/>', () => {
    it('Matches the snapshot', () => {
        const props = {
            dimension: {
                id: 'test',
                displayName: 'Test',
                items: [1, 2, 3],
            },
            fullWidth: true,
            values: {
                test: 'Test',
            },
            onChange: jest.fn(),
        }
        const wrapper = shallow(<DimensionDropdown {...props} />)
        expect(wrapper).toMatchSnapshot()
    })
})
