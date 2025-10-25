import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// ========================================
// ORGANIZATION API CALLS
// ========================================

/**
 * Get all organizations
 */
export const getOrganizations = () => {
    return api.get('/organizations');
};

/**
 * Get single organization by ID
 * @param {number} id - Organization ID
 */
export const getOrganization = (id) => {
    return api.get(`/organizations/${id}`);
};

/**
 * Create new organization
 * @param {object} data - Organization data
 */
export const createOrganization = (data) => {
    return api.post('/organizations', data);
};

/**
 * Update organization
 * @param {number} id - Organization ID
 * @param {object} data - Updated organization data
 */
export const updateOrganization = (id, data) => {
    return api.put(`/organizations/${id}`, data);
};

/**
 * Delete organization
 * @param {number} id - Organization ID
 */
export const deleteOrganization = (id) => {
    return api.delete(`/organizations/${id}`);
};

/**
 * Update organization status
 * @param {number} id - Organization ID
 * @param {string} status - New status (Active, Blocked, Inactive)
 */
export const updateOrganizationStatus = (id, status) => {
    return api.patch(`/organizations/${id}/status`, { status });
};

// ========================================
// USER API CALLS
// ========================================

/**
 * Get all users
 */
export const getAllUsers = () => {
    return api.get('/users');
};

/**
 * Get users by organization ID
 * @param {number} orgId - Organization ID
 */
export const getUsersByOrganization = (orgId) => {
    return api.get(`/users/organization/${orgId}`);
};

/**
 * Get single user by ID
 * @param {number} id - User ID
 */
export const getUser = (id) => {
    return api.get(`/users/${id}`);
};

/**
 * Create new user
 * @param {object} data - User data
 */
export const createUser = (data) => {
    return api.post('/users', data);
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {object} data - Updated user data
 */
export const updateUser = (id, data) => {
    return api.put(`/users/${id}`, data);
};

/**
 * Delete user
 * @param {number} id - User ID
 */
export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};

/**
 * Update user status
 * @param {number} id - User ID
 * @param {string} status - New status
 */
export const updateUserStatus = (id, status) => {
    return api.patch(`/users/${id}/status`, { status });
};

export default api;