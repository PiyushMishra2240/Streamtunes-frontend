import axios from "axios";

const API_BASE = "http://localhost:8080/api/songs";

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("streamtunes_user");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token && config.headers) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

export const uploadSong = async (formData) => {
  return apiClient.post("", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSongs = async (page = 0, size = 10) => {
  return apiClient.get("", { params: { page, size } });
};

export const searchSongs = async (query, page = 0, size = 10) => {
  return apiClient.get("/search", { params: { q: query, page, size } });
};

export const streamUrl = (id) => {
  const stored = localStorage.getItem("streamtunes_user");
  let tokenParam = "";
  try {
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        tokenParam = `?token=${token}`;
      }
    }
  } catch {
    // ignore
  }
  return `${API_BASE}/${id}/stream${tokenParam}`;
};
