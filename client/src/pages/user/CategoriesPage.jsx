import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FolderOpen, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { useCategoryStore } from '../../store/categoryStore';
export default function CategoriesPage() {
  const { categories, fetch, create, update, remove } = useCategoryStore();
  const [name, setName] = useState(''); const [parentId, setParentId] = useState(''); const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(''); const [toDelete, setToDelete] = useState(null); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch().catch((e) => toast.error(e.message)); }, [fetch]);
  const submit = async (e) => { e.preventDefault(); if (!name.trim()) return; setBusy(true);
    try { await create({ name: name.trim(), parentId: parentId || null }); setName(''); setParentId(''); await fetch(); toast.success('Category created'); }
    catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };
  const saveEdit = async (id) => { try { await update(id, { name: editValue }); await fetch(); setEditId(null); toast.success('Category renamed'); } catch (e) { toast.error(e.message); } };
  const deleteCategory = async () => { try { await remove(toDelete._id); await fetch(); toast.success('Category removed, bookmarks retained'); setToDelete(null); } catch (e) { toast.error(e.message); } };
  return <><PageHeader eyebrow="ORGANISE YOUR WORLD" title={<>Your <span className="accent">Categories</span></>} description="Build categories that make sense to you. Subcategories are supported one level deep."/>
    <form className="panel category-create" onSubmit={submit}><div><h3><Plus size={19}/> Create a category</h3><p>Every new category belongs only to your account.</p></div><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Machine Learning" maxLength={60} required/>
      <select className="input" value={parentId} onChange={(e) => setParentId(e.target.value)}><option value="">Top-level category</option>{categories.filter((c) => !c.parentId).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <Button type="submit" loading={busy}><Plus size={17}/> Create</Button></form>
    {categories.length ? <div className="category-grid">{categories.map((c) => <article className="panel category-card" key={c._id}><div className="category-icon"><FolderOpen size={22}/></div><div className="category-content">{editId === c._id ? <div className="inline-edit"><input autoFocus className="input" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(c._id)}/><button className="icon-btn" onClick={() => saveEdit(c._id)}><Check size={18}/></button><button className="icon-btn" onClick={() => setEditId(null)}><X size={18}/></button></div> : <h3>{c.name}</h3>}<p>{c.count || 0} saved resources</p>{c.parentId && <small>Subcategory</small>}{c.isDefault && <small>Default category</small>}</div>
      <div className="category-actions"><button title="Rename category" onClick={() => { setEditId(c._id); setEditValue(c.name); }} className="icon-btn"><Pencil size={17}/></button><button title="Delete category" onClick={() => setToDelete(c)} className="icon-btn"><Trash2 size={17}/></button></div></article>)}</div> : <EmptyState title="No categories yet" description="Create your first category using the form above."/>}
    <ConfirmDialog open={Boolean(toDelete)} title={`Delete ${toDelete?.name || 'category'}?`} message="Bookmarks will remain in your library and become Uncategorised. Delete subcategories first." onCancel={() => setToDelete(null)} onConfirm={deleteCategory}/>
  </>;
}
