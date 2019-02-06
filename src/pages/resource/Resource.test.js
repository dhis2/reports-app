/* eslint-disable */
import React from 'react'
import { shallow } from 'enzyme'

/* d2-ui */
import Table from '@dhis2/d2-ui-table'
import { Pagination, InputField } from '@dhis2/d2-ui-core'

/* React Components */
import PageHelper from '../../components/PageHelper'

/* app config */
import { ADD_NEW_RESOURCE_ACTION, CONTEXT_MENU_ACTION } from './resource.conf'

import Resource from './Resource'

import fakerData from '../../utils/fakerTests'

import { sections, RESOURCE_SECTION_KEY } from '../sections.conf'

import { i18nKeys } from '../../utils/i18n/i18nKeys'

let pageInfo = {}
for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === RESOURCE_SECTION_KEY) {
        pageInfo = section.info
        break
    }
}

/* Mocks */
jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: 'OrgUnitTree',
}))

const documents = [
    {
        id: 'hKYLLpNinZR',
        external: true,
        displayName: 'DHIS 2 Home Page',
        url: 'http://dhis2.org',
    },
    {
        id: 'V8emVumNG4D',
        external: true,
        displayName: 'DHIS 2 Launchpad site',
        url: 'https://launchpad.net/dhis2',
    },
    {
        id: 'bhjS25ZgCxD',
        external: true,
        displayName: 'HISP EA Home Page',
        url: 'http://hispea.com',
    },
    {
        id: 'LMb4hjq8xWZ',
        external: false,
        displayName: 'Immunization health data report',
        url: 'data.xls',
    },
]

const ownShallow = () => {
    return shallow(
        <Resource
            sectionKey={RESOURCE_SECTION_KEY}
            pageInfo={pageInfo}
            updateFeedbackState={jest.fn()}
            currentSection={RESOURCE_SECTION_KEY}
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

describe('Test <Resource /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Renders without crashing', () => {
        ownShallow()
    })

    it('Should show correct title.', () => {
        expect(wrapper.find('h1')).toHaveLength(1)
        expect(wrapper.find('h1').text()).toBe(
            `${i18nKeys.resource.header}<PageHelper />`
        )
    })

    it('Should have a "PageHelper" component.', () => {
        expect(wrapper.find(PageHelper)).toHaveLength(1)
    })

    it('Should have a "Search" input.', () => {
        expect(wrapper.find('#search-box-id')).toHaveLength(1)
    })

    it('Should render header and footer pagination.', () => {
        const pageContent = wrapper.find('#resource-content')
        expect(pageContent.find(Pagination)).toHaveLength(2)
    })

    it('Should not render "Resource" table rows when no elements.', () => {
        const documents = []
        wrapper.setState({
            documents,
        })
        expect(wrapper.find(Table)).toHaveLength(1)
        expect(wrapper.find(Table).props().rows.length).toBe(0)
    })

    it('Should render a "Resource" table with correct columns.', () => {
        wrapper.setState({
            documents,
        })
        expect(wrapper.find(Table)).toHaveLength(1)
        expect(wrapper.find(Table).props().columns.length).toBe(1)
        expect(wrapper.find(Table).props().columns[0]).toBe('displayName')
        expect(
            wrapper.find('#no-resource-find-message-id').props().style.display
        ).toBe('none')
    })

    it('Should render a "Resource" table with correct rows.', () => {
        wrapper.setState({
            documents,
        })
        expect(wrapper.find(Table)).toHaveLength(1)
        expect(wrapper.find(Table).props().rows.length).toBe(4)
        expect(wrapper.find(Table).props().rows[0].displayName).toBe(
            documents[0].displayName
        )
        expect(wrapper.find(Table).props().rows[1].displayName).toBe(
            documents[1].displayName
        )
        expect(wrapper.find(Table).props().rows[2].displayName).toBe(
            documents[2].displayName
        )
        expect(wrapper.find(Table).props().rows[3].displayName).toBe(
            documents[3].displayName
        )
        expect(
            wrapper.find('#no-resource-find-message-id').props().style.display
        ).toBe('none')
    })

    it('Resource component renders Floating add button', () => {
        expect(wrapper.find('#add-resource-btn-id')).toHaveLength(1)
    })
})

