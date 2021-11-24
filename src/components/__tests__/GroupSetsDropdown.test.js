import { DropDown } from '@dhis2/d2-ui-core'
import { shallow } from 'enzyme'
import React from 'react'
import { GroupSetsDropdown } from '../GroupSetsDropdown.js'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
}))

const onChange = jest.fn()
const ownShallow = () => {
    return shallow(
        <GroupSetsDropdown
            collection={[]}
            selected=""
            selectGroupSet={onChange}
        />
    )
}

describe('Test <GroupSetsDropdown /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should render DropDown', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(DropDown)).toHaveLength(1)
    })
})
