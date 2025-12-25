"use client";

import { useState } from "react";
import { reduxConnector } from "@/redux";
import type { ConnectedProps } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

/* ================== CONNECTOR ================== */
const connector = reduxConnector(
  (s) => ({
    todos: s.getTodos,
    count: s.getTodoCount,
  }),
  (a) => ({
    addTodo: a.addTodo,
    toggleTodo: a.toggleTodo,
    deleteTodo: a.deleteTodo,
    clearTodos: a.clearTodos,
  })
);

type Props = ConnectedProps<typeof connector>;

function TodoPage({
  todos,
  count,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodos,
}: Props) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!value.trim()) return;
    addTodo(value.trim());
    setValue("");
  };

  return (
    <div className="flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Todo App
            <Badge variant="secondary">{count}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add Todo */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a todo..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          {/* Todo List */}
          {todos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No todos yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />

                  <span
                    className={[
                      "flex-1 text-sm transition",
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "",
                    ].join(" ")}
                  >
                    {todo.text}
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {/* Clear */}
          {todos.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={clearTodos}
            >
              Clear All
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default connector(TodoPage);
