# Naming Refactor

FormKitCN now exposes cleaner product-facing names while keeping the previous exports as deprecated aliases for one migration cycle.

## Forms

| Previous name | Canonical name |
| --- | --- |
| `DynamicFormField` | `FieldRenderer` |
| `FormBuilderStandard` | `SchemaForm` |
| `MultiStepForm` | `StepForm` |
| `FormFieldWrapper` | `FieldGroup` |
| `FormColumns` | `FormGrid` |
| `FormRow` | `InlineFieldRow` |
| `FormActions` | `FormActionBar` |
| `FormDivider` | `SectionDivider` |
| `FieldSkeletonLoader` | `FieldSkeleton` |
| `SingleSelector` | `SearchSelect` |
| `SelectInput` | `ComboboxField` |
| `InputPassword` | `PasswordField` |
| `DatePicker` | `DateField` |
| `PhoneInput` | `PhoneField` |
| `CurrencyInput` | `CurrencyField` |
| `PercentInput` | `PercentField` |

## Data Grid

| Previous name | Canonical name |
| --- | --- |
| `DynamicDataTable` | `DataGrid` |
| `DynamicColumnDef` | `DataGridColumn` |
| `TableToolbar` | `DataGridToolbar` |
| `TableFooter` | `DataGridFooter` |
| `DataTableFacetedFilter` | `DataGridFilter` |
| `DragHandle` | `RowDragHandle` |
| `DraggableRow` | `SortableRow` |
| `useEditable` | `useEditableGrid` |
| `EditableCell` | `EditableTextCell` |
| `DatepickerCell` | `DateCell` |
| `SelectCell` | `SelectOptionCell` |
| `BadgeCell` | `StatusBadgeCell` |
| `ImageCell` | `AvatarCell` |

## Notes

- Canonical source files now live under `components/forms/*` and `components/data-grid/*`.
- Legacy paths under `components/forms/form-*` and `components/data-table/data-table-dynamic/*` remain as compatibility re-exports.
- Registry blocks now install the canonical source files, while existing import paths continue to work during the migration window.
