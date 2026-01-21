import apiClient from './client';

export interface LoginDTO {
    username: string; // email used as username for OAuth2
    password: string;
}

export interface RegisterDTO {
    email: string;
    password: string;
    full_name: string;
}

export interface UserResponse {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

/**
 * Auth API - Handles login, registration, and token management
 */
export const authApi = {
    /**
     * Login with email and password
     */
    login: async (email: string, password: string): Promise<TokenResponse> => {
        // OAuth2 password flow uses form data
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Store token
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);

        return response.data;
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterDTO): Promise<UserResponse> => {
        const response = await apiClient.post<UserResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Get current authenticated user
     */
    getMe: async (): Promise<UserResponse> => {
        const response = await apiClient.get<UserResponse>('/auth/me');
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        return response.data;
    },

    /**
     * Logout - clear stored tokens
     */
    logout: (): void => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Get stored user (without API call)
     */
    getStoredUser: (): UserResponse | null => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Get stored token
     */
    getToken: (): string | null => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },
};
