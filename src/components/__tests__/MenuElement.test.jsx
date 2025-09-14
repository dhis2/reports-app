import Paper from '@material-ui/core/Paper'
import { shallow } from 'enzyme'
import React from 'react'
import {
    STANDARD_REPORT_SECTION_KEY,
    sections,
} from '../../config/sections.config.js'
import MenuElement from '../MenuElement.jsx'

const ownShallow = () =>
    shallow(
        <MenuElement entry={sections[STANDARD_REPORT_SECTION_KEY].info} />,
        { disableLifecycleMethods: true }
    )

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
        expect(wrapper.find('[data-test="section-title-bar"]')).toHaveLength(1)
    })

    it('Renders correct section description.', () => {
        expect(wrapper.find('[data-test="section-description"]')).toHaveLength(
            1
        )
    })

    it('Renders correct section action text.', () => {
        expect(wrapper.find('[data-test="section-action-text"]')).toHaveLength(
            1
        )
    })
})
