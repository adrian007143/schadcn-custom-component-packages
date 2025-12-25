import { createReduxMethods, ComposePayload } from "react-redux-methods";

/* ================== TYPES ================== */
export type ITodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type ITodoState = {
  items: ITodoItem[];
};

/* ================== INITIAL STATE ================== */
export const todoState: ITodoState = {
  items: [],
};

/* ================== REDUX METHODS ================== */
const [todoReducer, todoActions, todoSelectors] = createReduxMethods({
  initialState: todoState,

  reducers: {
    addTodo: (state, action: ComposePayload<string>) => ({
      ...state,
      items: [
        ...state.items,
        {
          id: crypto.randomUUID(),
          text: action.payload,
          completed: false, // ✅ default
        },
      ],
    }),

    toggleTodo: (state, action: ComposePayload<string>) => ({
      ...state,
      items: state.items.map((t) =>
        t.id === action.payload
          ? { ...t, completed: !t.completed }
          : t
      ),
    }),

    deleteTodo: (state, action: ComposePayload<string>) => ({
      ...state,
      items: state.items.filter((t) => t.id !== action.payload),
    }),

    clearTodos: () => todoState,
  },

  selectionNode: "todo",

  selectors: {
    getTodos: (s) => s.items,
    getTodoCount: (s) => s.items.length,
    getCompletedCount: (s) => s.items.filter((t) => t.completed).length,
  },
});

export { todoReducer, todoActions, todoSelectors };
