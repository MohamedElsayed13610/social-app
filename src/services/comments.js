import api from '../api/client';
import { extractData, extractList } from '../utils/data';

export async function getComments(postId, { page = 1, limit = 50 } = {}) {
  const { data } = await api.get(`/posts/${postId}/comments`, { params: { page, limit } });
  return {
    items: extractList(data, ['comments', 'results']),
    meta: data?.meta || extractData(data)?.meta || {},
  };
}

export async function createComment(postId, content) {
  const { data } = await api.post(`/posts/${postId}/comments`, { content });
  const value = extractData(data);
  return value?.comment || value;
}

export async function updateComment(postId, commentId, content) {
  const { data } = await api.put(`/posts/${postId}/comments/${commentId}`, { content });
  const value = extractData(data);
  return value?.comment || value;
}

export async function deleteComment(postId, commentId) {
  const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return extractData(data);
}
