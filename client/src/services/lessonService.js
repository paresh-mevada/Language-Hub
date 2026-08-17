import api from './api.js';

export async function getLessons(params = {}) {
  const { data } = await api.get('/lessons', { params });
  return data.data.lessons;
}

export async function getLessonById(id) {
  const { data } = await api.get(`/lessons/${id}`);
  return data.data.lesson;
}

export async function submitLessonExercises(id, answers) {
  const { data } = await api.post(`/lessons/${id}/submit`, { answers });
  return data.data;
}

export async function createLesson(payload) {
  const { data } = await api.post('/lessons', payload);
  return data.data.lesson;
}
