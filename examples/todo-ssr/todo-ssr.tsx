/** @jsxImportSource https://esm.sh/preact */

// 2. Todo Interface and State
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export let todos: Todo[] = [];
export let idCounter = 1;

// 4. Core Logic Functions (exported for server integration)
export function addTodo(text: string): Todo {
  const newTodo: Todo = {
    id: idCounter++,
    text,
    completed: false,
  };
  todos = [...todos, newTodo]; // Ensure array is updated immutably for potential reactivity if used elsewhere
  return newTodo;
}

export function toggleTodo(id: number): Todo | undefined {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todos = [...todos]; // Create new array reference
    return todo;
  }
  return undefined;
}

export function deleteTodo(id: number): void {
  todos = todos.filter((t) => t.id !== id);
}

// 3. Rendering Functions

// Helper function to render a single Todo item - Exported for server use
export function TodoItem(todo: Todo): JSX.Element {
  return (
    <li id={`todo-item-${todo.id}`} class={todo.completed ? "completed" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        hx-put={`/todo-ssr/toggle/${todo.id}`}
        hx-target={`#todo-item-${todo.id}`}
        hx-swap="outerHTML"
      />
      <span
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </span>
      <button
        hx-delete={`/todo-ssr/delete/${todo.id}`}
        hx-target={`#todo-item-${todo.id}`}
        hx-swap="outerHTML"
      >
        Delete
      </button>
    </li>
  );
}

export function renderTodos(): JSX.Element {
  return (
    <ul id="todo-list">
      {todos.map((todo) => <TodoItem {...todo} />)}
      {/* HTMX needs a target even if the list is empty, so a placeholder or an empty ul is fine */}
      {todos.length === 0 && (
        <li id="empty-message">No todos yet. Add one above!</li>
      )}
    </ul>
  );
}

const basicStyles = `
  body { font-family: sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
  h1 { color: #333; }
  ul { list-style-type: none; padding: 0; }
  li { display: flex; align-items: center; padding: 10px; background-color: #fff; border-bottom: 1px solid #ddd; }
  li.completed span { text-decoration: line-through; color: #aaa; }
  li:last-child { border-bottom: none; }
  input[type="checkbox"] { margin-right: 10px; }
  span { flex-grow: 1; }
  button { padding: 5px 10px; background-color: #d9534f; color: white; border: none; cursor: pointer; border-radius: 3px; margin-left: 10px; }
  button:hover { background-color: #c9302c; }
  form { margin-bottom: 20px; display: flex; }
  input[type="text"] { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 3px; }
  form button { background-color: #5cb85c; padding: 10px 15px; }
  form button:hover { background-color: #4cae4c; }
  #empty-message { color: #777; font-style: italic; }
`;

export function TodoPage(): JSX.Element {
  return (
    <html>
      <head>
        <title>Todo App SSR</title>
        {/* Assuming htmx.min.js will be served from the root or a known path */}
        <script src="/htmx.min.js"></script>
        <style dangerouslySetInnerHTML={{ __html: basicStyles }} />
      </head>
      <body>
        <h1>Todo List SSR</h1>
        <form
          action="/todo-ssr/add"
          method="post"
          hx-post="/todo-ssr/add"
          hx-target="#todo-list"
          hx-swap="beforeend" // Add new todo item to the end of the list
          // hx-on::after-request="this.reset()" // Optional: clear form after successful submission
        >
          <input type="text" name="todo" placeholder="New todo" required />
          <button type="submit">Add</button>
        </form>
        {/* Render the initial list of todos */}
        <div id="todo-list-container">
          {renderTodos()}
        </div>
      </body>
    </html>
  );
}

// For server.ts to import and use these:
// The state (todos, idCounter) is exported directly and can be mutated by server handlers.
// Functions (addTodo, toggleTodo, deleteTodo, renderTodos, TodoPage) are exported for server use.
// No default export, named exports are generally easier for server integration.
