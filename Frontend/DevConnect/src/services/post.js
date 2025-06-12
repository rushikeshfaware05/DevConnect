import axios from "axios";

const API_URL = "http://localhost:3000/posts";

export const fetchPosts = () => axios.get(API_URL);

export const fetchPostById = (id) => axios.get(`${API_URL}/${id}`);

export const createPost = (data) => axios.post(API_URL, data, { withCredentials: true });

export const updatePost = (id, data) => axios.put(`${API_URL}/${id}`, data, { withCredentials: true });

export const deletePost = (id) => axios.delete(`${API_URL}/${id}`, { withCredentials: true });

export const likePost = (id) => axios.post(`${API_URL}/${id}/like`, {}, { withCredentials: true });

export const addComment = (id, text) => axios.post(`${API_URL}/${id}/comment`, { text }, { withCredentials: true });
