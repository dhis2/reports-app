/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'

import { GroupSetsDropdown } from './GroupSetsDropdown'

/* fake data */
import fakerData from '../../utils/fakerTests'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
}))

const ownShallow = () => {
    const onChange = jest.fn()
    return shallow(
        <GroupSetsDropdown d2={fakerData.d2} onChange={onChange} />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <GroupSetsDropdown /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should render DropDown', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(DropDown)).toHaveLength(1)
    })
})
