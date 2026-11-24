import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
// Keep search API separate from bookmark CRUD for easier future expansion.
export const searchService = {
  search: async (params = {}) => DEMO_MODE ? demo.listBookmarks(params) : (await api.get('/search', { params })).data.bookmarks,
};
