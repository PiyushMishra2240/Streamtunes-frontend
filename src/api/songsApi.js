import axios from "axios";

const API_BASE = "http://localhost:8080/api/songs";

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("streamtunes_user");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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

export const getUserSongs = async (page = 0, size = 10) => {
  return apiClient.get("/user", { params: { page, size } });
};

export const searchSongs = async (query, page = 0, size = 10) => {
  return apiClient.get("/search", { params: { q: query, page, size } });
};

export const toggleGlobalStatus = async (songId) => {
  return apiClient.patch(`/${songId}/toggle-global`);
};

export const toggleLikeStatus = async (songId) => {
  return apiClient.post(`/${songId}/like`);
};

export const getAnalytics = async (sortBy = 'likes', page = 0, size = 10) => {
  return apiClient.get('/analytics', {
    params: { sortBy, page, size }
  });
};

export const streamUrl = (id) => {
  return `${API_BASE}/${id}/stream`;
};
