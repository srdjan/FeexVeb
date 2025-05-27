/**
 * Weather Widget Component - Demonstrates JSX with external API integration and loading states
 */
import FeexVeb from "../../lib/feexveb.js";

// Weather Widget with simulated API calls
FeexVeb.component({
  tag: 'fx-weather-widget',
  
  attrs: {
    'city': { type: 'string', default: 'San Francisco' }
  },
  
  state: {
    weather: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  
  computed: {
    temperatureColor: (state) => {
      if (!state.weather) return '';
      const temp = state.weather.temperature;
      if (temp < 32) return 'temp-cold';
      if (temp < 60) return 'temp-cool';
      if (temp < 80) return 'temp-warm';
      return 'temp-hot';
    },
    
    weatherIcon: (state) => {
      if (!state.weather) return '🌤️';
      const condition = state.weather.condition.toLowerCase();
      if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
      if (condition.includes('cloud')) return '☁️';
      if (condition.includes('rain')) return '🌧️';
      if (condition.includes('snow')) return '❄️';
      if (condition.includes('storm')) return '⛈️';
      return '🌤️';
    }
  },
  
  methods: {
    fetchWeather: async (state) => {
      state.isLoading = true;
      state.error = null;
      
      try {
        // Simulate API call with random weather data
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Simulate occasional API errors
        if (Math.random() < 0.1) {
          throw new Error('Weather service temporarily unavailable');
        }
        
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        const temperature = Math.floor(Math.random() * 60) + 20; // 20-80°F
        const humidity = Math.floor(Math.random() * 40) + 30; // 30-70%
        
        state.weather = {
          city: state.city,
          temperature,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity,
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
          pressure: Math.floor(Math.random() * 100) + 980 // 980-1080 hPa
        };
        
        state.lastUpdated = new Date().toLocaleTimeString();
      } catch (error) {
        state.error = error.message;
      } finally {
        state.isLoading = false;
      }
    },
    
    refresh: (state) => {
      state.fetchWeather();
    }
  },
  
  setup: (ctx) => {
    // Auto-fetch weather on component mount
    ctx.effects.push(
      FeexVeb.useEffect(() => {
        ctx.methods.fetchWeather();
      }, [])
    );
    
    return {};
  },
  
  render: ({ weather, isLoading, error, lastUpdated, temperatureColor, weatherIcon, refresh, city }) => (
    <div class="weather-widget">
      <div class="weather-header">
        <h3 class="weather-title">
          {weatherIcon} Weather in {city}
        </h3>
        <button 
          class="refresh-btn"
          onclick={refresh}
          disabled={isLoading}
          title="Refresh weather data"
        >
          {isLoading ? '🔄' : '↻'}
        </button>
      </div>
      
      {isLoading && (
        <div class="weather-loading">
          <div class="loading-spinner">🌀</div>
          <p>Fetching weather data...</p>
        </div>
      )}
      
      {error && (
        <div class="weather-error">
          <div class="error-icon">⚠️</div>
          <p class="error-message">{error}</p>
          <button class="retry-btn" onclick={refresh}>
            Try Again
          </button>
        </div>
      )}
      
      {weather && !isLoading && (
        <div class="weather-content">
          <div class="weather-main">
            <div class={`temperature ${temperatureColor}`}>
              {weather.temperature}°F
            </div>
            <div class="condition">
              {weather.condition}
            </div>
          </div>
          
          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">💧 Humidity</span>
              <span class="detail-value">{weather.humidity}%</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">💨 Wind</span>
              <span class="detail-value">{weather.windSpeed} mph</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">📊 Pressure</span>
              <span class="detail-value">{weather.pressure} hPa</span>
            </div>
          </div>
          
          {lastUpdated && (
            <div class="weather-footer">
              <small>Last updated: {lastUpdated}</small>
            </div>
          )}
        </div>
      )}
    </div>
  )
});

// Weather Dashboard with multiple cities
FeexVeb.component({
  tag: 'fx-weather-dashboard',
  
  state: {
    cities: ['New York', 'London', 'Tokyo', 'Sydney'],
    selectedCity: 'New York'
  },
  
  methods: {
    selectCity: (state, city) => {
      state.selectedCity = city;
    }
  },
  
  render: ({ cities, selectedCity, selectCity }) => (
    <div class="weather-dashboard">
      <h3 class="dashboard-title">🌍 Weather Dashboard</h3>
      
      <div class="city-selector">
        <label class="selector-label">Choose a city:</label>
        <div class="city-buttons">
          {cities.map(city => (
            <button
              key={city}
              class={`city-btn ${selectedCity === city ? 'active' : ''}`}
              onclick={() => selectCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      <div class="selected-weather">
        <fx-weather-widget city={selectedCity}></fx-weather-widget>
      </div>
      
      <div class="weather-grid">
        <h4>All Cities</h4>
        <div class="weather-cards">
          {cities.map(city => (
            <div key={city} class="weather-card">
              <fx-weather-widget city={city}></fx-weather-widget>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
});
