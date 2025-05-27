/**
 * Chat Component - Demonstrates JSX with real-time updates and HTMX integration
 */
import FeexVeb from "../../lib/feexveb.js";

// Chat Component with simulated real-time messaging
FeexVeb.component({
  tag: 'fx-chat-widget',
  
  attrs: {
    'username': { type: 'string', default: 'Anonymous' }
  },
  
  state: {
    messages: [
      { id: 1, user: 'System', text: 'Welcome to the chat!', timestamp: new Date(Date.now() - 300000), type: 'system' },
      { id: 2, user: 'Alice', text: 'Hey everyone! 👋', timestamp: new Date(Date.now() - 240000), type: 'user' },
      { id: 3, user: 'Bob', text: 'How is everyone doing today?', timestamp: new Date(Date.now() - 180000), type: 'user' }
    ],
    newMessage: '',
    isConnected: true,
    isTyping: false,
    typingUsers: [],
    unreadCount: 0,
    isMinimized: false
  },
  
  computed: {
    sortedMessages: (state) => {
      return [...state.messages].sort((a, b) => a.timestamp - b.timestamp);
    },
    
    connectionStatus: (state) => {
      return state.isConnected ? '🟢 Online' : '🔴 Offline';
    },
    
    typingIndicator: (state) => {
      if (state.typingUsers.length === 0) return '';
      if (state.typingUsers.length === 1) return `${state.typingUsers[0]} is typing...`;
      if (state.typingUsers.length === 2) return `${state.typingUsers.join(' and ')} are typing...`;
      return `${state.typingUsers.slice(0, -1).join(', ')} and ${state.typingUsers.slice(-1)} are typing...`;
    }
  },
  
  methods: {
    sendMessage: (state) => {
      if (!state.newMessage.trim()) return;
      
      const message = {
        id: Date.now(),
        user: state.username,
        text: state.newMessage.trim(),
        timestamp: new Date(),
        type: 'user'
      };
      
      state.messages = [...state.messages, message];
      state.newMessage = '';
      
      // Simulate auto-response after a delay
      setTimeout(() => {
        state.simulateResponse();
      }, 1000 + Math.random() * 2000);
    },
    
    simulateResponse: (state) => {
      const responses = [
        "That's interesting! 🤔",
        "I agree with that point.",
        "Thanks for sharing!",
        "What do you think about this?",
        "Great question! 💭",
        "I see what you mean.",
        "That makes sense to me.",
        "Interesting perspective! 👍"
      ];
      
      const users = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const response = {
        id: Date.now(),
        user: randomUser,
        text: randomResponse,
        timestamp: new Date(),
        type: 'user'
      };
      
      state.messages = [...state.messages, response];
      
      if (state.isMinimized) {
        state.unreadCount++;
      }
    },
    
    updateMessage: (state, value) => {
      state.newMessage = value;
      
      // Simulate typing indicator
      if (value.length > 0 && !state.isTyping) {
        state.isTyping = true;
        setTimeout(() => {
          state.isTyping = false;
        }, 3000);
      }
    },
    
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
      if (!state.isMinimized) {
        state.unreadCount = 0;
      }
    },
    
    clearChat: (state) => {
      state.messages = [{
        id: Date.now(),
        user: 'System',
        text: 'Chat cleared.',
        timestamp: new Date(),
        type: 'system'
      }];
    },
    
    formatTime: (state, timestamp) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    toggleConnection: (state) => {
      state.isConnected = !state.isConnected;
      
      const statusMessage = {
        id: Date.now(),
        user: 'System',
        text: state.isConnected ? 'Reconnected to chat.' : 'Disconnected from chat.',
        timestamp: new Date(),
        type: 'system'
      };
      
      state.messages = [...state.messages, statusMessage];
    }
  },
  
  setup: (ctx) => {
    // Simulate periodic typing indicators
    const typingInterval = setInterval(() => {
      const users = ['Alice', 'Bob', 'Charlie'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      if (Math.random() < 0.3) { // 30% chance
        ctx.state.typingUsers = [randomUser];
        setTimeout(() => {
          ctx.state.typingUsers = [];
        }, 2000);
      }
    }, 5000);
    
    ctx.cleanup.push(() => clearInterval(typingInterval));
    
    return {};
  },
  
  render: ({ 
    sortedMessages, newMessage, isConnected, connectionStatus, typingIndicator,
    unreadCount, isMinimized, username,
    sendMessage, updateMessage, toggleMinimize, clearChat, formatTime, toggleConnection 
  }) => (
    <div class={`chat-widget ${isMinimized ? 'minimized' : ''}`}>
      {/* Chat Header */}
      <div class="chat-header" onclick={toggleMinimize}>
        <div class="chat-title">
          💬 Live Chat
          {unreadCount > 0 && (
            <span class="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div class="chat-status">
          {connectionStatus}
        </div>
        <button class="minimize-btn">
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      
      {!isMinimized && (
        <div class="chat-content">
          {/* Messages Area */}
          <div class="messages-container">
            <div class="messages">
              {sortedMessages.map(message => (
                <div key={message.id} class={`message ${message.type} ${message.user === username ? 'own' : ''}`}>
                  <div class="message-header">
                    <span class="message-user">{message.user}</span>
                    <span class="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div class="message-text">{message.text}</div>
                </div>
              ))}
              
              {typingIndicator && (
                <div class="typing-indicator">
                  <span class="typing-text">{typingIndicator}</span>
                  <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Input Area */}
          <div class="chat-input-area">
            <div class="input-container">
              <input
                type="text"
                class="message-input"
                placeholder={isConnected ? "Type a message..." : "Disconnected"}
                value={newMessage}
                onInput={(e) => updateMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!isConnected}
              />
              <button 
                class="send-btn"
                onclick={sendMessage}
                disabled={!isConnected || !newMessage.trim()}
                title="Send message"
              >
                📤
              </button>
            </div>
            
            <div class="chat-actions">
              <button 
                class="action-btn"
                onclick={toggleConnection}
                title={isConnected ? 'Disconnect' : 'Connect'}
              >
                {isConnected ? '🔌' : '🔗'}
              </button>
              
              <button 
                class="action-btn"
                onclick={clearChat}
                title="Clear chat"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
});

// HTMX-powered Chat Room
FeexVeb.component({
  tag: 'fx-chat-room',
  
  attrs: {
    'room-id': { type: 'string', default: 'general' }
  },
  
  state: {
    isLoading: false,
    lastMessageId: 0
  },
  
  methods: {
    setLoading: (state, loading) => {
      state.isLoading = loading;
    }
  },
  
  render: ({ roomId, isLoading, setLoading }) => (
    <div class="chat-room">
      <h3 class="room-title">🏠 Chat Room: #{roomId}</h3>
      
      {/* Messages loaded via HTMX */}
      <div 
        id="chat-messages"
        class="chat-messages"
        hx-get={`/api/chat/${roomId}/messages`}
        hx-trigger="load, every 3s"
        hx-swap="innerHTML"
        hx-indicator="#chat-loading"
      >
        <div id="chat-loading" class="loading">Loading messages...</div>
      </div>
      
      {/* Send message form */}
      <form 
        class="message-form"
        hx-post={`/api/chat/${roomId}/send`}
        hx-target="#chat-messages"
        hx-swap="innerHTML"
        hx-on="htmx:beforeRequest: this.querySelector('input').value = ''"
      >
        <input
          type="text"
          name="message"
          class="message-input"
          placeholder="Type your message..."
          required
          disabled={isLoading}
        />
        <input type="hidden" name="user" value="You" />
        <button type="submit" class="send-btn" disabled={isLoading}>
          {isLoading ? '📤...' : '📤 Send'}
        </button>
      </form>
      
      <div class="room-info">
        <small>Messages update every 3 seconds via HTMX</small>
      </div>
    </div>
  )
});
