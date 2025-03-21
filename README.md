# FxWeb with HTMX Integration Guide

This guide explains how to use FxWeb with HTMX to create powerful web applications that combine client-side state management with server-driven HTML updates.

## What is HTMX?

HTMX is a dependency-free JavaScript library that allows you to access modern browser features directly from HTML, rather than using JavaScript. It extends HTML with attributes like `hx-get`, `hx-post`, and `hx-swap` that allow you to make AJAX requests and update the page dynamically.

Using HTMX, you can:

- Make HTTP requests (`GET`, `POST`, `PUT`, `DELETE`, etc.) from any HTML element
- Update any element on the page with the response
- Trigger requests on any event (not just clicks)
- Use CSS transitions for smooth page updates
- Work with WebSockets and Server-Sent Events
- And much more...

## Why Use FxWeb with HTMX?

FxWeb and HTMX complement each other perfectly:

- **FxWeb**: Provides client-side state management and component lifecycle, using a functional approach with custom elements.
- **HTMX**: Provides HTML-driven server communication and page updates.

Together, they create a powerful approach that offers:

1. **Progressive enhancement**: Applications work with or without JavaScript
2. **Reduced JavaScript**: Much less client-side code to maintain
3. **Component encapsulation**: Clean organization of UI elements
4. **Server-driven updates**: Server-rendered HTML instead of complex JSON APIs
5. **Improved performance**: Smaller JS payload, faster loading times
6. **Simplified mental model**: HTML-driven approach is easier to reason about

## Getting Started

### 1. Install FxWeb and HTMX

```html
<!-- Include FxWeb -->
<script type="module">
  import FxWeb from './functional-htmx-library.js';
  
  // Initialize HTMX
  FxWeb.htmx.init({
    // Optional HTMX config options
    defaultSwapStyle: 'innerHTML',
    historyCacheSize: 10
  }).then(() => {
    console.log('HTMX initialized!');
  });
</script>
```

### 2. Create a Component with HTMX Support

```javascript
FxWeb.component({
  tag: 'user-profile',
  
  setup: (ctx) => {
    // Local state
    const isEditing = FxWeb.useState(false);
    
    return {
      state: { isEditing },
      methods: {
        toggleEdit: () => {
          isEditing.set(!isEditing.get());
        }
      }
    };
  },
  
  render: (ctx) => {
    const userId = FxWeb.attr(ctx.element, 'user-id');
    
    return (
      <div class="user-profile">
        <h2>User Profile</h2>
        
        {/* Local interactivity */}
        <button onclick={ctx.toggleEdit}>
          {ctx.isEditing.get() ? 'Cancel' : 'Edit Profile'}
        </button>
        
        {/* Server-driven content with HTMX */}
        <div 
          hx-get={`/api/users/${userId}`}
          hx-trigger="load"
          hx-swap="innerHTML"
        >
          Loading user data...
        </div>
        
        {ctx.isEditing.get() && (
          <form
            class="edit-form"
            hx-put={`/api/users/${userId}`}
            hx-swap="outerHTML"
          >
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    );
  },
  
  attributes: ['user-id']
});
```

### 3. Use Shadow DOM with HTMX (Optional)

For encapsulation, you can use Shadow DOM with HTMX:

