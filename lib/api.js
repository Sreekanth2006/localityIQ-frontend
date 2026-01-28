import { API_BASE } from './config';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

export const api = {
    // Localities
    getLocalities: () => fetchAPI('/api/localities'),
    getLocality: (id) => fetchAPI(`/api/localities/${id}`),
    searchLocalities: (query) => fetchAPI(`/api/search?q=${encodeURIComponent(query)}`),
    analyzeLocality: (query) => fetchAPI(`/api/analyze?q=${encodeURIComponent(query)}`),

    // Environmental data
    getAQI: (lat, lng) => fetchAPI(`/api/aqi?lat=${lat}&lng=${lng}`),
    getNearbyPlaces: (lat, lng, type) => fetchAPI(`/api/places?lat=${lat}&lng=${lng}&type=${type}`),
};

export default api;
