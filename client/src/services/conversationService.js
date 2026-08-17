import api from './api.js';

export async function getConversations() {
  const { data } = await api.get('/conversations');
  return data.data.conversations;
}

export async function createConversation(payload = {}) {
  const { data } = await api.post('/conversations', payload);
  return data.data.conversation;
}

export async function updateConversation(id, payload) {
  const { data } = await api.put(`/conversations/${id}`, payload);
  return data.data.conversation;
}

export async function removeConversation(id) {
  await api.delete(`/conversations/${id}`);
}

export async function getMessages(id) {
  const { data } = await api.get(`/conversations/${id}/messages`);
  return data.data.messages;
}

export async function sendMessage(id, content) {
  const { data } = await api.post(`/conversations/${id}/messages`, { content });
  return data.data;
}

export async function regenerateMessage(conversationId, messageId) {
  const { data } = await api.post(`/conversations/${conversationId}/messages/${messageId}/regenerate`);
  return data.data.message;
}
