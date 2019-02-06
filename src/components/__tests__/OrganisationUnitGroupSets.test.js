/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* d2-ui components */
import { DropDown } from '@dhis2/d2-ui-core'

import { OrganisationUnitGroupSets } from '../OrganisationUnitGroupSets'

/* fake data */
import fakerData from '../../utils/fakerTests'

jest.mock('@dhis2/d2-ui-core', () => ({
    DropDown: 'DropDown',
}))

const organisationUnitGroupSets = [
    {
        id: 'organisationUnitGroupSet1',
        displayName: 'organisationUnitGroupSet1',
        organisationUnitGroups: [
            {
                id: 'item1',
                displayName: 'item1',
            },
        ],
    },
    {
        id: 'organisationUnitGroupSet2',
        displayName: 'organisationUnitGroupSet2',
        organisationUnitGroups: [
            {
                id: 'item1',
                displayName: 'item1',
            },
        ],
    },
]

const ownShallow = () => {
    const onChange = jest.fn()
    return shallow(
        <OrganisationUnitGroupSets
            d2={fakerData.d2}
            onChange={onChange}
            values={{}}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <OrganisationUnitGroupSets /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should render no DropDown', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(DropDown)).toHaveLength(0)
    })

    it('Should render the correct number of div for each DropDown Component', () => {
        const wrapper = ownShallow()
        wrapper.setState({
            organisationUnitGroupSets: organisationUnitGroupSets,
        })
        const arrayWrapper = wrapper.first() // Array wrapper for Dropdowns created by enzyme
        expect(arrayWrapper.find('div')).toHaveLength(
            organisationUnitGroupSets.length
        )
    })
})
