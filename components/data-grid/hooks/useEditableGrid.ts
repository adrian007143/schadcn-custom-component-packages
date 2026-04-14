import * as React from "react";

export function useEditableGrid<T>(initialValue: T) {
  const [value, setValue] = React.useState(initialValue);
  const [isEditing, setIsEditing] = React.useState(false);

  const startEditing = React.useCallback(() => setIsEditing(true), []);
  const stopEditing = React.useCallback(() => setIsEditing(false), []);
  const resetValue = React.useCallback(() => setValue(initialValue), [initialValue]);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    setValue,
    isEditing,
    startEditing,
    stopEditing,
    resetValue,
  };
}

/** @deprecated Use useEditableGrid instead. */
export const useEditable = useEditableGrid;
