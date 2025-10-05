import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BikePartForm from './BikePartForm';
import { useBikePartStore } from '../store/bikePartStore';
import BikePartService from '../service/BikePartService';

jest.mock('../store/bikePartStore');
jest.mock('../service/BikePartService');

const mockAddBikePart = jest.fn();
const mockUpdateBikePart = jest.fn();

describe('BikePartForm Component', () => {

    beforeEach(() => {
        mockAddBikePart.mockClear();
        mockUpdateBikePart.mockClear();
        
        useBikePartStore.mockReturnValue({
            addBikePart: mockAddBikePart,
            updateBikePart: mockUpdateBikePart,
        });

        BikePartService.getNextArticleNumber.mockResolvedValue({ data: 123456 });
    });

    it('should display validation errors when submitting an empty form', async () => {
        const handleClose = jest.fn();
        const handleSave = jest.fn();

        render(
            <BikePartForm 
                isOpen={true} 
                onClose={handleClose} 
                onSave={handleSave} 
                partId={null}
            />
        );

        const submitButton = await screen.findByRole('button', { name: /add article/i });
        
        await act(async () => {
            userEvent.click(submitButton);
        });

        expect(await screen.findByText('Name is required.')).toBeInTheDocument();
        expect(await screen.findByText('At least one Bicycle Category is required.')).toBeInTheDocument();
        expect(await screen.findByText('Net weight must be a positive number.')).toBeInTheDocument();

        expect(mockAddBikePart).not.toHaveBeenCalled();
    });
});