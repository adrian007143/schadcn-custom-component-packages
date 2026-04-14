# Base UI Migration Notes

FormKitCN now uses Base UI for the lower-risk toggle primitives:

- `components/ui/checkbox.tsx`
- `components/ui/switch.tsx`
- `components/ui/tabs.tsx`

These were migrated first because they preserve current public imports while avoiding the broader `asChild` trigger and overlay changes still used by the docs shell and registry browser.

The following primitives intentionally remain on their existing implementations for now:

- `dialog`
- `sheet`
- `popover`
- `tooltip`
- `select`

Compatibility rules for this pass:

- Public component names stay the same.
- Form field props no longer expose Radix switch types.
- The registry form-field implementation is the canonical source; app/demo form components re-export from it.
