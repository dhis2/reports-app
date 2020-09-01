import Paper from '@material-ui/core/Paper'
import React from 'react'

import { shallow } from 'enzyme'

import {
    STANDARD_REPORT_SECTION_KEY,
    sections,
} from '../../config/sections.config'
import MenuElement from '../MenuElement'

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(
        <MenuElement entry={sections[STANDARD_REPORT_SECTION_KEY].info} />,
        {
            disableLifecycleMethods: true,
        }
    )
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => 'OrgUnitTree')

describe('Test <MenuElement /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing.', () => {
        ownShallow()
    })

    it('Renders a section on Paper.', () => {
        expect(wrapper.find(Paper)).toHaveLength(1)
    })

    it('Renders correct section title.', () => {
        expect(wrapper.find('.section-title-bar')).toHaveLength(1)
    })

    it('Renders correct section description.', () => {
        expect(wrapper.find('.section-description')).toHaveLength(1)
    })

    it('Renders correct section action text.', () => {
        expect(wrapper.find('.section-action-text')).toHaveLength(1)
    })
})
