"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const GREEN = "#59BB74"

interface FormKitCNLogoIconProps {
  className?: string
  size?: number
}

export function FormKitCNLogoIcon({
  className,
  size = 32,
}: FormKitCNLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="62"
        height="62"
        rx="17"
        className="fill-[#FBFBFA] dark:fill-[#181716]"
      />
      <rect
        x="5"
        y="5"
        width="62"
        height="62"
        rx="17"
        fill="none"
        strokeWidth="2.5"
        className="stroke-[#D5D7DB] dark:stroke-white/85"
      />
      <path
        d="M29.5 25L20 36L29.5 47"
        stroke={GREEN}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="37.5"
        y="25"
        width="20.5"
        height="20.5"
        rx="4.25"
        className="fill-[#59BB74] dark:fill-white"
      />
      <path
        d="M42.75 35.5L47.5 39.75L54 33"
        strokeWidth="4.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white dark:stroke-[#59BB74]"
      />
    </svg>
  )
}

interface FormKitCNLogoProps {
  showText?: boolean
  size?: number
  className?: string
  textClassName?: string
}

export function FormKitCNLogo({
  showText = true,
  size = 28,
  className,
  textClassName,
}: FormKitCNLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-[28%] bg-emerald-500/10 blur-md dark:bg-emerald-400/10"
          aria-hidden="true"
        />
        <FormKitCNLogoIcon size={size} className="relative" />
      </span>
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-[-0.03em] text-foreground",
            textClassName,
          )}
        >
          FormKit<span className="text-[#59BB74]">CN</span>
        </span>
      ) : null}
    </span>
  )
}
