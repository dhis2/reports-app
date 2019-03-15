# General information

This are general information on how this app works internally.
If you need info on a specific section, please refer to the section's docs:

-   [Standard report](./sections/standard-reports.md)
-   [Data set report](./sections/data-set-report.md)
-   [Reporting summary rate](./sections/reporting-rate-summary.md)
-   [Resource](./sections/resources.md)
-   [Organisation unit distribution report](./sections/organisation-unit-distribution-report.md)

Other topics that might be interesting:

-   [State management with redux](./redux.md)
-   [Code architecture](./architecture.md)
-   [Form handling](./forms.md)

## Loading the initial data for each section

As we're using redux thunk, there's no way to react to the
route-change action. We therefore provide the action thunk
that will load the initial data to the root component of each
section, which will be called in the `componentDidMount` method.

## Loading initial data for multiple sections

Most sections share data that needs to be loaded only once,
e. g. the organisatin units. These will be loaded in the App.js

## Blocking the UI during loading time

Some data is cruicial for the app to function correctly.
There's a `blockUi` selector, used by the `Loader` component,
in order to prevent the user from interacting with the app while
it's not ready.

### Non-blocking loading states

Some loading states won't require to prevent the user from interacting
with the UI, like dynamically loading form select options. While the
respective select should be disabled, there's no reason to prevent the user
from editing the other form fields.

## Giving feedback to the user

There are two different components for giving feedback:

1. The [`Loader`](../src/components/feedback/Loader.js) component
2. The [`Snackbar`](../src/components/feedback/Snackbar.js) component

While the `Loader` component simply shows a loading spinner and prevents the user
from interacting with the UI, the Snackbar provides information to the user and
can require confirmation for certain action (e. g. deleting resources) but doesn't
prevent the user from doing other actions (which will be handled as a cancel when
the Snackbar asks for confirmation).

### Changing/Adding behavior that requires confirmation

The configuration of the Feedback component (snackbar type, message and onActionClick)
is stored in its own redux state.
As some section will include functionality that required confirmation,
such as deleting items from the DB, each section has it's own Snackbar component.
To prevent actions from being stored in the state, the onActionClick
callback which is required by the Feedback component when asking for confirmation,
has to be provided during rendering.
