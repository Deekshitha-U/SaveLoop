import { create } from 'zustand';
import { categoryService } from '../services/categoryService';
export const useCategoryStore = create((set) => ({
  categories: [], loading: false,
  fetch: async () => { set({ loading: true }); try { const categories = await categoryService.list(); set({ categories }); return categories; } finally { set({ loading: false }); } },
  create: async (body) => { const category = await categoryService.create(body); set((s) => ({ categories: [...s.categories, category] })); return category; },
  update: async (id, body) => { const updated = await categoryService.update(id, body); set((s) => ({ categories: s.categories.map((c) => c._id === id ? updated : c) })); return updated; },
  remove: async (id) => { await categoryService.remove(id); set((s) => ({ categories: s.categories.filter((c) => c._id !== id) })); },
  clear: () => set({ categories: [], loading: false }),
}));
