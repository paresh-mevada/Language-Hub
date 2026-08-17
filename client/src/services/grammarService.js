import api from './api.js';

export async function checkGrammar(text, language) {
  const { data } = await api.post('/grammar/check', { text, language });
  return data.data.check;
}

export async function getGrammarHistory() {
  const { data } = await api.get('/grammar');
  return data.data.history;
}

export async function deleteGrammarCheck(id) {
  await api.delete(`/grammar/${id}`);
}

export async function clearGrammarHistory() {
  await api.delete('/grammar');
}

