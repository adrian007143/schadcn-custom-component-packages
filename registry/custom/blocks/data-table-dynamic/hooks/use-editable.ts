"use client"

import { useState } from "react"

export function useEditable<T>(
  initialValue: T,
  onCommit: (value: T) => void,
) {
  const [value, setValue] = useState<T>(initialValue)
  const [dirty, setDirty] = useState(false)

  const handleChange = (v: T) => {
    setValue(v)
    setDirty(true)
  }

  const handleSave = () => {
    onCommit(value)
    setDirty(false)
  }

  return {
    value,
    dirty,
    handleChange,
    handleSave,
    setValue,
  }
}
