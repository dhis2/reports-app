import { DropDown } from '@dhis2/d2-ui-core'
import { shallow } from 'enzyme'
import React from 'react'
import { DatasetsDropdown } from '../DatasetsDropdown.js'

jest.mock('@dhis2/d2-ui-core', () => ({ DropDown: 'DropDown' }))

const ownShallow = () => {
    return shallow(
        <DatasetsDropdown
            loading={false}
            selected={{ id: '', displayName: '' }}
            options={[]}
            selectDataSet={jest.fn()}
        />
    )
}

describe('Test <DatasetsDropdown /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should render DropDown', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(DropDown)).toHaveLength(1)
    })
})
