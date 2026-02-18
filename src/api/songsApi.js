import axios from "axios";

const API_BASE = "http://localhost:8080/api/songs";

export const uploadSong = async (formData) => {
  return axios.post(API_BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSongs = async (page = 0, size = 10) => {
  return axios.get(`${API_BASE}?page=${page}&size=${size}`);
};

export const searchSongs = async (query, page = 0, size = 10) => {
  return axios.get(
    `${API_BASE}/search?q=${query}&page=${page}&size=${size}`
  );
};

export const streamUrl = (id) => {
  return `${API_BASE}/${id}/stream`;
};
