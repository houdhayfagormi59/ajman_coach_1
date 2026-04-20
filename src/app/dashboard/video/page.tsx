'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Badge from '@/components/Badge';
import { Upload, Play, Pause, SkipBack, SkipForward, Plus, Trash2, Video } from 'lucide-react';

interface VideoItem { id: string; title: string; video_url: string | null; tags: string[]; annotations: any[]; created_at: string; }
interface Annotation { id: string; timestamp_seconds: number; type: string; text: string; }

function uid() { return Math.random().toString(36).slice(2, 8); }
function fmt(s: number) { return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }

const tagColors: Record<string, string> = {
  pass: 'bg-blue-100 text-blue-800', shot: 'bg-orange-100 text-orange-800', tackle: 'bg-yellow-100 text-yellow-800',
  goal: 'bg-green-100 text-green-800', foul: 'bg-red-100 text-red-800', note: 'bg-slate-100 text-slate-800',
};

export default function VideoAnalysisPage() {
  const supabase = createClient();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [active, setActive] = useState<VideoItem | null>(null);
  const [form, setForm] = useState({ title: '', video_url: '', tags: '' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ct, setCt] = useState(0);
  const [anns, setAnns] = useState<Annotation[]>([]);
  const [newAnn, setNewAnn] = useState({ type: 'note', text: '' });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('video_analyses').select('*').order('created_at', { ascending: false });
    setVideos((data ?? []) as VideoItem[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('video_analyses').insert({
      coach_id: user.id, title: form.title, video_url: form.video_url || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
    });
    setModal(false); setForm({ title: '', video_url: '', tags: '' }); load();
  }

  function open(v: VideoItem) { setActive(v); setAnns(v.annotations || []); setCt(0); }

  function addAnn() {
    if (!newAnn.text.trim()) return;
    const a: Annotation = { id: uid(), timestamp_seconds: Math.floor(ct), type: newAnn.type, text: newAnn.text };
    const next = [...anns, a].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
    setAnns(next); setNewAnn({ type: 'note', text: '' });
    if (active) supabase.from('video_analyses').update({ annotations: next }).eq('id', active.id);
  }

  function delAnn(id: string) {
    const next = anns.filter((a) => a.id !== id); setAnns(next);
    if (active) supabase.from('video_analyses').update({ annotations: next }).eq('id', active.id);
  }

  function seek(s: number) { if (videoRef.current) videoRef.current.currentTime = s; }
  function step(d: number) { if (videoRef.current) videoRef.current.currentTime += d; }
  function toggle() { if (!videoRef.current) return; playing ? videoRef.current.pause() : videoRef.current.play(); setPlaying(!playing); }

  if (active) return (
    <div className="space-y-4 animate-fade-in-up">
      <button onClick={() => setActive(null)} className="text-sm text-brand-600 font-semibold hover:underline">← Back</button>
      <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{active.title}</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {active.video_url ? (
            <div className="card overflow-hidden">
              <video ref={videoRef} src={active.video_url} className="w-full aspect-video bg-black"
                onTimeUpdate={() => setCt(videoRef.current?.currentTime ?? 0)} onEnded={() => setPlaying(false)} />
              <div className="flex items-center gap-2 p-3">
                <button onClick={() => step(-5)} className="p-1.5 rounded hover:bg-brand-50"><SkipBack size={16} /></button>
                <button onClick={() => step(-1/30)} className="p-1.5 rounded hover:bg-brand-50 text-[10px] font-mono">-1f</button>
                <button onClick={toggle} className="p-2 rounded-lg gradient-brand text-white">{playing ? <Pause size={16} /> : <Play size={16} />}</button>
                <button onClick={() => step(1/30)} className="p-1.5 rounded hover:bg-brand-50 text-[10px] font-mono">+1f</button>
                <button onClick={() => step(5)} className="p-1.5 rounded hover:bg-brand-50"><SkipForward size={16} /></button>
                <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-secondary)' }}>{fmt(ct)}</span>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center"><Video size={48} className="mx-auto mb-3 opacity-30" /><p style={{ color: 'var(--text-secondary)' }}>No video URL</p></div>
          )}
          <div className="card p-3">
            <div className="flex gap-2 flex-wrap items-end">
              <select value={newAnn.type} onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value })} className="input-base w-28 py-1.5 text-xs">
                {['pass','shot','tackle','goal','foul','note'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={newAnn.text} onChange={(e) => setNewAnn({ ...newAnn, text: e.target.value })} className="input-base flex-1 py-1.5 text-xs" placeholder={`Tag at ${fmt(ct)}...`} />
              <Button size="sm" onClick={addAnn}>Add</Button>
            </div>
          </div>
        </div>
        <div className="card p-3 max-h-[500px] overflow-y-auto scrollbar-thin">
          <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Annotations ({anns.length})</h3>
          {anns.length === 0 ? <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No annotations yet.</p> : (
            <ul className="space-y-1.5">
              {anns.map((a) => (
                <li key={a.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-700 cursor-pointer group" onClick={() => seek(a.timestamp_seconds)}>
                  <span className="text-[11px] font-mono font-bold text-brand-600 w-9 shrink-0">{fmt(a.timestamp_seconds)}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tagColors[a.type] || ''}`}>{a.type}</span>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{a.text}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); delAnn(a.id); }} className="opacity-0 group-hover:opacity-100 text-red-500 p-1"><Trash2 size={12} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Video Analysis</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload, annotate, and analyze match footage</p>
        </div>
        <Button onClick={() => setModal(true)}><Plus size={16} /> New Video</Button>
      </div>
      {loading ? <div className="card p-8 text-center text-sm">Loading…</div> : videos.length === 0 ? (
        <div className="card p-12 text-center"><Video size={48} className="mx-auto mb-3 opacity-30" /><p style={{ color: 'var(--text-secondary)' }}>No videos yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="card p-4 card-hover cursor-pointer group" onClick={() => open(v)}>
              <div className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 overflow-hidden">
                {v.video_url ? <video src={v.video_url} className="w-full h-full object-cover" muted preload="metadata" /> : <Video size={32} className="opacity-30" />}
              </div>
              <h3 className="font-bold text-sm group-hover:text-brand-600 transition" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
              <div className="flex gap-1 mt-2 flex-wrap">{v.tags?.map((t, i) => <Badge key={i} variant="brand">{t}</Badge>)}</div>
              <span className="text-xs mt-1 block" style={{ color: 'var(--text-secondary)' }}>{v.annotations?.length || 0} annotations</span>
            </div>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title="New Video Analysis">
        <form onSubmit={create} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Match vs Al Ain" />
          <Input label="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://… (MP4, WebM)" />
          <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="match, set-piece" />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
}
