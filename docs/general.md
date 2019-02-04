# General information

This are general information on how this app works internally

## Loading the initial data for each section

As we're using redux thunk, there's no way to react to the
route-change action. We therefore provide the action thunk
that will load the initial data to the root component of each
section, which will be called in the `componentDidMount` method.

## Giving feedback to the user

This is done with the Feedback component,
which uses and renders the d2-ui snackbar internally.

### Changing/Adding behavior that requires confirmation

The configuration of the Feedback component (snackbartype, -message and -onActionClick)
is stored in the redux state and set with the reducer for each section.
As some section will include functionality that required confirmation,
such as deleting items from the DB, due to the limitations of redux-thunks,
each section has it's own Feebback component.
To prevent actions from being stored in the state, the onActionClick
callback which is required by the Feedback component, has to provided
during rendering.
