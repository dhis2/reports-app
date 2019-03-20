# Redux

Most of the redux stuff is pretty standard, no big surprises here.
Async/Side-effect code is handled with thunks, selectors are plain
js functions. There has been no need for reselect so far.

## Reducers

In order to be able to reuse state as much as possible, the state
structure is kept flat. The reducers for each section contain
only ui state data. All other data has its own reducer.

## Actions

In order to test thunks properly, thunks should never create action
objects themselves but make use of action creators. One such example
is giving feedback, here's a simplified example:

```js
const loadingDataSetsSuccess = dataSets => ({
    type: 'DATA_SETS_LOADING_SUCCESS',
    payload: dataSets,
})

const loadingDataSetSuccessWithFeedback = dataSets => dispatch => {
    dispatch(showFeedbackSuccess('Successfully loaded dataSets'))
    dispatch(loadingDataSetsSuccess(dataSets))
}

const loadDataSets = () => dispatch =>
    api
        .getDataSets()
        .then(dataSets =>
            dispatch(loadingDataSetsSuccessWithFeedback(dataSets))
        )
```

This way testing thunks is a lot easier. We're using the redux-mock-store
library and instead of repeating ourselved by copying the action created
by the action creators to the test code, we just import and use the action
creator. For a working example, have a look at the
[test for loading data sets](../src/redux/actions/__tests__/dataSet.test.js).
