# Vendored form renderer

`vendor/` is a copy of the form layout components from
[aggregate-data-entry-app](https://github.com/dhis2/aggregate-data-entry-app)
at commit `b95d9775`, so that a data set report can show a data set the way
data entry shows it.

## Why a copy

The components are part of an app, not a published package, and the leaf cell
is hardcoded: `category-combo-table-body.jsx` imports `DataEntryField`
directly, and that component is the entry point to the whole editing
machinery — inputs per value type, mutations and sync state, locking,
validation, min/max, the details panel, focus management. There is no
read-only mode to switch on.

This copy exists to find out what the seam between "form layout" and "form
editing" actually needs to be. It is a prototype, and the intended outcome is
an upstream extraction, not a permanent fork.

## What is untouched

Every file under `vendor/` is byte-for-byte upstream except the two noted
below. That is deliberate: the smaller the diff, the easier both re-syncing
and the upstream extraction become.

The relative import paths upstream uses — `../../shared/index.js`,
`../data-entry-cell/index.js`, `../app/app.css` — are satisfied by shim
modules placed at exactly those paths rather than by editing the imports:

| Path the vendored code imports | What answers it here |
| --- | --- |
| `shared/index.js` | `../shared/index.js` — metadata, selectors, a read-only value store |
| `../data-entry-cell/index.js` | `vendor/data-entry-cell/index.js`, re-exporting `../../ReadOnlyValueCell.jsx` |
| `../app/app.css` | `../app/app.css` — just the composed `hideForPrint` class |

## What is changed

1. **`selectors.js`** — the import block is rewritten (`re-reselect` is not a
   dependency here, so `createCachedSelector` comes from a local shim with the
   same per-key caching semantics), and the trailing period/org-unit
   availability selectors are removed. Those decide whether a category option
   is open for *entry* in a period, which a report never asks, and they were
   the only thing pulling in `moment` and the shared date module. Both edits
   are annotated in the file.

2. **Test files and fixtures** were not copied.

## Dependencies this added

`expr-eval` (indicator expressions) and `dompurify` (section custom text).
Both are needed by vendored code, both are small and dependency-free.

## Re-syncing

Re-copy the tree, then reapply the two `selectors.js` edits. Nothing else
should need touching unless upstream changes the props of `DataEntryField` or
the shape of what `shared/index.js` exports.
