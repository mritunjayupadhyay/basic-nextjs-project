// config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/local';
export const ENDPOINTS = {
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
  },
  SHIPMENTS: {
    LIST: `${API_BASE_URL}/shipments`,
  }
};