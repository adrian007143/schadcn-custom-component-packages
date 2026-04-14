"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface InputOTPProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: string
  onChange?: (value: string) => void
  length?: number
  disabled?: boolean
  invalid?: boolean
  inputClassName?: string
  inputId?: string
  ariaDescribedBy?: string
}

function InputOTP({
  className,
  value = "",
  onChange,
  length = 6,
  disabled,
  invalid,
  inputClassName,
  inputId,
  ariaDescribedBy,
  ...props
}: InputOTPProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])
  const normalizedValue = (value ?? "").slice(0, length).padEnd(length, " ")

  const focusIndex = React.useCallback((index: number) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }, [])

  const setCharacter = React.useCallback(
    (index: number, nextCharacter: string) => {
      const next = normalizedValue.split("")
      next[index] = nextCharacter
      onChange?.(next.join("").trimEnd())
    },
    [normalizedValue, onChange]
  )

  return (
    <div
      data-slot="input-otp"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, index) => {
        const current = normalizedValue[index] === " " ? "" : normalizedValue[index]

        return (
          <input
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node
            }}
            id={index === 0 ? inputId : undefined}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={current}
            disabled={disabled}
            aria-invalid={invalid}
            aria-describedby={ariaDescribedBy}
            className={cn(
              "border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 h-10 w-10 rounded-md border text-center text-base font-semibold shadow-xs outline-none transition-[border-color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11",
              inputClassName
            )}
            onChange={(event) => {
              const nextCharacter = event.target.value.replace(/\s/g, "").slice(-1)
              setCharacter(index, nextCharacter)

              if (nextCharacter && index < length - 1) {
                focusIndex(index + 1)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !current && index > 0) {
                event.preventDefault()
                setCharacter(index - 1, "")
                focusIndex(index - 1)
                return
              }

              if (event.key === "ArrowLeft" && index > 0) {
                event.preventDefault()
                focusIndex(index - 1)
              }

              if (event.key === "ArrowRight" && index < length - 1) {
                event.preventDefault()
                focusIndex(index + 1)
              }
            }}
            onFocus={(event) => {
              event.currentTarget.select()
            }}
            onPaste={(event) => {
              event.preventDefault()
              const pasted = event.clipboardData
                .getData("text")
                .replace(/\s/g, "")
                .slice(0, length)

              if (!pasted) {
                return
              }

              const next = Array.from({ length }, (_, slot) => pasted[slot] ?? " ")
              onChange?.(next.join("").trimEnd())
              focusIndex(Math.min(pasted.length, length) - 1)
            }}
          />
        )
      })}
    </div>
  )
}

export { InputOTP }
