import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1/bikeparts',
});

export const setupErrorInterceptor = (showError) => {
    apiClient.interceptors.response.use(
        (response) => response, 
        (error) => {
            let errorMessage = 'An unexpected error occurred. Please try again later.';
            if (error.response) {
                console.error('API Error Response:', error.response);
                errorMessage = error.response.data?.message || `Error ${error.response.status}: The server responded with an error.`;
            } else if (error.request) {
                console.error('API No Response:', error.request);
                errorMessage = 'The server is not responding. Please check your connection.';
            } else {
                console.error('API Request Setup Error:', error.message);
                errorMessage = 'An error occurred while setting up the request.';
            }
            
            showError(errorMessage);

            return Promise.reject(error);
        }
    );
};

export default apiClient;