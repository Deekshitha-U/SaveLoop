import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
export const categoryService = {
  list: async () => DEMO_MODE ? demo.listCategories() : (await api.get('/categories')).data.categories,
  create: async (body) => DEMO_MODE ? demo.createCategory(body) : (await api.post('/categories', body)).data.category,
  update: async (id, body) => DEMO_MODE ? demo.updateCategory(id, body) : (await api.patch(`/categories/${id}`, body)).data.category,
  remove: async (id) => DEMO_MODE ? demo.deleteCategory(id) : (await api.delete(`/categories/${id}`)).data,
};
