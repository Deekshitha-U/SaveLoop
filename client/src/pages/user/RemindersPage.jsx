import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AlarmClock, BellRing, Plus, CheckCircle2, Trash2, CalendarDays, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { reminderService } from '../../services/reminderService';
import { bookmarkService } from '../../services/bookmarkService';
import { prettyDateTime, toDateTimeLocal } from '../../utils/dateUtils';
export default function RemindersPage() {
  const [reminders, setReminders] = useState([]); const [bookmarks, setBookmarks] = useState([]); const [bookmarkId, setBookmarkId] = useState('');
  const [remindAt, setRemindAt] = useState(toDateTimeLocal()); const [busy, setBusy] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null); const [rescheduleTime, setRescheduleTime] = useState('');
  const refresh = async () => { const [rs, bs] = await Promise.all([reminderService.list(), bookmarkService.list()]); setReminders(rs); setBookmarks(bs); };
  useEffect(() => { refresh().catch((err) => toast.error(err.message)); }, []);
  const create = async (e) => { e.preventDefault(); if (!bookmarkId) return toast.error('Choose a bookmark'); setBusy(true);
    try { await reminderService.create({ bookmarkId, remindAt: new Date(remindAt).toISOString() }); toast.success('Reminder scheduled'); setBookmarkId(''); await refresh(); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  const toggle = async (r) => { try { await reminderService.update(r._id, { completed: !r.completed }); await refresh(); toast.success('Reminder updated'); } catch (e) { toast.error(e.message); } };
  const reschedule = async (id) => { try { await reminderService.update(id, { remindAt: new Date(rescheduleTime).toISOString() }); await refresh(); setRescheduleId(null); toast.success('Reminder rescheduled'); } catch (e) { toast.error(e.message); } };
  const remove = async (r) => { if (!window.confirm('Delete this reminder?')) return; try { await reminderService.remove(r._id); await refresh(); toast.success('Reminder removed'); } catch (e) { toast.error(e.message); } };
  const upcoming = reminders.filter((r) => !r.completed && new Date(r.remindAt) >= new Date());
  const overdue = reminders.filter((r) => !r.completed && new Date(r.remindAt) < new Date());
  const completed = reminders.filter((r) => r.completed);
  return <><PageHeader eyebrow="REVISIT WHAT YOU SAVED" title={<>Your <span className="accent">Reminders</span></>} description="Set an in-app reminder and make time for your saved resources."/>
    <div className="stats-grid three-stats"><div className="panel mini-stat"><BellRing size={23}/><strong>{upcoming.length}</strong><span>Upcoming</span></div><div className="panel mini-stat"><AlarmClock size={23}/><strong>{overdue.length}</strong><span>Overdue</span></div><div className="panel mini-stat"><CheckCircle2 size={23}/><strong>{completed.length}</strong><span>Completed</span></div></div>
    <form className="panel reminder-form" onSubmit={create}><div><h3><Plus size={20}/> Add reminder</h3><p>Reminders appear in this page; no email or push required.</p></div><select className="input" required value={bookmarkId} onChange={(e) => setBookmarkId(e.target.value)}><option value="">Choose a bookmark...</option>{bookmarks.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}</select><input className="input" type="datetime-local" required min={toDateTimeLocal(new Date())} value={remindAt} onChange={(e) => setRemindAt(e.target.value)}/><Button type="submit" loading={busy}><Plus size={17}/> Set reminder</Button></form>
    {reminders.length ? <div className="panel reminders-list"><h2>All reminders</h2>{[...reminders].sort((a,b) => Number(a.completed)-Number(b.completed)).map((r) => <div key={r._id} className={`reminder-row ${r.completed ? 'is-complete' : ''}`}><span className="reminder-icon"><CalendarDays size={21}/></span><div><strong>{r.bookmarkId?.title || 'Deleted bookmark'}</strong><small>{prettyDateTime(r.remindAt)} {(!r.completed && new Date(r.remindAt) < new Date()) ? ' · Overdue' : ''}</small></div><div className="reminder-actions"><button className="btn btn-outline btn-sm" onClick={() => { setRescheduleId(r._id); setRescheduleTime(toDateTimeLocal(r.remindAt)); }}>Reschedule</button><button className="btn btn-outline btn-sm" onClick={() => toggle(r)}>{r.completed ? 'Mark pending' : 'Complete'}</button><button title="Delete" className="icon-btn" onClick={() => remove(r)}><Trash2 size={17}/></button></div>{rescheduleId === r._id && <div className="reschedule-inline"><input className="input" type="datetime-local" value={rescheduleTime} min={toDateTimeLocal(new Date())} onChange={(e) => setRescheduleTime(e.target.value)}/><button className="btn btn-primary btn-sm" onClick={() => reschedule(r._id)}>Save time</button><button className="btn btn-outline btn-sm" onClick={() => setRescheduleId(null)}>Cancel</button></div>}</div>)}</div> : <EmptyState title="No reminders yet" description="Choose a bookmark and schedule a time above."/>}
  </>;
}
