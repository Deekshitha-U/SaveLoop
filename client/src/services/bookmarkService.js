import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
export const bookmarkService = {
  list: async (params = {}) => DEMO_MODE ? demo.listBookmarks(params) : (await api.get('/bookmarks', { params })).data.bookmarks,
  get: async (id) => DEMO_MODE ? demo.getBookmark(id) : (await api.get(`/bookmarks/${id}`)).data.bookmark,
  create: async (body) => DEMO_MODE ? demo.createBookmark(body) : (await api.post('/bookmarks', body)).data.bookmark,
  update: async (id, body) => DEMO_MODE ? demo.updateBookmark(id, body) : (await api.patch(`/bookmarks/${id}`, body)).data.bookmark,
  remove: async (id) => DEMO_MODE ? demo.deleteBookmark(id) : (await api.delete(`/bookmarks/${id}`)).data,
};
