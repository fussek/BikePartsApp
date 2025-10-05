import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import BikePartList from './BikePartList';
import { useBikePartStore } from '../store/bikePartStore';

jest.mock('./BikePartForm.jsx', () => () => <div>Mocked Form</div>);
jest.mock('./FilterIcon.jsx', () => () => <span>F</span>);
jest.mock('../store/bikePartStore');

describe('BikePartList Component', () => {

    const mockFetchBikeParts = jest.fn();
    const mockDeleteBikePart = jest.fn();

    const mockBikeParts = [
        { id: 1, articleNumber: 101, name: 'Carbon Handlebar', articleCategory: 'Handlebar', material: 'Carbon', netWeight: 180 },
        { id: 2, articleNumber: 102, name: 'Steel Chain', articleCategory: 'Chain', material: 'Steel', netWeight: 250 },
        { id: 3, articleNumber: 103, name: 'Alloy Pedals', articleCategory: 'Crank arm', material: 'Alloy', netWeight: 300 },
    ];

    beforeEach(() => {
        useBikePartStore.mockReturnValue({
            bikeParts: mockBikeParts,
            loading: false,
            fetchBikeParts: mockFetchBikeParts,
            deleteBikePart: mockDeleteBikePart,
        });
    });

    it('should filter the list when a material filter is applied', async () => {
        render(<BikePartList />);

        const materialHeader = screen.getByText(/^Material$/);
        
        const headerCell = materialHeader.closest('th');

        const filterButton = within(headerCell).getByRole('button');

        await act(async () => {
            userEvent.click(filterButton);
        });

        const carbonCheckbox = await screen.findByLabelText('Carbon');

        await act(async () => {
            userEvent.click(carbonCheckbox);
        });

        // Assert:
        expect(screen.getByText('Carbon Handlebar')).toBeInTheDocument();
        expect(screen.queryByText('Steel Chain')).not.toBeInTheDocument();
        expect(screen.queryByText('Alloy Pedals')).not.toBeInTheDocument();
    });
});