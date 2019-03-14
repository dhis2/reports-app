# Resources

For documentation about resource, please refer to the end-user manual
found on our [docs page](https://docs.dhis2.org).

## Behavior

The resources section will show a list of the existing resources.
New reports can be added, existing reports can be filtered by name, edited, deleted.

#### Currently known bug

Resources with a file can not be modified, the respective endpoint throws an error.

### Loading resources from the DB

The initial resources list is loaded in the `componentDidMount` method of the
resources root component. They are reloaded when filtering
and after adding, editing or deleting reports.

### Deleting resources

In order to prevent the user from accidentally deleting a resource when clicking
on delete, we request a confirmation by the user.
