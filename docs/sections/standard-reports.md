# Standard Reports

If you want to know what standard reports are, please refer to the end-user manual
found on our [docs page](https://docs.dhis2.org).

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
