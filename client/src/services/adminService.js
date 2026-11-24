import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
export const adminService = {
  stats: async () => DEMO_MODE ? demo.stats() : (await api.get('/admin/stats')).data.stats,
  users: async (q = '') => DEMO_MODE ? demo.listUsers(q) : (await api.get('/admin/users', { params: { q } })).data.users,
  user: async (id) => DEMO_MODE ? demo.getUser(id) : (await api.get(`/admin/users/${id}`)).data.user,
  update: async (id, body) => DEMO_MODE ? demo.updateUser(id, body) : (await api.patch(`/admin/users/${id}`, body)).data.user,
};
