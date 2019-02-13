import React from 'react'
import { shallow } from 'enzyme'
import { DropDown } from '@dhis2/d2-ui-core'
import { DatasetsDropdown } from '../DatasetsDropdown'
import fakerData from '../../utils/fakerTests'

jest.mock('@dhis2/d2-ui-core', () => ({ DropDown: 'DropDown' }))

const ownShallow = () => {
    return shallow(
        <DatasetsDropdown
            selected={{ id: '', displayName: '' }}
            options={[]}
            selectDataSet={jest.fn()}
        />
    )
}

describe('Test <DatasetsDropdown /> rendering:', () => {
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
