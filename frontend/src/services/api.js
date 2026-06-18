import axios from 'axios';

// Use VITE_API_URL for production (set in hosting), fall back to local proxy '/api'
const base = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: base,
});

export default api;
