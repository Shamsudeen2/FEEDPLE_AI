/**
 * API Configuration
 * 
 * Set USE_MOCK_API = true to use mock data
 * Set USE_MOCK_API = false to use real API
 */

export const USE_MOCK_API = false; // Change to true for testing with mock data

// Export the appropriate API based on configuration
if (USE_MOCK_API) {
  console.log('%c[API Config] Using MOCK API', 'color: #FF9800; font-weight: bold; font-size: 14px;');
} else {
  console.log('%c[API Config] Using REAL API from https://feedple-ai.onrender.com', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
}
