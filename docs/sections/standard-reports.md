# Standard Reports

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

### Editing a standard report

The report's details are not being loaded when the section loads the reports
in the componentDidMount. When the user clicks on the edit action in the
context menu, in contrast to the other actions, the `open` state is
not immediately set to true. The action creator dispatched when clicking on
the edit action is a thunk and itself dispatches an action to load the details
of the selected report. Only when the api responds with the details,
the `open` state is set to true.
