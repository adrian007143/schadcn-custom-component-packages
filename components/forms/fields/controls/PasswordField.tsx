"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative h-full w-full">
        <InputGroupInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            "h-full w-full border-0 bg-transparent pr-10",
            "outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          {...props}
        />

        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-muted-foreground transition-colors hover:text-foreground"
          )}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

/** @deprecated Use PasswordField instead. */
const InputPassword = PasswordField;

export { PasswordField, InputPassword };
