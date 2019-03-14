# Standard Reports

This document will describe how the internals of the app work and where to adjust
things if you want to contribute.
If you want to know what standard reports are, please refer to the end-user manual
found on our [docs page](https://docs.dhis2.org).

## State management

The state is mostly handled by redux, no big surprises here.
Some of the UI components have internal state like the sharing dialog.
Side-effects are handled with redux-thunk so pretty much everything should
live inside the `src/actions/standardReport.js` file.

## Behavior

The standard reports section will show a list of the available reports.
New reports can be added, existing reports can be filtered by name, edited, deleted.

### Loading reports from the DB

The initial reports are loaded in the `componentDidMount` method of the
standard reports root component. They are reloaded when filtering, adding,
editing or deleting reports.

### Deleting reports

In order to prevent the user from accidentally deleting a report when clicking
on delete, we request a confirmation by the user.
