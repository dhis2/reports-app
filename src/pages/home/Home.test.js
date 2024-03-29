import { shallow } from 'enzyme'
import React from 'react'
import MenuElement from '../../components/MenuElement.js'
import { sectionOrder } from '../../config/sections.config.js'
import Home from './Home.js'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(<Home />, {
        disableLifecycleMethods: true,
    })
}

////[> Mocks <]
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

describe('Test <Home /> rendering:', () => {
    let wrapper

    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing.', () => {
        ownShallow()
    })

    it('Renders the correct number of elements.', () => {
        expect(wrapper.find(MenuElement)).toHaveLength(sectionOrder.length)
    })
})
