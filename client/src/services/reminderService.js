import { DEMO_MODE } from '../config/firebase';
import { demo } from './demoService';
import { api } from './api';
export const reminderService = {
  list: async () => DEMO_MODE ? demo.listReminders() : (await api.get('/reminders')).data.reminders,
  create: async (body) => DEMO_MODE ? demo.createReminder(body) : (await api.post('/reminders', body)).data.reminder,
  update: async (id, body) => DEMO_MODE ? demo.updateReminder(id, body) : (await api.patch(`/reminders/${id}`, body)).data.reminder,
  remove: async (id) => DEMO_MODE ? demo.deleteReminder(id) : (await api.delete(`/reminders/${id}`)).data,
};
