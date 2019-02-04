/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* d2-ui components */
import { Button, InputField } from '@dhis2/d2-ui-core';

import { Share } from './Share';

/* fake data */
import fakerData from '../../utils/fakerTests';

jest.mock('@dhis2/d2-ui-core', () => ({
    Button: ('Button'),
    InputField: ('InputField'),
}));

const ownShallow = () => {
    return shallow(
        <Share
            d2={fakerData.d2}
            updateFeedbackState={jest.fn()}
            period="2018"
            orgUnitId="orgUnitId"
            dataSetId="dataSetId"
        />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <Share /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should renders InputField', () => {
        expect(wrapper.find(InputField)).toHaveLength(1);
    });

    it('Should renders Button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('Should have a Button disabled', () => {
        expect(wrapper.find(Button).props().disabled).toBeTruthy();
    });

    it('Should enable button when comment is defined', () => {
        wrapper.setState({ comment: 'Comment' });
        expect(wrapper.find(Button).props().disabled).toBeFalsy();
    });
});

describe('Test <Share /> actions:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should changes comment state when InputField changes.', () => {
        const newComment = 'new comment';
        wrapper.find(InputField).simulate('change', newComment);
        expect(wrapper.state('comment')).toEqual(newComment);
    });

    it('Should call shareComment function when button is clicked.', () => {
        wrapper.instance().shareComment = jest.fn();
        wrapper.setState({ comment: 'Comment' });
        wrapper.update();
        wrapper.find(Button).simulate('click');
        expect(wrapper.instance().shareComment).toHaveBeenCalled();
    });
});
