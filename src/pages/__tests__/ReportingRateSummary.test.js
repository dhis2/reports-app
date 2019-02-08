/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

import { Button, DropDown } from '@dhis2/d2-ui-core'

import ReportingRateSummary from './ReportingRateSummary'
import DataSets from '../../components/DatasetsDropdown'
import OrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree'
import OrganisationUnitGroupOptions from '../../components/OrganisationUnitGroupSets'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType'
import Report from '../../components/Report'

import fakerData from '../../utils/fakerTests'

import {
    sections,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
} from '../../config/sections.conf'

let pageInfo = {}
for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === REPORTING_RATE_SUMMARY_SECTION_KEY) {
        pageInfo = section.info
        break
    }
}

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const ownShallow = () => {
    return shallow(
        <ReportingRateSummary
            sectionKey={REPORTING_RATE_SUMMARY_SECTION_KEY}
            pageInfo={pageInfo}
            currentSection={REPORTING_RATE_SUMMARY_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <ReportingRateSummary /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should display form', () => {
        expect(
            wrapper.find('#report-rate-summary-form').props().style.display
        ).toBe('block')
    })

    it('Should render form with correct components', () => {
        const form = wrapper.find('#report-rate-summary-form')
        expect(form.find(OrganisationUnitsTree)).toHaveLength(1)
        expect(form.find('#extra-options-action')).toHaveLength(1) // show more options
        expect(form.find(DropDown)).toHaveLength(1) // criteria
        expect(form.find(DataSets)).toHaveLength(1)
        expect(form.find(PeriodPickerComponent)).toHaveLength(1)
        expect(form.find(Button)).toHaveLength(1)
    })

    it('Should display no form when showForm is false', () => {
        wrapper.setState({ showForm: false })
        expect(
            wrapper.find('#report-rate-summary-form').props().style.display
        ).toBe('none')
    })

    it('Should display no options when showOptions is false', () => {
        expect(wrapper.find('#extra-options').props().style.display).toBe(
            'none'
        )
    })

    it('Should display options when showOptions is true', () => {
        wrapper.setState({ showOptions: true })
        expect(wrapper.find('#extra-options').props().style.display).toBe(
            'block'
        )
    })

    it('Should render OrganisationUnitGroupOptions when showOptions is true', () => {
        wrapper.setState({ showOptions: true })
        const form = wrapper.find('#report-rate-summary-form')
        expect(form.find(OrganisationUnitGroupOptions)).toHaveLength(1)
    })

    it('Should have the form Button disabled', () => {
        const form = wrapper.find('#report-rate-summary-form')
        expect(form.find(Button).props().disabled).toBeTruthy()
    })

    it('Should enable form Button', () => {
        wrapper.setState({
            selectedOrgUnit: 'OrgUnitId',
            selectedPeriod: '2018',
            loading: false,
        })

        wrapper.update()
        expect(
            wrapper
                .find('#report-rate-summary-form')
                .find(Button)
                .props().disabled
        ).toBeFalsy()
    })

    it('Should render no report container', () => {
        expect(wrapper.find('#report-container')).toHaveLength(0)
    })

    it('Should render the correct components on report container', () => {
        wrapper.setState({
            reportHtml: '<div>Report</div>',
            showForm: false,
        })
        const reportContainer = wrapper.find('#report-container')
        expect(reportContainer.find('span')).toHaveLength(1) // Download button
        expect(reportContainer.find(Report)).toHaveLength(1)
    })
})

describe('Test <ReportingRateSummary /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should update selectedDataSet when DataSets selected', () => {
        const dataSet = { id: 'id' }
        wrapper.find(DataSets).simulate('change', dataSet)
        expect(wrapper.state('selectedDataSet')).toEqual(dataSet)
    })

    it('Should update toggle showOptions when option is clicked', () => {
        const showMoreOptions = wrapper
            .find('#report-rate-summary-form')
            .find('#extra-options-action')
        showMoreOptions.simulate('click')
        expect(wrapper.state('showOptions')).toBeTruthy()
        showMoreOptions.simulate('click')
        expect(wrapper.state('showOptions')).toBeFalsy()
    })

    it('Should call generateReport function when form button is clicked.', () => {
        wrapper.instance().getReport = jest.fn()
        wrapper.setState({
            selectedOrgUnit: 'OrgUnitId',
            selectedPeriod: '2018',
            loading: false,
        })
        wrapper.update()
        wrapper
            .find('#report-rate-summary-form')
            .find(Button)
            .simulate('click')
        expect(wrapper.instance().getReport).toHaveBeenCalled()
    })

    it('Should call exportReportToXls function when download button is clicked.', () => {
        wrapper.instance().exportReportToXls = jest.fn()
        wrapper.setState({
            reportHtml: '<div>Report</div>',
            showForm: false,
        })
        wrapper.update()
        wrapper
            .find('#report-container')
            .find('span')
            .simulate('click')
        expect(wrapper.instance().exportReportToXls).toHaveBeenCalled()
    })
})
