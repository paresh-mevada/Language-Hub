import api from './api.js';

export async function getUserProfile() {
  const { data } = await api.get('/users/profile');
  return data.data.user;
}

export async function updateUserProfile(payload) {
  const { data } = await api.put('/users/profile', payload);
  return data.data.user;
}
