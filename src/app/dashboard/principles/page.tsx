'use client';
import { useState } from 'react';
import { ALL_CATEGORIES, POSITION_BEHAVIORS } from '@/lib/football-principles';
import Badge from '@/components/Badge';
import { ChevronDown, ChevronUp, BookOpen, Target, Dumbbell } from 'lucide-react';

export default function PrinciplesPage() {
  const [openCat, setOpenCat] = useState<string | null>(ALL_CATEGORIES[0].id);
  const [openP, setOpenP] = useState<string | null>(null);
  const [posTab, setPosTab] = useState<string>('GK');

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Principes du Football</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Référentiel complet — Principes individuels, collectifs, transitions & CPA</p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {ALL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="card overflow-hidden">
            <button onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
              className={`w-full flex items-center justify-between px-5 py-3 transition ${openCat === cat.id ? 'bg-gradient-to-r ' + cat.color + ' text-white' : 'gradient-brand-soft'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <span className="font-bold text-sm">{cat.title}</span>
                <span className="text-xs opacity-75">({cat.principles.length})</span>
              </div>
              {openCat === cat.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openCat === cat.id && (
              <div className="p-4 space-y-2">
                {cat.principles.map((p) => (
                  <div key={p.id} className="card overflow-hidden">
                    <button onClick={() => setOpenP(openP === p.id ? null : p.id)}
                      className="w-full text-left px-4 py-3 hover:bg-brand-50 dark:hover:bg-slate-700 transition flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.description}</div>
                      </div>
                      {openP === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openP === p.id && (
                      <div className="px-4 pb-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-xs mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                            <Target size={12} /> Points clés
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {p.keyPoints.map((kp, i) => <Badge key={i} variant="brand">{kp}</Badge>)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                            <Dumbbell size={12} /> Exercices recommandés
                          </h4>
                          <ul className="space-y-1">
                            {p.drills.map((d, i) => (
                              <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <span className="text-brand-600 mt-0.5">•</span> {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                            <BookOpen size={12} /> KPIs à mesurer
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {p.kpis.map((k, i) => <Badge key={i} variant="neutral">{k}</Badge>)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Position-specific behaviors */}
      <div className="card p-5">
        <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Comportements par Poste</h2>
        <div className="flex gap-2 mb-4">
          {Object.keys(POSITION_BEHAVIORS).map((pos) => (
            <button key={pos} onClick={() => setPosTab(pos)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${posTab === pos ? 'gradient-brand text-white' : 'card'}`}
              style={{ color: posTab === pos ? undefined : 'var(--text-secondary)' }}>
              {pos}
            </button>
          ))}
        </div>
        {posTab && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-brand-600">🎯 Technique</h3>
              {POSITION_BEHAVIORS[posTab].techniques.map((t, i) => (
                <div key={i} className="text-xs p-2 rounded-lg" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-blue-600">🧠 Tactique</h3>
              {POSITION_BEHAVIORS[posTab].tactical.map((t, i) => (
                <div key={i} className="text-xs p-2 rounded-lg" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-red-600">💪 Physique</h3>
              {POSITION_BEHAVIORS[posTab].physical.map((t, i) => (
                <div key={i} className="text-xs p-2 rounded-lg" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
