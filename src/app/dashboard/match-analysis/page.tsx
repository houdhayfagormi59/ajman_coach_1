'use client';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import PieChart from '@/components/PieChart';
import { Play, Pause, SkipBack, SkipForward, Brain, Upload, BarChart3, Zap } from 'lucide-react';
import { detectEventsFromVideo, summarizeEvents, EVENT_CONFIG, type FootballEvent, type FootballEventType } from '@/lib/ai/video-events';

function fmt(s: number) { return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }

export default function MatchAnalysisPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ct, setCt] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() { if (!videoRef.current) return; playing ? videoRef.current.pause() : videoRef.current.play(); setPlaying(!playing); }
  function step(d: number) { if (videoRef.current) videoRef.current.currentTime += d; }
  function seek(s: number) { if (videoRef.current) videoRef.current.currentTime = s; }

  async function runAnalysis() {
    if (!videoUrl) return;
    setAnalyzing(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 2000));
    const dur = videoRef.current?.duration || 5400; // default 90 min
    const detected = detectEventsFromVideo(dur);
    setEvents(detected);
    setAnalyzing(false);
  }

  const summary = summarizeEvents(events);
  const filtered = filterCat === 'all' ? events : events.filter(e => e.category === filterCat);

  const catData = [
    { name: 'Offensive', value: summary.byCategory.offensive },
    { name: 'Defensive', value: summary.byCategory.defensive },
    { name: 'Transition', value: summary.byCategory.transition },
    { name: 'Set Pieces', value: summary.byCategory.set_piece },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center"><Brain size={20} /></div>
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>AI Match Analysis</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Automatic football event detection — Hudl-style analysis</p>
        </div>
      </div>

      {/* Video input */}
      <div className="card p-4">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input label="Video URL (MP4/WebM)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/match.mp4" />
          </div>
          <Button onClick={runAnalysis} loading={analyzing} disabled={!videoUrl}>
            <Zap size={16} /> {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </div>

      {videoUrl && (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Video player */}
          <div className="lg:col-span-2 space-y-3">
            <div className="card overflow-hidden">
              <video ref={videoRef} src={videoUrl} className="w-full aspect-video bg-black"
                onTimeUpdate={() => setCt(videoRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                onEnded={() => setPlaying(false)} />
              <div className="flex items-center gap-2 p-3 flex-wrap">
                <button onClick={() => step(-5)} className="p-1.5 rounded hover:bg-brand-50 dark:hover:bg-slate-700"><SkipBack size={16} /></button>
                <button onClick={() => step(-1/30)} className="p-1.5 rounded hover:bg-brand-50 dark:hover:bg-slate-700 text-[10px] font-mono">-1f</button>
                <button onClick={togglePlay} className="p-2 rounded-lg gradient-brand text-white">{playing ? <Pause size={16} /> : <Play size={16} />}</button>
                <button onClick={() => step(1/30)} className="p-1.5 rounded hover:bg-brand-50 dark:hover:bg-slate-700 text-[10px] font-mono">+1f</button>
                <button onClick={() => step(5)} className="p-1.5 rounded hover:bg-brand-50 dark:hover:bg-slate-700"><SkipForward size={16} /></button>
                <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-secondary)' }}>{fmt(ct)} / {fmt(duration)}</span>
              </div>
              {/* Progress bar with event markers */}
              <div className="px-3 pb-3">
                <div className="relative h-3 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    seek(pct * duration);
                  }}>
                  <div className="absolute h-full rounded-full gradient-brand" style={{ width: `${duration ? (ct / duration) * 100 : 0}%` }} />
                  {events.map((ev) => (
                    <div key={ev.id} className="absolute top-0 w-1 h-full rounded-full opacity-70"
                      style={{ left: `${duration ? (ev.timestamp / duration) * 100 : 0}%`, background: EVENT_CONFIG[ev.type]?.color || '#999' }}
                      title={`${fmt(ev.timestamp)} — ${ev.label}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary stats */}
            {events.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="card p-3 text-center"><div className="text-xl font-extrabold text-brand-600">{summary.total}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Events Detected</div></div>
                <div className="card p-3 text-center"><div className="text-xl font-extrabold text-green-600">{summary.avgConfidence}%</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Avg Confidence</div></div>
                <div className="card p-3 text-center"><div className="text-xl font-extrabold text-blue-600">{summary.byCategory.offensive}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Offensive</div></div>
                <div className="card p-3 text-center"><div className="text-xl font-extrabold text-red-600">{summary.byCategory.defensive}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Defensive</div></div>
              </div>
            )}

            {events.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4"><h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Event Distribution</h3><PieChart data={catData} colors={['#f97316','#3b82f6','#22c55e','#a855f7']} /></div>
                <div className="card p-4">
                  <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Top Events</h3>
                  {summary.topEvents.map((te, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {EVENT_CONFIG[te.type as FootballEventType]?.emoji} {te.label}
                      </span>
                      <Badge variant="brand">{te.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Event timeline */}
          <div className="card p-3 max-h-[700px] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Timeline ({filtered.length})</h3>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-base w-28 py-1 text-xs">
                <option value="all">All</option>
                <option value="offensive">Offensive</option>
                <option value="defensive">Defensive</option>
                <option value="transition">Transition</option>
                <option value="set_piece">Set Pieces</option>
              </select>
            </div>
            {filtered.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: 'var(--text-secondary)' }}>{events.length === 0 ? 'Run AI analysis to detect events' : 'No events in this category'}</p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((ev) => {
                  const cfg = EVENT_CONFIG[ev.type];
                  return (
                    <li key={ev.id} onClick={() => seek(ev.timestamp)}
                      className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-700 cursor-pointer group transition">
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] font-mono font-bold text-brand-600 w-9 shrink-0">{fmt(ev.timestamp)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">{cfg?.emoji}</span>
                            <span className="text-xs font-semibold" style={{ color: cfg?.color }}>{ev.label}</span>
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{ev.zone} · {ev.confidence}% conf</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
