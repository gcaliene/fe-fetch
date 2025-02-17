import axios from 'axios';
import { Dog, SearchResponse, Match } from '../types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const login = async (name: string, email: string) => {
    return api.post('/auth/login', { name, email });
};

export const logout = async () => {
    return api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
    const response = await api.get('/dogs/breeds');
    return response.data;
};

export const searchDogs = async (params: {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: string;
    sort?: string;
}): Promise<SearchResponse> => {
    const response = await api.get('/dogs/search', { params });
    return response.data;
};

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
    const response = await api.post('/dogs', dogIds);
    return response.data;
};

export const generateMatch = async (dogIds: string[]): Promise<Match> => {
    const response = await api.post('/dogs/match', dogIds);
    return response.data;
};