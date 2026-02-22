import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_BASE}/login`, {
        username,
        password,
    });
    return response.data;
};

export const registerUser = async (username, password) => {
    const response = await axios.post(`${API_BASE}/register`, {
        username,
        password,
    });
    return response.data;
};

export const googleLogin = async (credential) => {
    const response = await axios.post(`${API_BASE}/google`, { credential });
    return response.data;
};
