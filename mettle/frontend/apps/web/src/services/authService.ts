import axios from 'axios';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';

const API_URL = 'http://localhost:8000/api/auth';

// Create axios instance with interceptor for auth header
export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // MOCK LOGIN implementation
        console.log('Mock login with:', credentials);
        const mockToken = 'mock_jwt_token_12345';
        localStorage.setItem('token', mockToken);
        // Store email for mock user retrieval if we wanted to be fancy, but static is fine
        localStorage.setItem('mock_user_email', credentials.email);

        return {
            access_token: mockToken,
            token_type: 'bearer'
        };

        /* Original implementation
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        // OAuth2PasswordRequestForm expects form data
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
        */
    },

    async signup(data: SignupCredentials): Promise<User> {
        const response = await axios.post<User>(`${API_URL}/register`, data);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        // MOCK USER implementation
        const email = localStorage.getItem('mock_user_email') || 'mock@example.com';
        return {
            id: 'mock-user-1',
            email: email,
            full_name: 'Mock User',
            role: 'admin',
            is_active: true
        };

        /* Original implementation
        const response = await api.get<User>('/auth/me');
        return response.data;
        */
    },

    logout() {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
};
