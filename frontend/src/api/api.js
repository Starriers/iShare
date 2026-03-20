import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json;charset=UTF-8',
  },
  responseType: 'json',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  searchUsers: (username) => api.get('/users/search', { params: { username } }),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Article API
export const articleAPI = {
  getAllArticles: () => api.get('/articles'),
  getArticlePage: (page = 1, size = 10) => api.get('/articles', { params: { page, size } }),
  getArticleById: (id) => api.get(`/articles/${id}`),
  createArticle: (data) => api.post('/articles', data),
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  getArticlesByCategory: (categoryId) => api.get(`/articles/category/${categoryId}`),
  searchArticles: (keyword) => api.get('/articles/search', { params: { keyword } }),
  getArticlesByAuthor: (author) => api.get(`/articles/author/${author}`),
  getArticlesByDate: (date) => api.get(`/articles/date/${date}`),
  getUserArticles: (username) => api.get(`/articles/user/${username}`),
  getComments: (articleId) => api.get(`/articles/${articleId}/comments`),
  addComment: (data) => api.post('/articles/comments', data),
};

export default api;
