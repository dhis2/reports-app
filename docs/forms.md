# Form handling

## Generating reports

These forms contain connected form components.
Most of the options can be shared across sections, like the org units or data sets.
There is no special form handling here, they are not wrapped with a form element.
Actions happen when the onClick callback on the submit button is called.

#### Possible future changes

In the future we could rewrite this to react-final-form, but that's too much work
for now as everything is working quite nicely and the form validation is very simple,
there no interfield dependencies.

## Adding/Editing standard reports and resources

As these forms are more complex, we've introduced react-final-form for form handling.
In order to have unified styling across forms, there are some helper components in
the [form components](../src/components/form) directory.

Components for individual inputs (like `input`, `select`, `checkbox`, etc)
