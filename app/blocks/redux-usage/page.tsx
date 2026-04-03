import NotificationPage from "@/components/examples/redux-tool-notification"
import TodoPage from "@/components/examples/redux-tool-todo"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export default function ReduxUsage() {
  return (
    <ExamplePageShell
      title="Redux State Management"
      description="Drop-in Redux store with localStorage persistence. Demonstrates notification and todo slices using react-redux-methods."
      registryFile="redux-methods-tool.json"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationPage />
        <TodoPage />
      </div>
    </ExamplePageShell>
  )
}
