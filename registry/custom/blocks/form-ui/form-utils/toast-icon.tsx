import { toast } from "sonner";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const baseClass =
  "flex items-start gap-3 max-w-[420px] whitespace-pre-line break-words text-sm leading-snug p-4 rounded-lg shadow-sm";

interface ToastOptions {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
 
}

export function showSuccess({ message, description, icon, className }: ToastOptions) {
  toast.success(message, {
    icon: icon ?? (
      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
    ),
    description: description,
    className: cn(`${baseClass} bg-green-50 text-green-700 border border-green-200`, className),
  });
}


export function showError({ message, description, icon, className }: ToastOptions) {
  toast.error(message, {
    icon: icon ?? (
    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
    ),
    description: description,
    className: cn(`${baseClass} bg-red-50 text-red-700 border border-red-200`, className),
  });
}



export function showInfo(message: string) {
  toast(message, {
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
    className: `${baseClass} bg-blue-50 text-blue-700 border border-blue-200`,
  });
}
