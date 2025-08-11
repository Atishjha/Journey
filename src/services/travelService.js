import apiClient from './api';

export const travelService = {
  // Example API calls - adjust based on your actual endpoints
  getAllTrips: async () => {
    const response = await apiClient.get('/trips');
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await apiClient.post('/trips', tripData);
    return response.data;
  },

  getTripById: async (id) => {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
  },

  updateTrip: async (id, tripData) => {
    const response = await apiClient.put(`/trips/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id) => {
    const response = await apiClient.delete(`/trips/${id}`);
    return response.data;
  },
};