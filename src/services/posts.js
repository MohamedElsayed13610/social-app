import api from '../api/client';
import { extractData, extractList, getId } from '../utils/data';

export async function getPosts({ page = 1, limit = 10, only } = {}) {
  const endpoint = only ? '/posts/feed' : '/posts';
  const { data } = await api.get(endpoint, { params: { page, limit, ...(only ? { only } : {}) } });
  return {
    items: extractList(data, ['posts', 'feed', 'results']),
    meta: data?.meta || extractData(data)?.meta || {},
  };
}

export async function getPost(postId) {
  try {
    const { data } = await api.get(`/posts/${postId}`);
    const value = extractData(data);
    return value?.post || value;
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) throw error;
    const result = await getPosts({ page: 1, limit: 100 });
    return result.items.find((post) => String(getId(post)) === String(postId));
  }
}

function postForm({ body, image, removeImage }) {
  const form = new FormData();
  form.append('body', body || '');
  if (image instanceof File) form.append('image', image);
  if (removeImage) form.append('removeImage', 'true');
  return form;
}

export async function createPost(payload) {
  const { data } = await api.post('/posts', postForm(payload));
  const value = extractData(data);
  return value?.post || value;
}

export async function updatePost(postId, payload) {
  const { data } = await api.put(`/posts/${postId}`, postForm(payload));
  const value = extractData(data);
  return value?.post || value;
}

export async function deletePost(postId) {
  const { data } = await api.delete(`/posts/${postId}`);
  return extractData(data);
}

export async function toggleLike(postId) {
  const { data } = await api.put(`/posts/${postId}/like`);
  return extractData(data);
}
