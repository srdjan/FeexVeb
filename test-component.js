import FeexVeb from "./lib/feexveb.js";

console.log('FeexVeb loaded:', FeexVeb);

// Simple test component using basic defineComponent API
FeexVeb.defineComponent({
  tag: 'test-component',

  setup: (ctx) => {
    console.log('Test component setup called');
    const message = FeexVeb.useState('Hello World');

    return {
      state: { message },
      methods: {},
      effects: []
    };
  },

  render: (ctx) => {
    console.log('Test component render called', ctx);
    return FeexVeb.createElement('div', { style: 'border: 2px solid red; padding: 10px;' },
      'Test Component: ', ctx.states.message.get()
    );
  }
});

console.log('Test component defined');
