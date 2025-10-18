export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

export const utils = {
  formatDate: (date) => date.toISOString(),
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
};

export default {
  version: '2.0.0',
  description: 'Module with named exports'
};