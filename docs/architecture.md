# Architecture

## Organising code

When writing code, it will have a namespace (e. g. api).
The main functionality should be grouped in a file with the namespace (e. g. api.js).
When extracting code that's only used inside that namespace, it must be placed inside a folder
on the same level as the file with the same name of the file, e. g.:

```
src/
    utils/
        api/
            constants.js
            helpers.js
        api.js
```

## Folder structure

### Reusable components

All components that are not page specific are located in: [`src/components`](../src/components).

### General configuration

General configuration is located in: [`src/config`](../src/config).
If functionality is coupled with config, this is the wrong folder,
it should be placed in the [`src/utils`](../src/utils) folder together with the functionality.

### Page components

Components that are used on one page only can be found if: [`src/pages`](../src/pages).
The root page components for each section must be a class extending `React.Component`
and must be enhanced with the [`manageError`](../src/utils/pageEnhancers/manageError.HOC.js) HOC.

### Redux

As all the redux components are tightly coupled with the redux library,
there's no need to have the `actions`, `reducers` and `selectors` folders
on either the root level or in the [`src/utils`](../src/utils) directory.
They are grouped under the [`src/redux`](../src/redux) directory.

### Utils

Just like shared components, functionality that's used across the app
is located in [`src/utils`](../src/utils).
