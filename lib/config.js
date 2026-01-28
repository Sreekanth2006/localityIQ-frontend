/**
 * Frontend configuration
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const CONFIG = {
    API_BASE,
    APP_NAME: 'LocalityIQ',
    DEFAULT_CITY: 'Hyderabad'
};

export default CONFIG;
