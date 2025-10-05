import apiClient from './api';

class BikePartService {
    getAllBikeParts() {
        return apiClient.get('/');
    }

    getBikePartById(id) {
        return apiClient.get(`/${id}`);
    }

    createBikePart(bikePart) {
        return apiClient.post('/', bikePart);
    }

    updateBikePart(id, bikePart) {
        return apiClient.put(`/${id}`, bikePart);
    }

    deleteBikePart(id) {
        return apiClient.delete(`/${id}`);
    }

    getNextArticleNumber() {
        return apiClient.get('/next-article-number');
    }
}

export default new BikePartService();