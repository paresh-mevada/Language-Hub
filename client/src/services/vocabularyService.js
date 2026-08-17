import api from './api.js';

export async function getVocabulary(params = {}) {
  const { data } = await api.get('/vocabulary', { params });
  return data.data.vocabulary;
}

export async function createVocabulary(payload) {
  const { data } = await api.post('/vocabulary', payload);
  return data.data.vocabulary;
}

export async function updateVocabulary(id, payload) {
  const { data } = await api.put(`/vocabulary/${id}`, payload);
  return data.data.vocabulary;
}

export async function deleteVocabulary(id) {
  await api.delete(`/vocabulary/${id}`);
}

export async function toggleLearned(id) {
  const { data } = await api.patch(`/vocabulary/${id}/learned`);
  return data.data.vocabulary;
}

export async function toggleFavorite(id) {
  const { data } = await api.patch(`/vocabulary/${id}/favorite`);
  return data.data.vocabulary;
}
