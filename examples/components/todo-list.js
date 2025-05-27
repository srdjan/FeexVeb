/**
 * Todo List Component - Demonstrates JSX syntax with dynamic lists and HTMX integration
 */
import FeexVeb from "../../lib/feexveb.js";

// Todo List Component with HTMX server integration
FeexVeb.component({
  tag: 'fx-todo-list',
  
  state: {
    todos: [
      { id: 1, text: 'Learn FeexVeb JSX syntax', completed: false },
      { id: 2, text: 'Build awesome components', completed: false },
      { id: 3, text: 'Deploy to production', completed: false }
    ],
    newTodoText: '',
    filter: 'all' // 'all', 'active', 'completed'
  },
  
  computed: {
    filteredTodos: (state) => {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(todo => !todo.completed);
        case 'completed':
          return state.todos.filter(todo => todo.completed);
        default:
          return state.todos;
      }
    },
    
    activeCount: (state) => state.todos.filter(todo => !todo.completed).length,
    completedCount: (state) => state.todos.filter(todo => todo.completed).length
  },
  
  methods: {
    addTodo: (state) => {
      if (state.newTodoText.trim()) {
        const newTodo = {
          id: Date.now(),
          text: state.newTodoText.trim(),
          completed: false
        };
        state.todos = [...state.todos, newTodo];
        state.newTodoText = '';
      }
    },
    
    toggleTodo: (state, id) => {
      state.todos = state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    },
    
    deleteTodo: (state, id) => {
      state.todos = state.todos.filter(todo => todo.id !== id);
    },
    
    setFilter: (state, filter) => {
      state.filter = filter;
    },
    
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    
    updateNewTodoText: (state, event) => {
      state.newTodoText = event.target.value;
    }
  },
  
  render: ({ filteredTodos, activeCount, completedCount, newTodoText, filter, addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted, updateNewTodoText }) => (
    <div class="todo-app">
      <h3 class="todo-title">📝 Todo List (JSX)</h3>
      
      {/* Add new todo form */}
      <div class="todo-input-section">
        <input
          type="text"
          class="todo-input"
          placeholder="What needs to be done?"
          value={newTodoText}
          onInput={updateNewTodoText}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button class="todo-add-btn" onclick={addTodo}>
          Add Todo
        </button>
      </div>
      
      {/* Todo list */}
      <div class="todo-list">
        {filteredTodos.length === 0 ? (
          <div class="todo-empty">
            {filter === 'all' ? 'No todos yet!' : `No ${filter} todos`}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} class={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                class="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span class="todo-text">{todo.text}</span>
              <button 
                class="todo-delete-btn"
                onclick={() => deleteTodo(todo.id)}
                title="Delete todo"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Filter and stats */}
      <div class="todo-footer">
        <div class="todo-stats">
          <span>{activeCount} active</span>
          {completedCount > 0 && <span>, {completedCount} completed</span>}
        </div>
        
        <div class="todo-filters">
          <button 
            class={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onclick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            class={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onclick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            class={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onclick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        {completedCount > 0 && (
          <button class="clear-completed-btn" onclick={clearCompleted}>
            Clear Completed
          </button>
        )}
      </div>
    </div>
  )
});

// Server-integrated Todo List with HTMX
FeexVeb.component({
  tag: 'fx-todo-htmx',
  
  state: {
    isLoading: false
  },
  
  methods: {
    setLoading: (state, loading) => {
      state.isLoading = loading;
    }
  },
  
  render: ({ isLoading, setLoading }) => (
    <div class="todo-htmx">
      <h3 class="todo-title">📡 Server Todo List (HTMX + JSX)</h3>
      
      {/* Add todo form with HTMX */}
      <form 
        class="todo-form"
        hx-post="/api/todos"
        hx-target="#todo-list-container"
        hx-swap="innerHTML"
        onSubmit={() => setLoading(true)}
      >
        <input
          type="text"
          name="text"
          class="todo-input"
          placeholder="Add server-side todo..."
          required
        />
        <button type="submit" class="todo-add-btn" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      
      {/* Todo list container - populated by HTMX */}
      <div 
        id="todo-list-container"
        class="todo-list-container"
        hx-get="/api/todos"
        hx-trigger="load"
        hx-indicator="#loading-indicator"
      >
        <div id="loading-indicator" class="loading">Loading todos...</div>
      </div>
      
      <div class="todo-actions">
        <button 
          class="refresh-btn"
          hx-get="/api/todos"
          hx-target="#todo-list-container"
          hx-swap="innerHTML"
        >
          🔄 Refresh
        </button>
        
        <button 
          class="clear-all-btn"
          hx-delete="/api/todos"
          hx-target="#todo-list-container"
          hx-swap="innerHTML"
          hx-confirm="Clear all todos?"
        >
          🗑️ Clear All
        </button>
      </div>
    </div>
  )
});