```javascript
FxWeb.htmx.component({
  tag: 'shadow-counter',
  shadowMode: 'open', // Use Shadow DOM
  
  setup: (ctx) => {
    const count = FxWeb.useState(0);
    
    return {
      state: { count },
      methods: {
        increment: () => count.set(count.get() + 1)
      }
    };
  },
  
  render: (ctx) => (
    <div>
      <style>
        {`
          .counter { padding: 1rem; border: 1px solid #ccc; }
          .count { font-size: 2rem; font-weight: bold; }
          button { background: blue; color: white; border: none; padding: 0.5rem 1rem; }
        `}
      </style>
      
      <div class="counter">
        <div class="count">{ctx.count.get()}</div>
        
        <button onclick={ctx.increment}>Local Increment</button>
        
        <div>
          <button 
            hx-post="/api/increment"
            hx-target="previous div"
            hx-swap="innerHTML"
          >
            Server Increment
          </button>
        </div>
      </div>
    </div>
  )
});
```

## HTMX Events

FxWeb can listen to HTMX events for enhanced integration:

```javascript
// Listen for HTMX events
document.body.addEventListener('htmx:afterSwap', (event) => {
  // Process new content
  console.log('Content swapped', event.detail.elt);
});

// Custom HTMX event handling in components
FxWeb.component({
  tag: 'data-loader',
  
  setup: (ctx) => {
    const element = ctx.element;
    
    // Create effect to handle HTMX events
    const setupHtmxHandlers = () => {
      const handleAfterRequest = (event) => {
        console.log('Request completed', event.detail);
      };
      
      element.addEventListener('htmx:afterRequest', handleAfterRequest);
      
      // Return cleanup function
      return () => {
        element.removeEventListener('htmx:afterRequest', handleAfterRequest);
      };
    };
    
    return {
      effects: [setupHtmxHandlers]
    };
  },
  
  render: (ctx) => (
    <div>
      <div 
        hx-get="/api/data" 
        hx-trigger="load"
        hx-indicator="#loading"
      >
        Loading...
      </div>
      <div id="loading" class="htmx-indicator">
        Processing...
      </div>
    </div>
  )
});
```

## Advanced Techniques

### 1. Server Response Patterns

For HTMX responses, your server should return HTML fragments. Here's an example with Express:

```javascript
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // Check if it's an HTMX request
  const isHtmx = req.headers['hx-request'] === 'true';
  
  if (isHtmx) {
    // For HTMX, return HTML
    res.send(`
      <div class="user-data">
        <h3>User ${userId}</h3>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
      </div>
    `);
  } else {
    // For regular API requests, return JSON
    res.json({
      id: userId,
      name: 'John Doe',
      email: 'john@example.com'
    });
  }
});
```

### 2. Combining Client and Server State

A powerful pattern is to sync server state with client state:

```javascript
FxWeb.component({
  tag: 'synced-counter',
  
  setup: (ctx) => {
    // Local state that mirrors server state
    const count = FxWeb.useState(0);
    
    // Effect to sync with server periodically
    const syncWithServer = () => {
      const interval = setInterval(() => {
        if (window.htmx) {
          window.htmx.ajax('GET', '/api/counter', {
            handler: (html) => {
              // Parse server value and update local state
              const value = parseInt(html, 10);
              count.set(value);
            }
          });
        }
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(interval);
    };
    
    return {
      state: { count },
      methods: {
        increment: () => {
          // Update local state immediately for responsiveness
          count.set(count.get() + 1);
          
          // Then sync with server
          if (window.htmx) {
            window.htmx.ajax('POST', '/api/counter/increment');
          }
        }
      },
      effects: [syncWithServer]
    };
  },
  
  render: (ctx) => (
    <div>
      <div class="count">{ctx.count.get()}</div>
      <button onclick={ctx.increment}>Increment</button>
    </div>
  )
});
```

### 3. Forms and Validation

HTMX works great with forms, and FxWeb can add client-side validation:

```javascript
FxWeb.component({
  tag: 'validated-form',
  
  setup: (ctx) => {
    const errors = FxWeb.useState({});
    const isSubmitting = FxWeb.useState(false);
    
    return {
      state: {
        errors,
        isSubmitting
      },
      methods: {
        validate: (ctx, event) => {
          const form = event.target;
          const name = form.name.value;
          const email = form.email.value;
          
          // Clear previous errors
          errors.set({});
          
          // Validate fields
          let hasErrors = false;
          let newErrors = {};
          
          if (!name || name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            hasErrors = true;
          }
          
          if (!email || !email.includes('@')) {
            newErrors.email = 'Please enter a valid email';
            hasErrors = true;
          }
          
          errors.set(newErrors);
          
          // Prevent form submission if there are errors
          if (hasErrors) {
            event.preventDefault();
            return false;
          }
          
          // Show submitting state
          isSubmitting.set(true);
          return true;
        },
        
        // Reset form after submission
        resetForm: (ctx) => {
          errors.set({});
          isSubmitting.set(false);
        }
      }
    };
  },
  
  render: (ctx) => (
    <form 
      hx-post="/api/register" 
      hx-swap="outerHTML"
      onsubmit={ctx.validate}
      hx-on:htmx:after-request={ctx.resetForm}
    >
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" />
        {ctx.errors.get().name && (
          <div class="error">{ctx.errors.get().name}</div>
        )}
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" />
        {ctx.errors.get().email && (
          <div class="error">{ctx.errors.get().email}</div>
        )}
      </div>
      
      <button type="submit" disabled={ctx.isSubmitting.get()}>
        {ctx.isSubmitting.get() ? 'Submitting...' : 'Register'}
      </button>
    </form>
  )
});
```

## Best Practices

1. **Use attributes for configuration**: Make components configurable with attributes.
2. **Keep local state minimal**: Use server state for shared data.
3. **Progressive enhancement**: Ensure basic functionality works without JavaScript.
4. **Use HTMX for server communication**: Let HTMX handle all AJAX requests.
5. **Use events for cross-component communication**: The event bus can coordinate between components.
6. **Cache selectors**: Use `document.getElementById` once and store the reference.
7. **Avoid shadow DOM for HTMX-heavy components**: Shadow DOM can complicate HTMX targeting.
8. **Process HTMX after DOM updates**: Use `htmx.process` after manual DOM manipulation.

By combining FxWeb's functional components with HTMX's server-driven updates, you can build web applications that are fast, maintainable, and user-friendly.

## Resources

- [HTMX Documentation](https://htmx.org/docs/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Custom Elements v1](https://developers.google.com/web/fundamentals/web-components/customelements)
