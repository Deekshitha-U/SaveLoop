import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
export const aiService = {
  categorize: async (body) => DEMO_MODE ? demo.categorize(body) : (await api.post('/ai/categorize', body)).data,
  chat: async (message) => DEMO_MODE ? demo.chat(message) : (await api.post('/ai/chat', { message })).data,
  history: async () => DEMO_MODE ? [] : (await api.get('/ai/history')).data.messages,
};
