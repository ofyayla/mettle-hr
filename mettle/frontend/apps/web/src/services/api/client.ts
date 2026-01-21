import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_TIMEOUT = 30000;

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (for future auth tokens)
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ message?: string; error?: string }>) => {
        // Extract error message
        let message = 'An unexpected error occurred';

        if (error.response) {
            // Server responded with error
            const status = error.response.status;
            const data = error.response.data;

            message = data?.message || data?.error || `Server error (${status})`;

            // Handle specific status codes
            switch (status) {
                case 401:
                    message = 'Session expired. Please login again.';
                    // Could redirect to login here
                    break;
                case 403:
                    message = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    message = 'Resource not found.';
                    break;
                case 422:
                    message = 'Validation error. Please check your input.';
                    break;
                case 500:
                    message = 'Server error. Please try again later.';
                    break;
            }
        } else if (error.request) {
            // Request made but no response
            message = 'Network error. Please check your connection.';
        }

        // Don't show toast for all errors - let the caller decide
        // toast.error(message);

        // Create a standardized error
        const enhancedError = new Error(message);
        (enhancedError as any).originalError = error;
        (enhancedError as any).status = error.response?.status;

        return Promise.reject(enhancedError);
    }
);

// Helper type for API responses
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// Export for direct use if needed
export default apiClient;
