import create from 'zustand';
import BikePartService from '../service/BikePartService';

export const useBikePartStore = create((set) => ({
    // --- STATE ---
    bikeParts: [],
    loading: false,

    // --- ACTIONS ---
    fetchBikeParts: async () => {
        set({ loading: true });
        try {
            const response = await BikePartService.getAllBikeParts();
            set({ bikeParts: response.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch bike parts:", error);
            set({ loading: false });
        }
    },

    addBikePart: async (bikePart) => {
        try {
            await BikePartService.createBikePart(bikePart);
            useBikePartStore.getState().fetchBikeParts();
        } catch (error) {
            console.error("Failed to add bike part:", error);
        }
    },

    updateBikePart: async (id, bikePart) => {
        try {
            await BikePartService.updateBikePart(id, bikePart);
            useBikePartStore.getState().fetchBikeParts();
        } catch (error) {
            console.error("Failed to update bike part:", error);
        }
    },

    deleteBikePart: async (id) => {
        try {
            await BikePartService.deleteBikePart(id);
            // After deleting, filter the part out of the local state without needing to re-fetch the entire list.
            set((state) => ({
                bikeParts: state.bikeParts.filter((part) => part.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete bike part:", error);
        }
    },
}));