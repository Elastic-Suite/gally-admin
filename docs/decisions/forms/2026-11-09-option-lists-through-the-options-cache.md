---
status: accepted
date: 2026-11-09
decision-makers: gally-admin team
---

# Load form option lists through the shared options cache

## Context and Problem Statement

The options context loaded one kind of list: **field options**, the options of a field
described in the API schema, stored under the field's id.

The boost forms need another kind: **resource options**, a list read from an option resource
with filters, such as boost impacts filtered by boost model.

The difference is who decides where the options come from. For a field option, the API
schema decides. For a resource option, the form decides. Boost model settings are stored
inside one JSON field, `modelConfig`, so the schema does not see them and cannot give them
options. The context could not load them.
Before commit `3f78f580`, each form fetched them itself with `useApiList`.

The behavioral data form made this harder:

* It needs four lists, three of them from the same resource with different filters.
* Boost impacts now depend on the boost model, so the same resource is read with different
  filters.
* Only the form for the selected model is shown. Switching the model removes one form and
  shows the other, so with `useApiList` the lists are fetched again on each switch.

How should forms load resource options?

## Decision Drivers

* Do not fetch the same list again when the user switches the boost model.
* Adding a form should not mean repeating fetch code.
* Resource options should behave like field options: same loading state, same label
  translation.

## Considered Options

* Each form calls `useApiList` itself
* A small hook that wraps `useApiList`
* Add resource options to the options context

## Decision Outcome

Chosen option: "Add resource options to the options context", because it is the only option
that keeps lists across model switches, and it gives resource options the same handling as
field options.

The context gains `loadOptions(id, resource, filters)`, used by the new `useResourceOptions`
hook. A list is stored under its resource name plus its filters.

### Consequences

* Good, because a list is fetched once per page, even when the user switches models.
* Good, because a form needs one line per list.
* Bad, because a list that fails to load stays empty, with no error shown, until the page is
  reloaded.
* Bad, because the page must be wrapped in `withOptions`. Without it, the form crashes.
* Neutral, because option labels now go through translation, like field options. Labels from
  the API were shown as they came before.

### Confirmation

Code review rejects a new `useApiList` call whose only job is to fill a dropdown.

## Pros and Cons of the Options

### Each form calls `useApiList` itself

* Bad, because each call repeats seven arguments, and lists are fetched again on every model
  switch.

### A small hook that wraps `useApiList`

* Good, because it removes the repeated arguments with little code.
* Good, because it needs no `withOptions`, and a failed load is retried on the next mount.
* Bad, because lists are still fetched again on every model switch.
* Bad, because resource options would be handled differently from field options.

## More Information

Code: `packages/components/src/hooks/useResourceOptions.ts`, tested in `useOptions.test.ts`.

Open question: the old code asked the API for the full list, and the new code does not. If
the API splits these lists into pages, a long list could be cut short on a large catalog.
