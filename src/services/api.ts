import axios, { AxiosError } from 'axios';
import { Dog, Match } from '../types';
import { BASE_PATH } from './constants';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            window.location.href = `${BASE_PATH}/`;
        }
        return Promise.reject(error);
    }
);

export const login = async (name: string, email: string): Promise<boolean> => {
    try {
        await api.post('/auth/login', { name, email });
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const logout = async () => {
    await api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
    const { data } = await api.get('/dogs/breeds');
    return data;
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
    const { data } = await api.get('/dogs/search', { params });
    return data;
};

export const getDogs = async (dogIds: string[]): Promise<Dog[]> => {
    const { data } = await api.post('/dogs', dogIds);
    return data;
};

export const generateMatch = async (dogIds: string[]): Promise<Match> => {
    const { data } = await api.post('/dogs/match', dogIds);
    return data;
};

// Update SearchResponse type
interface SearchResponse {
    resultIds: string[];
    total: number;
    next: string | null;
    prev: string | null;
}