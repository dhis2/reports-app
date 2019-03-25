/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

import * as cssContainer from 'styled-jsx/css'
import css from 'styled-jsx/css'
import Home from './Home'
import MenuElement from '../../components/MenuElement'

import { sections } from '../../config/sections.config'

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

    ////let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing.', () => {
        ownShallow()
    })

    it('Renders the correct number of elements.', () => {
        expect(wrapper.find(MenuElement)).toHaveLength(sections.length)
    })
})
