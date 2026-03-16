import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

export const loginUser = async (username, password) => {
    const response = await apiClient.post(`/login`, {
        username,
        password,
    });
    return response.data;
};

export const registerUser = async (username, password) => {
    const response = await apiClient.post(`/register`, {
        username,
        password,
    });
    return response.data;
};

export const googleLogin = async (credential) => {
    const response = await apiClient.post(`/google`, { credential });
    return response.data;
};

export const logoutUser = async () => {
    const response = await apiClient.post(`/logout`);
    return response.data;
};
