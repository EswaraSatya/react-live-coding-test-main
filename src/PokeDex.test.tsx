import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PokeDex from './App';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokeDex Component', () => {
    test('renders welcome message', () => {
        render(<PokeDex />);
        expect(screen.getByText(/welcome to pokedex/i)).toBeInTheDocument();
    });

    test('renders search input', () => {
        render(<PokeDex />);
        expect(screen.getByPlaceholderText(/search pokemon/i)).toBeInTheDocument();
    });

    test('renders loading spinner while fetching', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });
        render(<PokeDex />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('fetches and displays pokemon names', async () => {
        const pokemons = [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ];
        mockedAxios.get.mockResolvedValueOnce({ data: { results: pokemons } });

        render(<PokeDex />);

        await waitFor(() => {
            expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
            expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
        });
    });

    test('filters pokemon by search term', async () => {
        const pokemons = [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ];
        mockedAxios.get.mockResolvedValueOnce({ data: { results: pokemons } });

        render(<PokeDex />);

        await waitFor(() => {
            expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
            expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/search pokemon/i), {
            target: { value: 'bulba' },
        });

        expect(screen.queryByText(/ivysaur/i)).not.toBeInTheDocument();
        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });
});
