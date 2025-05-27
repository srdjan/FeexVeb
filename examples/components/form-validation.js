/**
 * Form Validation Component - Demonstrates JSX with input handling and validation
 */
import FeexVeb from "../../lib/feexveb.js";

// Contact Form with Real-time Validation
FeexVeb.component({
  tag: 'fx-contact-form',

  state: {
    formData: {
      name: '',
      email: '',
      phone: '',
      message: '',
      subscribe: false
    },
    errors: {},
    isSubmitting: false,
    submitStatus: null // 'success', 'error', null
  },

  computed: {
    isFormValid: (state) => {
      return Object.keys(state.errors).length === 0 &&
        state.formData.name &&
        state.formData.email &&
        state.formData.message;
    },

    emailError: (state) => {
      const email = state.formData.email;
      if (!email) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return 'Please enter a valid email address';
      return null;
    },

    phoneError: (state) => {
      const phone = state.formData.phone;
      if (!phone) return null; // Phone is optional
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
      return null;
    },

    nameError: (state) => {
      const name = state.formData.name;
      if (!name) return 'Name is required';
      if (name.length < 2) return 'Name must be at least 2 characters';
      return null;
    },

    messageError: (state) => {
      const message = state.formData.message;
      if (!message) return 'Message is required';
      if (message.length < 10) return 'Message must be at least 10 characters';
      if (message.length > 500) return 'Message must be less than 500 characters';
      return null;
    }
  },

  methods: {
    updateField: (state, field, value) => {
      state.formData[field] = value;
      state.validateField(field);
    },

    validateField: (state, field) => {
      const errors = { ...state.errors };

      switch (field) {
        case 'name':
          const nameError = state.computed.nameError;
          if (nameError) errors.name = nameError;
          else delete errors.name;
          break;

        case 'email':
          const emailError = state.computed.emailError;
          if (emailError) errors.email = emailError;
          else delete errors.email;
          break;

        case 'phone':
          const phoneError = state.computed.phoneError;
          if (phoneError) errors.phone = phoneError;
          else delete errors.phone;
          break;

        case 'message':
          const messageError = state.computed.messageError;
          if (messageError) errors.message = messageError;
          else delete errors.message;
          break;
      }

      state.errors = errors;
    },

    validateAll: (state) => {
      ['name', 'email', 'phone', 'message'].forEach(field => {
        state.validateField(field);
      });
    },

    submitForm: async (state) => {
      state.validateAll();

      if (!state.isFormValid) {
        state.submitStatus = 'error';
        return;
      }

      state.isSubmitting = true;
      state.submitStatus = null;

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate occasional server errors
        if (Math.random() < 0.2) {
          throw new Error('Server error. Please try again.');
        }

        state.submitStatus = 'success';
        // Reset form on success
        state.formData = {
          name: '',
          email: '',
          phone: '',
          message: '',
          subscribe: false
        };
        state.errors = {};
      } catch (error) {
        state.submitStatus = 'error';
        state.errors.submit = error.message;
      } finally {
        state.isSubmitting = false;
      }
    },

    resetForm: (state) => {
      state.formData = {
        name: '',
        email: '',
        phone: '',
        message: '',
        subscribe: false
      };
      state.errors = {};
      state.submitStatus = null;
    }
  },

  render: ({ formData, errors, isSubmitting, submitStatus, isFormValid, updateField, submitForm, resetForm }) => (
    <div class="contact-form">
      <h3 class="form-title">📧 Contact Form (JSX Validation)</h3>

      {submitStatus === 'success' && (
        <div class="alert alert-success">
          ✅ Thank you! Your message has been sent successfully.
        </div>
      )}

      {submitStatus === 'error' && errors.submit && (
        <div class="alert alert-error">
          ❌ {errors.submit}
        </div>
      )}

      <form class="form" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
        {/* Name Field */}
        <div class="form-group">
          <label class="form-label" for="name">
            Name *
          </label>
          <input
            id="name"
            type="text"
            class={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onInput={(e) => updateField('name', e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <div class="error-message">{errors.name}</div>
          )}
        </div>

        {/* Email Field */}
        <div class="form-group">
          <label class="form-label" for="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            class={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onInput={(e) => updateField('email', e.target.value)}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <div class="error-message">{errors.email}</div>
          )}
        </div>

        {/* Phone Field */}
        <div class="form-group">
          <label class="form-label" for="phone">
            Phone (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            class={`form-input ${errors.phone ? 'error' : ''}`}
            value={formData.phone}
            onInput={(e) => updateField('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <div class="error-message">{errors.phone}</div>
          )}
        </div>

        {/* Message Field */}
        <div class="form-group">
          <label class="form-label" for="message">
            Message *
          </label>
          <textarea
            id="message"
            class={`form-textarea ${errors.message ? 'error' : ''}`}
            value={formData.message}
            onInput={(e) => updateField('message', e.target.value)}
            placeholder="Enter your message (10-500 characters)"
            rows="4"
          ></textarea>
          <div class="character-count">
            {formData.message.length}/500 characters
          </div>
          {errors.message && (
            <div class="error-message">{errors.message}</div>
          )}
        </div>

        {/* Subscribe Checkbox */}
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="form-checkbox"
              checked={formData.subscribe}
              onChange={(e) => updateField('subscribe', e.target.checked)}
            />
            Subscribe to our newsletter
          </label>
        </div>

        {/* Form Actions */}
        <div class="form-actions">
          <button
            type="submit"
            class="submit-btn"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '📤 Sending...' : '📧 Send Message'}
          </button>

          <button
            type="button"
            class="reset-btn"
            onclick={resetForm}
            disabled={isSubmitting}
          >
            🔄 Reset
          </button>
        </div>

        <div class="form-info">
          <small>* Required fields</small>
        </div>
      </form>
    </div>
  )
});
