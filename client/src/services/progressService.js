import api from './api.js';

export async function getProgressSummary() {
  const { data } = await api.get('/progress');
  return data.data;
}

export async function logProgress(payload) {
  const { data } = await api.post('/progress', payload);
  return data.data.progress;
}
