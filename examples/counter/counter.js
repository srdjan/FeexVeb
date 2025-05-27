/**
 * FeexVeb Component Definitions
 *
 * This file contains only component definitions that render as fragments
 * within the server-provided layout. All styling comes from FeexVeb's
 * built-in monospace design system.
 */
import FeexVeb from "../../lib/feexveb.js";

// 1. Full-featured counter with simplified API
FeexVeb.component({
  tag: 'fx-counter-simple',

  // Declarative state definition
  state: {
    count: 0  // Initial value, will be overridden by 'initial-count' attribute
  },

  // Declarative computed state with direct state access
  computed: {
    isEven: (state) => state.count % 2 === 0
  },

  // Declarative methods with direct state access
  methods: {
    increment: (state) => state.count++,
    decrement: (state) => state.count--,
    reset: (state) => {
      // Reset to initial-count attribute value if available
      const initialCount = parseInt(state.element?.getAttribute('initial-count') || '0');
      state.count = initialCount;
    }
  },

  // Declarative attributes with automatic type inference and defaults
  attrs: {
    'title': { type: 'string', default: 'Counter' },
    'initial-count': { type: 'number', default: 0 }
  },

  // Custom setup to initialize count from attribute
  setup: (ctx) => {
    const initialCount = parseInt(ctx.element.getAttribute('initial-count') || '0');
    ctx.states.count.set(initialCount);

    return {};
  },

  // Simplified render function using only FeexVeb monospace classes
  render: ({ count, isEven, increment, decrement, reset, title }) => {
    const valueClass = isEven ? 'counter-value even' : 'counter-value odd';

    return FeexVeb.createElement('div', null,
      FeexVeb.createElement('h3', { class: 'counter-title' }, title),
      FeexVeb.createElement('div', { class: valueClass }, count),
      FeexVeb.createElement('div', { class: 'counter-controls' },
        FeexVeb.createElement('button', { class: 'counter-btn decrement', onclick: decrement }, 'Decrement'),
        FeexVeb.createElement('button', { class: 'counter-btn', onclick: increment }, 'Increment'),
        FeexVeb.createElement('button', { class: 'counter-btn reset', onclick: reset }, 'Reset')
      )
    );
  }
});

// 2. Minimal counter (bare minimum code)
FeexVeb.component({
  tag: 'fx-simple-counter',

  state: {
    count: 0
  },

  methods: {
    increment: (state) => state.count++
  },

  render: ({ count, increment }) =>
    FeexVeb.createElement('div', null,
      FeexVeb.createElement('div', { class: 'counter-value' }, count),
      FeexVeb.createElement('div', { class: 'counter-controls' },
        FeexVeb.createElement('button', { class: 'counter-btn', onclick: increment }, 'Increment')
      )
    )
});

