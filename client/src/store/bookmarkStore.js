import { create } from 'zustand';
import { bookmarkService } from '../services/bookmarkService';
export const useBookmarkStore = create((set) => ({
  bookmarks: [], loading: false,
  fetch: async (params = {}) => { set({ loading: true }); try { const bookmarks = await bookmarkService.list(params); set({ bookmarks }); return bookmarks; } finally { set({ loading: false }); } },
  create: async (body) => { const bookmark = await bookmarkService.create(body); set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] })); return bookmark; },
  update: async (id, body) => { const updated = await bookmarkService.update(id, body); set((s) => ({ bookmarks: s.bookmarks.map((b) => b._id === id ? updated : b) })); return updated; },
  remove: async (id) => { await bookmarkService.remove(id); set((s) => ({ bookmarks: s.bookmarks.filter((b) => b._id !== id) })); },
  clear: () => set({ bookmarks: [], loading: false }),
}));
