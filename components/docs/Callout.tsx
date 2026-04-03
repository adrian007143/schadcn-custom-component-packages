import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type CalloutVariant = "info" | "warning" | "tip"

interface CalloutProps {
  variant?: CalloutVariant
  children: React.ReactNode
}

const CONFIG: Record<CalloutVariant, { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30" },
  warning: { icon: AlertCircle, className: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30" },
  tip: { icon: CheckCircle2, className: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" },
}

export function Callout({ variant = "info", children }: CalloutProps) {
  const { icon: Icon, className } = CONFIG[variant]
  return (
    <Alert className={cn("my-4", className)}>
      <Icon className="h-4 w-4" />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
