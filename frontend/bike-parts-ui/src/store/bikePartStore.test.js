import { useBikePartStore } from './bikePartStore';
import BikePartService from '../service/BikePartService';

jest.mock('../service/BikePartService');

describe('bikePartStore', () => {
    it('should fetch bike parts and update the state', async () => {
        const mockParts = [{ id: 1, name: 'Test Chain' }];
        BikePartService.getAllBikeParts.mockResolvedValue({ data: mockParts });
        
        const { fetchBikeParts } = useBikePartStore.getState();

        await fetchBikeParts();

        const state = useBikePartStore.getState();
        expect(state.bikeParts).toEqual(mockParts);
        expect(state.loading).toBe(false);
    });
});