// Authentication utility functions

const TOKEN_KEY = "sleep_tracker_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const logout = () => {
  removeToken();
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Check if token is expired (basic check)
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic token validation - in a real app you'd check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};
