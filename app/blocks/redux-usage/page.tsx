import type { Metadata } from "next"
import NotificationPage from "@/components/examples/redux-tool-notification"
import TodoPage from "@/components/examples/redux-tool-todo"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Redux State Management Example",
  description:
    "Live preview of FormKitCN's Redux setup using react-redux-methods. Demonstrates a drop-in store with localStorage persistence, plus notification and todo slice examples.",
  alternates: { canonical: "https://formkitcn.pro/blocks/redux-usage" },
  openGraph: {
    title: "Redux State Management — FormKitCN Block Preview",
    description:
      "Drop-in Redux store with localStorage persistence. Notification and todo slices included.",
    url: "https://formkitcn.pro/blocks/redux-usage",
  },
}

export default function ReduxUsage() {
  return (
    <ExamplePageShell
      title="Redux State Management"
      description="Drop-in Redux store with localStorage persistence. Demonstrates notification and todo slices using react-redux-methods."
      registryFile="redux-methods-tool.json"
      codeFiles={[
        "components/examples/redux-tool-notification.tsx",
        "components/examples/redux-tool-todo.tsx",
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationPage />
        <TodoPage />
      </div>
    </ExamplePageShell>
  )
}
