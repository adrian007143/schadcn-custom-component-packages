// src/components/shared/input-password.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";


export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full h-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            // make the input fill the container
            "h-full w-full pr-10",
            // remove its own border/background, let the parent control that
            "border-0 bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0 outline-none",
            className
          )}
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground transition-colors"
          )}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
          <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export { InputPassword };