describe('Test <Resource /> actions:', () => {
    /* Load Initial Data */
    it('Should call loadDocuments function when mount.', () => {
        const wrapper = ownShallow()
        wrapper.instance().loadDocuments = jest.fn()
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().loadDocuments).toHaveBeenCalled()
    })

    /* Search */
    it('Should call search action on search InputField "onChange".', () => {
        const wrapper = ownShallow()
        wrapper.instance().debounceSearch = jest.fn()
        wrapper.setState({
            search: 'searchWord',
        })
        wrapper.find(InputField).simulate('change')
        expect(wrapper.instance().debounceSearch).toHaveBeenCalled()
    })

    /* Add New */
    it('Should call addNewResource action when Add button clicked.', () => {
        const spy = spyOn(
            Resource.prototype,
            'addNewResource'
        ).and.callThrough()
        const wrapper = ownShallow()
        wrapper.find('#add-resource-btn-id').simulate('click')
        expect(spy).toHaveBeenCalled()
        expect(wrapper.state().selectedAction).toBe(ADD_NEW_RESOURCE_ACTION)
        expect(wrapper.state().open).toBe(true)
    })

    /* View Resource */
    it('Should update state properly for "View Resource" menu action.', () => {
        const wrapper = ownShallow()
        const args = { displayName: 'documentName', id: 'documentId' }
        wrapper.instance().viewResource(args)
        expect(wrapper.state().selectedResource.displayName).toBe(
            'documentName'
        )
        expect(wrapper.state().selectedAction).toBe(CONTEXT_MENU_ACTION.VIEW)
        expect(wrapper.state().open).toBe(true)
    })

    it('Should call correct component for "View Resource" action.', () => {
        const spy = spyOn(Resource.prototype, 'getViewResourceComponent')
        const wrapper = ownShallow()
        wrapper.setState({
            open: true,
            selectedResource: 'selectedResource',
            selectedAction: CONTEXT_MENU_ACTION.VIEW,
        })
        wrapper.instance().getActionComponent()
        expect(spy).toHaveBeenCalled()
    })

    /* Edit */
    it('Should update state properly for "Edit" menu action.', () => {
        const wrapper = ownShallow()
        const args = { displayName: 'nameEdit', id: 'idEdit' }
        wrapper.instance().editResource(args)
        expect(wrapper.state().selectedResource.displayName).toBe('nameEdit')
        expect(wrapper.state().selectedAction).toBe(CONTEXT_MENU_ACTION.EDIT)
        expect(wrapper.state().open).toBe(true)
    })

    it('Should call correct component for "Edit" action.', () => {
        const spy = spyOn(Resource.prototype, 'getEditComponent')
        const wrapper = ownShallow()
        wrapper.setState({
            open: true,
            selectedResource: 'editRResourec',
            selectedAction: CONTEXT_MENU_ACTION.EDIT,
        })
        wrapper.instance().getActionComponent()
        expect(spy).toHaveBeenCalled()
    })

    /* Sharing Settings  */
    it('Should update state properly for "Sharing settings" menu action.', () => {
        const wrapper = ownShallow()
        const args = {
            displayName: 'nameSharingSettings',
            id: 'idSharingSettings',
        }
        wrapper.instance().sharingSettings(args)
        expect(wrapper.state().selectedResource.displayName).toBe(
            'nameSharingSettings'
        )
        expect(wrapper.state().selectedAction).toBe(
            CONTEXT_MENU_ACTION.SHARING_SETTINGS
        )
        expect(wrapper.state().open).toBe(true)
    })

    it('Should call correct component for "Sharing settings" action.', () => {
        const spy = spyOn(Resource.prototype, 'getSharingDialog')
        const wrapper = ownShallow()
        wrapper.setState({
            open: true,
            selectedResource: 'sharingSettingsResource',
            selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
        })
        wrapper.instance().getActionComponent()
        expect(spy).toHaveBeenCalled()
    })

    /* Delete */
    it('Should allow "Delete" a resource.', () => {
        const wrapper = ownShallow()
        const args = { displayName: 'nameDelete', id: 'idDelete' }
        wrapper.instance().delete(args)
        expect(wrapper.instance().props.updateFeedbackState).toHaveBeenCalled()
    })

    /* Close dialog */
    it('Should update state when close dialog action is trigger.', () => {
        const wrapper = ownShallow()
        wrapper.setState({
            open: true,
            selectedResource: 'closeResource',
        })
        expect(wrapper.state().open).toBe(true)
        expect(wrapper.state().selectedResource).toBe('closeResource')
        wrapper.instance().handleClose()
        expect(wrapper.state().open).toBe(false)
        expect(wrapper.state().selectedResource).toBe(null)
    })

    it('Should reload documents when close dialog action is trigger with true', () => {
        const spy = spyOn(Resource.prototype, 'loadDocuments')
        const wrapper = ownShallow()
        wrapper.setState({
            open: true,
            selectedResource: 'closeResource',
        })
        expect(wrapper.state().open).toBe(true)
        expect(wrapper.state().selectedResource).toBe('closeResource')
        wrapper.instance().handleClose(true)
        expect(wrapper.state().open).toBe(false)
        expect(wrapper.state().selectedResource).toBe(null)
        expect(spy).toHaveBeenCalled()
    })

    /* Pagination */
    describe('Test pagination actions:', () => {
        let wrapper
        beforeEach(() => {
            wrapper = ownShallow()
        })

        it('Should have a "hasNextPage" function.', () => {
            expect(wrapper.instance().hasNextPage).toBeDefined()
            expect(typeof wrapper.instance().hasNextPage).toBe('function')
            wrapper.setState({
                pager: { page: 1, pageCount: 10 },
            })
            expect(wrapper.instance().hasNextPage()).toBe(true)
            wrapper.setState({
                pager: { page: 10, pageCount: 10 },
            })
            expect(wrapper.instance().hasNextPage()).toBe(false)
        })

        it('Should have a "hasPreviousPage" function.', () => {
            expect(wrapper.instance().hasPreviousPage).toBeDefined()
            expect(typeof wrapper.instance().hasPreviousPage).toBe('function')
            wrapper.setState({
                pager: { page: 10, pageCount: 10 },
            })
            expect(wrapper.instance().hasPreviousPage()).toBe(true)
            wrapper.setState({
                pager: { page: 0, pageCount: 10 },
            })
            expect(wrapper.instance().hasPreviousPage()).toBe(false)
        })

        it('Should have a "onNextPageClick" function.', () => {
            const spy = spyOn(Resource.prototype, 'loadDocuments')
            expect(wrapper.instance().onNextPageClick).toBeDefined()
            expect(typeof wrapper.instance().onNextPageClick).toBe('function')
            wrapper.setState({
                pager: { page: 1, pageCount: 10 },
            })
            wrapper.instance().onNextPageClick()
            expect(spy).toHaveBeenCalledWith({ page: 2, pageCount: 10 }, '')
        })

        it('Should have a "onPreviousPageClick" function.', () => {
            const spy = spyOn(Resource.prototype, 'loadDocuments')
            expect(wrapper.instance().onPreviousPageClick).toBeDefined()
            expect(typeof wrapper.instance().onPreviousPageClick).toBe(
                'function'
            )
            wrapper.setState({
                pager: { page: 2, pageCount: 10 },
            })
            wrapper.instance().onPreviousPageClick()
            expect(spy).toHaveBeenCalledWith({ page: 1, pageCount: 10 }, '')
        })
    })
})
