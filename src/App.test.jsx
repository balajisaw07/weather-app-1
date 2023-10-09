// src/App.test.jsx
import React from 'react';
import {
    render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import App from './App';
import Weather from './components/Weather';

jest.mock('axios');

describe('App component', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('renders without crashing', () => {
        render(<App />);
    });

    it('renders Navigation component', () => {
        render(<App />);
        expect(screen.getByTestId('navigation-component')).toBeInTheDocument();
    });

    it('renders Footer component', () => {
        render(<App />);
        expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    });

    it('calls fetchUserData function', async () => {
        axios.get.mockResolvedValue({ data: {} });
        await waitFor(() => {
            render(<App />);
        });
        expect(axios.get).toHaveBeenCalled();
    });
});

describe('Weather component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
        axios.get.mockReset();
    });

    it('renders loading state initially', () => {
        render(<Weather selectedCity={null} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('fetches weather data on mount', async () => {
        const mockWeatherData = {
            data: {
                city: {
                    name: 'New York',
                    country: 'US',
                },
                list: [],
            },
        };
        axios.get.mockResolvedValueOnce(mockWeatherData);
        render(<Weather selectedCity={null} />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    it('displays weather data when available', async () => {
        const mockWeatherData = {
            data: {
                city: {
                    name: 'New York',
                    country: 'US',
                },
                list: [],
            },
        };
        axios.get.mockResolvedValueOnce(mockWeatherData);
        render(<Weather selectedCity={null} />);
        await waitFor(() => expect(screen.getByText('Weather Forecast in New York, US')).toBeInTheDocument());
    });

    it('handles search input', async () => {
        axios.get.mockResolvedValueOnce({ data: {} });
        render(<Weather selectedCity={null} />);
        const input = screen.getByPlaceholderText('Search for a country or city');
        fireEvent.change(input, { target: { value: 'Los Angeles' } });
        expect(input.value).toBe('Los Angeles');
    });
});
