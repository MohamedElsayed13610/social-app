import api from '../api/client';
import { extractData } from '../utils/data';

export async function signUp(payload) {
  const { data } = await api.post('/users/signup', payload);
  return extractData(data);
}

export async function signIn(payload) {
  const { data } = await api.post('/users/signin', payload);
  return extractData(data);
}

export async function getProfile() {
  const { data } = await api.get('/users/profile-data');
  const value = extractData(data);
  return value?.user || value;
}

export async function changePassword(payload) {
  const { data } = await api.patch('/users/change-password', payload);
  return extractData(data);
}

export async function uploadProfilePhoto(file) {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await api.put('/users/upload-photo', form);
  return extractData(data);
}