// 3. Hybrid counter: Server + client with HTMX integration
FeexVeb.component({
  tag: 'fx-hybrid-counter',

  // Minimal client-side state for optimistic updates and UI feedback
  state: {
    isLoading: false,
    lastAction: '',
    optimisticCount: null  // For optimistic updates while server request is pending
  },

  // Computed state for UI feedback
  computed: {
    displayCount: (state) => state.optimisticCount !== null ? state.optimisticCount : 'Synced',
    statusMessage: (state) => {
      if (state.isLoading) return `${state.lastAction}...`;
      if (state.lastAction) return `Last action: ${state.lastAction}`;
      return 'Ready';
    }
  },

  // Client-side methods for optimistic updates and HTMX helpers
  methods: {
    // Optimistic increment - updates UI immediately while server request is pending
    optimisticIncrement: (state) => {
      state.isLoading = true;
      state.lastAction = 'Incrementing';
      if (state.optimisticCount !== null) {
        state.optimisticCount++;
      }
    },

    // Optimistic decrement
    optimisticDecrement: (state) => {
      state.isLoading = true;
      state.lastAction = 'Decrementing';
      if (state.optimisticCount !== null) {
        state.optimisticCount--;
      }
    },

    // Reset optimistic state when server responds
    onServerResponse: (state) => {
      state.isLoading = false;
      state.optimisticCount = null; // Server response will update the actual display
    },

    // Handle server errors
    onServerError: (state) => {
      state.isLoading = false;
      state.lastAction = 'Error occurred';
      state.optimisticCount = null;
    }
  },

  // Custom setup for HTMX event handling
  setup: (ctx) => {
    const element = ctx.element;

    // Listen for HTMX events to coordinate client-side state with server responses
    const handleBeforeRequest = (event) => {
      // Extract action from the request URL
      const url = event.detail.requestConfig.path;
      if (url.includes('increment')) {
        ctx.optimisticIncrement();
      } else if (url.includes('decrement')) {
        ctx.optimisticDecrement();
      } else if (url.includes('reset')) {
        ctx.states.isLoading.set(true);
        ctx.states.lastAction.set('Resetting');
        ctx.states.optimisticCount.set(0);
      }
    };

    const handleAfterRequest = () => {
      ctx.onServerResponse();
    };

    const handleResponseError = () => {
      ctx.onServerError();
    };

    // Listen for HTMX events on this component
    element.addEventListener('htmx:beforeRequest', handleBeforeRequest);
    element.addEventListener('htmx:afterRequest', handleAfterRequest);
    element.addEventListener('htmx:responseError', handleResponseError);

    return {
      effects: [
        () => {
          element.removeEventListener('htmx:beforeRequest', handleBeforeRequest);
          element.removeEventListener('htmx:afterRequest', handleAfterRequest);
          element.removeEventListener('htmx:responseError', handleResponseError);
        }
      ]
    };
  },

  render: ({ displayCount, statusMessage, isLoading }) =>
    FeexVeb.createElement('div', null,
      FeexVeb.createElement('div', null,
        FeexVeb.createElement('h4', null, 'Server Value:'),
        FeexVeb.createElement('div', {
          id: 'server-value',
          class: 'counter-value',
          'hx-get': '/api/counter/value',
          'hx-trigger': 'load'
        }, 'Loading...')
      ),

      FeexVeb.createElement('div', null,
        FeexVeb.createElement('h4', null, 'Optimistic Preview:'),
        FeexVeb.createElement('div', { class: 'counter-value' }, displayCount),
        FeexVeb.createElement('p', null,
          FeexVeb.createElement('small', null, 'Status: ', statusMessage)
        )
      ),

      FeexVeb.createElement('div', { class: 'counter-controls' },
        FeexVeb.createElement('button', {
          class: 'counter-btn decrement',
          'hx-post': '/api/counter/decrement',
          'hx-target': '#server-value',
          'hx-swap': 'innerHTML',
          disabled: isLoading
        }, 'Decrement'),

        FeexVeb.createElement('button', {
          class: 'counter-btn',
          'hx-post': '/api/counter/increment',
          'hx-target': '#server-value',
          'hx-swap': 'innerHTML',
          disabled: isLoading
        }, 'Increment'),

        FeexVeb.createElement('button', {
          class: 'counter-btn reset',
          'hx-post': '/api/counter/reset',
          'hx-target': '#server-value',
          'hx-swap': 'innerHTML',
          disabled: isLoading
        }, 'Reset')
      ),

      FeexVeb.createElement('div', null,
        FeexVeb.createElement('button', {
          'hx-get': '/api/counter/value',
          'hx-target': '#server-value',
          'hx-swap': 'innerHTML',
          'hx-trigger': 'every 5s',
          class: 'counter-btn'
        }, 'Auto-sync (5s)')
      )
    )
});

// Initialize HTMX for the hybrid counter
try {
  if (globalThis.htmx) {
    console.log('HTMX is available for hybrid counter functionality');
  }
} catch (error) {
  console.warn('HTMX not available:', error);
}
