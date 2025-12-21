import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";

export interface NamedFormButton<TValues extends FieldValues> {
  label: string;
  loadingLabel?: string;
  submit?: boolean;
  
  /** Callback for Submit Buttons (Validated) */
  onSubmit?: (values: TValues, form: UseFormReturn<TValues>) => Promise<void> | void;

  /** Callback for Normal Buttons (No Validation) - Now receives form */
  onClick?: (form: UseFormReturn<TValues>) => void;

  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  hidden?: boolean | ((values: TValues) => boolean);
  group?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  
  /** Custom styling for specific buttons */
  className?: string; 
}

export type CRUDFormType = "CREATE" | "UPDATE" | "DELETE" | "VIEW";