import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, WandSparkles, Link2, CalendarClock, Check, AlertTriangle, Info, Pencil, Tags, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useCategoryStore } from '../../store/categoryStore';
import { aiService } from '../../services/aiService';
import { reminderService } from '../../services/reminderService';
import { toDateTimeLocal } from '../../utils/dateUtils';
import './bookmark-analyzer.css';

const empty = { url: '', title: '', description: '', notes: '', tags: '', categoryId: '', status: 'pending', priority: 'normal' };
const validUrl = (url) => /^https?:\/\/[^\s/]+\.[^\s/]+/i.test(url.trim());
const displayPlatform = (name) => name ? name[0].toUpperCase() + name.slice(1) : 'Website';

export default function BookmarkForm({ initial = null }) {
  const navigate = useNavigate();
  const { create, update } = useBookmarkStore();
  const { categories, fetch } = useCategoryStore();
  const [form, setForm] = useState(empty);
  const [remindAt, setRemindAt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(Boolean(initial));
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const requestSeq = useRef(0);
  const firstUrl = useRef(true);

  useEffect(() => { fetch().catch((e) => toast.error(e.message)); }, [fetch]);
  useEffect(() => {
    if (!initial) return;
    setForm({ url: initial.url || '', title: initial.title || '', description: initial.description || '',
      notes: initial.notes || '', tags: (initial.tags || []).map((tag) => `#${tag}`).join(' '),
      categoryId: initial.categoryId || '', status: initial.status || 'pending', priority: initial.priority || 'normal' });
    setDetailsOpen(true);
  }, [initial]);

  const patch = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const analyze = useCallback(async (url, showToast = false, typedFields = null) => {
    if (!validUrl(url)) {
      if (showToast) toast.error('Paste a complete http:// or https:// link first');
      return;
    }
    const request = ++requestSeq.current;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await aiService.categorize({ url, ...(typedFields || {}) });
      if (request !== requestSeq.current) return;
      setAnalysis(result);
      const main = result?.suggestions?.find((s) => s.name && s.name !== 'Uncategorised');
      const suggestedCategory = categories.find((category) => category.name.toLowerCase() === main?.name?.toLowerCase());
      setForm((old) => {
        if (old.url !== url) return old;
        return {
          ...old,
          title: old.title.trim() || result.title || '',
          description: old.description.trim() || result.description || '',
          tags: old.tags.trim() || [...new Set([...(result.extractedTags || []), ...(result.suggestedTags || [])])].map((tag) => `#${tag}`).join(' '),
          categoryId: old.categoryId || suggestedCategory?._id || '',
        };
      });
      if (result.status === 'limited' || result.status === 'unavailable') setDetailsOpen(true);
      if (showToast) {
        if (result.status === 'limited' || result.status === 'unavailable') toast('Limited content access. You can add details or save this URL now.', { icon: 'ℹ️' });
        else toast.success('Link analysed! Review or change the suggestions.');
      }
    } catch (error) {
      if (request !== requestSeq.current) return;
      setAnalysis({ status: 'unavailable', platform: '', title: '', suggestions: [],
        message: 'Automatic analysis is unavailable right now. Add details yourself, or save this link without a category.' });
      setDetailsOpen(true);
      if (showToast) toast.error(error.message);
    } finally {
      if (request === requestSeq.current) setAnalyzing(false);
    }
  }, [categories]);

  // Analyse after a pasted URL settles. Never run on an unchanged edit form.
  useEffect(() => {
    if (firstUrl.current) { firstUrl.current = false; return; }
    if (!validUrl(form.url) || (initial && form.url === initial.url)) return undefined;
    const url = form.url;
    const timer = setTimeout(() => analyze(url), 800);
    return () => { clearTimeout(timer); ++requestSeq.current; };
  }, [form.url, initial, analyze]);

  const changeUrl = (value) => {
    ++requestSeq.current;
    setAnalyzing(false);
    setAnalysis(null);
    setForm((old) => ({ ...old, url: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validUrl(form.url)) return toast.error('Enter a valid HTTP/HTTPS URL');
    setSubmitting(true);
    try {
      const payload = { ...form, categoryId: form.categoryId || null };
      const bookmark = initial ? await update(initial._id, payload) : await create(payload);
      if (remindAt) await reminderService.create({ bookmarkId: bookmark._id, remindAt: new Date(remindAt).toISOString() });
      toast.success(initial ? 'Bookmark updated' : 'Link saved to your library!');
      navigate(`/app/bookmarks/${bookmark._id}`);
    } catch (error) { toast.error(error.message); } finally { setSubmitting(false); }
  };

  const matchedCategory = categories.find((category) => category._id === form.categoryId);
  const detected = analysis?.platform || (initial?.platform || '');
  const limited = ['limited', 'unavailable'].includes(analysis?.status);

  return <div className="form-columns">
    <form className="panel bookmark-form" onSubmit={submit}>
      <span className="pill-accent"><Link2 size={15}/> Save from anywhere</span>
      <h3 className="analyzer-intro">Paste a link. SaveLoop will try to organise it.</h3>
      <p className="analyzer-help">Supports YouTube, Instagram, Facebook, Pinterest, LinkedIn and websites. Some platforms restrict access to post details.</p>
      <div className="url-field">
        <Input label="Link URL *" type="url" placeholder="Paste a post, video, Pin, or article URL" value={form.url} onChange={(event) => changeUrl(event.target.value)} required />
        <Button variant="secondary" loading={analyzing} disabled={!validUrl(form.url)} onClick={() => analyze(form.url, true, { title: form.title, description: form.description, notes: form.notes, tags: form.tags })}>
          <WandSparkles size={17}/> Analyse link
        </Button>
      </div>
      {analyzing && <div className="analyzer-state analyzer-working" role="status"><span className="spinner small"/> Checking available content details and categories…</div>}
      {analysis && !analyzing && <div className={`analyzer-state ${limited ? 'analyzer-limited' : 'analyzer-success'}`} role="status">
        {limited ? <Info size={19}/> : <ShieldCheck size={19}/>}
        <div><strong>{limited ? 'Limited content access' : 'Link analysis ready'}</strong>
          <p>{analysis.message}</p>
          <small>{displayPlatform(detected)} {analysis.aiUsed ? '· Category suggested with AI' : '· Category suggested using available text'}</small>
        </div>
      </div>}
      {(form.title || form.description || form.tags || form.categoryId) && !detailsOpen && <div className="analyzer-preview">
        <strong>{form.title || 'Saved link'}</strong>
        <small>{displayPlatform(detected)} · {matchedCategory?.name || 'Uncategorised'}</small>
        {form.tags && <div className="analyzer-tagline">{form.tags.slice(0, 150)}</div>}
      </div>}
      <button className="analyzer-details-toggle" type="button" onClick={() => setDetailsOpen(!detailsOpen)}>
        <Pencil size={15}/> {detailsOpen ? 'Hide optional details' : 'Review / edit title, tags and category'}
      </button>
      {detailsOpen && <div className="analyzer-fields">
        <Input label="Title (optional)" placeholder="Enter a title if unavailable" value={form.title} onChange={(event) => patch('title', event.target.value)} />
        <label className="field"><span className="field-label">Post caption / description (optional)</span>
          <textarea className="input textarea" rows={3} maxLength={3000} value={form.description} onChange={(event) => patch('description', event.target.value)} placeholder="Caption detected from permitted metadata, or enter it yourself"/></label>
        <Input label="Tags / hashtags (optional)" placeholder="#recipe #coding #interview" value={form.tags} onChange={(event) => patch('tags', event.target.value)} hint="Tags generated by AI are suggestions; you can replace them." />
        <label className="field"><span className="field-label">Your personal notes (optional)</span>
          <textarea className="input textarea" rows={3} maxLength={3000} placeholder="Why did you save this?" value={form.notes} onChange={(event) => patch('notes', event.target.value)}/></label>
        <div className="two-col"><label className="field"><span className="field-label">Category</span>
          <select className="input" value={form.categoryId} onChange={(event) => patch('categoryId', event.target.value)}>
            <option value="">Uncategorised</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select></label>
          <label className="field"><span className="field-label">Status</span><select className="input" value={form.status} onChange={(event) => patch('status', event.target.value)}>
            <option value="pending">Pending</option><option value="completed">Completed</option><option value="archived">Archived</option></select></label>
        </div>
        <label className="field"><span className="field-label">Priority</span><select className="input" value={form.priority} onChange={(event) => patch('priority', event.target.value)}><option value="normal">Normal</option><option value="high">High priority</option><option value="low">Low priority</option></select></label>
        <label className="field"><span className="field-label"><CalendarClock size={15}/> Reminder (optional)</span>
          <input className="input" type="datetime-local" min={toDateTimeLocal(new Date())} value={remindAt} onChange={(event) => setRemindAt(event.target.value)}/></label>
      </div>}
      <div className="analyzer-footer-note"><Info size={15}/> You can save only a URL. Missing details can be added later.</div>
      <div className="form-actions"><Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" loading={submitting}><Check size={17}/>{initial ? 'Save changes' : 'Save bookmark'}</Button></div>
    </form>
    <aside className="form-aside">
      <div className="panel aside-panel"><h3><Sparkles size={18}/> Suggested category</h3>
        {analysis?.suggestions?.length ? analysis.suggestions.map((suggestion) =>
          <div className="suggestion" key={suggestion.name}><span>{suggestion.name}</span><small>{suggestion.confidence} confidence</small></div>) :
          <div className="muted-block">Paste a link to see a category suggestion, when enough text is available.</div>}
        <p>You always control the final category.</p>
      </div>
      <div className="panel aside-panel"><h3><Tags size={18}/> Link information</h3>
        <div className="detected-platform">{detected ? displayPlatform(detected) : 'Waiting for URL'}</div>
        <p>{analysis?.source && analysis.source !== 'none' ? `Source: ${analysis.source}` : 'Original links are saved without downloading restricted media.'}</p>
      </div>
      <div className="panel aside-panel"><h3><AlertTriangle size={18}/> Privacy & access</h3>
        <p>Private or restricted posts may not provide captions or hashtags. SaveLoop never guesses unseen video content. Public website analysis may use an external metadata provider.</p>
        <p>Duplicate URLs are checked against your own library.</p>
      </div>
    </aside>
  </div>;
}
