import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/auth'; // Adjust as needed

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 🔥 Include cookies
});

const auth = {
    signIn: async (credentials) => {
        try {
            const response = await axiosInstance.post('/sign-in', credentials);
            return response.data;
        } catch (error) {
            console.error('Error during sign-in API call:', error);

            if (error.response) {
                return error.response.data;
            }

            // Return an error object instead of throwing
            return {
                success: false,
                msg: 'Failed to connect to the server.',
            };
        }
    },

    signUp: async (userData) => {
        try {
            const response = await axiosInstance.post('/sign-up', userData);
            return response.data;
        } catch (error) {
            console.error('Error during sign-up API call:', error);

            if (error.response) {
                return error.response.data;
            }

            return {
                success: false,
                msg: 'Failed to connect to the server.',
            };
        }
    },

    signOut: async () => {
        try {
            const response = await axiosInstance.post('/sign-out');
            return response.data;
        } catch (error) {
            console.error('Error during sign-out API call:', error);
            return {
                success: false,
                msg: 'Logout failed.',
            };
        }
    }
};

export default auth;
