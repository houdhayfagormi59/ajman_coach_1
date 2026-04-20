'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Select from '@/components/Select';
import Badge from '@/components/Badge';
import PieChart from '@/components/PieChart';
import { BarChart3, TrendingUp, Target, Shield, Zap, Heart, Star, Activity } from 'lucide-react';
import { calculatePlayerKPIs, type PlayerKPIs } from '@/lib/kpi/engine';
import { POSITION_BEHAVIORS } from '@/lib/football-principles';
import type { Player, Performance, Injury } from '@/lib/types';

function KPICard({ label, value, suffix, color }: { label: string; value: string | number; suffix?: string; color?: string }) {
  return (
    <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-soft)' }}>
      <div className={`text-xl font-extrabold ${color || 'text-brand-600'}`}>{value}{suffix}</div>
      <div className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  );
}

export default function PlayerAnalyticsPage() {
  const supabase = createClient();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [kpis, setKpis] = useState<PlayerKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('players').select('*').order('last_name');
      setPlayers((data ?? []) as Player[]);
      setLoading(false);
    })();
  }, []);

  async function analyze() {
    if (!selectedId) return;
    const [perfR, injR] = await Promise.all([
      supabase.from('performances').select('*').eq('player_id', selectedId).order('match_date', { ascending: false }),
      supabase.from('injuries').select('*').eq('player_id', selectedId),
    ]);
    const player = players.find(p => p.id === selectedId)!;
    const k = calculatePlayerKPIs(player, (perfR.data ?? []) as Performance[], (injR.data ?? []) as Injury[], 30);
    setKpis(k);
  }

  useEffect(() => { if (selectedId) analyze(); }, [selectedId]);

  const player = players.find(p => p.id === selectedId);
  const behaviors = player ? POSITION_BEHAVIORS[player.position] : null;
  const trendColors = { rising: 'text-green-600', stable: 'text-blue-600', declining: 'text-red-600' };
  const trendLabels = { rising: '📈 Rising', stable: '➡️ Stable', declining: '📉 Declining' };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Player Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Professional KPI dashboard — Wyscout-level insights</p>
      </div>

      <div className="card p-4">
        <Select label="Select Player" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Choose a player…</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.position} ({p.age_group || 'N/A'})</option>)}
        </Select>
      </div>

      {kpis && player && (
        <>
          {/* Header */}
          <div className="card p-5 gradient-brand-soft">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center text-3xl overflow-hidden border-2" style={{ borderColor: 'var(--border)' }}>
                {player.photo_url ? <img src={player.photo_url} alt="" className="w-full h-full object-cover" /> : '⚽'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{player.first_name} {player.last_name}</h2>
                <div className="text-sm flex gap-2 flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                  <Badge variant="brand">{player.position}</Badge>
                  <Badge variant="neutral">{player.age_group || 'N/A'}</Badge>
                  <Badge variant={player.status}>{player.status}</Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-brand-600">{kpis.overallScore}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Overall</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${trendColors[kpis.formTrend]}`}>{trendLabels[kpis.formTrend]}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Form</div>
              </div>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <KPICard label="Matches" value={kpis.matchesPlayed} />
            <KPICard label="Goals/Match" value={kpis.goalsPerMatch} />
            <KPICard label="Assists/Match" value={kpis.assistsPerMatch} />
            <KPICard label="Avg Rating" value={kpis.avgRating} color={kpis.avgRating >= 7 ? 'text-green-600' : kpis.avgRating >= 5 ? 'text-blue-600' : 'text-red-600'} />
            <KPICard label="Pass Accuracy" value={kpis.passAccuracy} suffix="%" />
            <KPICard label="Availability" value={kpis.availability} suffix="%" color={kpis.availability >= 80 ? 'text-green-600' : 'text-yellow-600'} />
          </div>

          {/* Detailed KPI sections */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Offensive */}
            <div className="card p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Zap size={16} className="text-orange-500" /> Offensive KPIs</h3>
              {[
                { label: 'Goals/Match', value: kpis.goalsPerMatch, max: 1.5 },
                { label: 'Assists/Match', value: kpis.assistsPerMatch, max: 1 },
                { label: 'Shot Accuracy', value: kpis.shotAccuracy, max: 100 },
                { label: 'Conversion Rate', value: kpis.conversionRate, max: 30 },
                { label: 'xG Contribution', value: kpis.xGContribution, max: 15 },
                { label: 'Key Passes', value: kpis.keyPasses, max: 30 },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{kpi.label}</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}{kpi.max === 100 ? '%' : ''}</span>
                  </div>
                  <ProgressBar value={kpi.value} max={kpi.max} color="bg-gradient-to-r from-orange-400 to-orange-600" />
                </div>
              ))}
            </div>

            {/* Defensive */}
            <div className="card p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Shield size={16} className="text-blue-500" /> Defensive KPIs</h3>
              {[
                { label: 'Tackles/Match', value: kpis.tacklesPerMatch, max: 8 },
                { label: 'Tackle Success', value: Number(kpis.tackleSuccessRate), max: 100 },
                { label: 'Interceptions', value: kpis.interceptions, max: 30 },
                { label: 'Ball Recoveries', value: kpis.recoveries, max: 50 },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{kpi.label}</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}{kpi.max === 100 ? '%' : ''}</span>
                  </div>
                  <ProgressBar value={kpi.value} max={kpi.max} color="bg-gradient-to-r from-blue-400 to-blue-600" />
                </div>
              ))}
            </div>

            {/* Passing */}
            <div className="card p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Target size={16} className="text-green-500" /> Passing</h3>
              {[
                { label: 'Accuracy', value: kpis.passAccuracy, max: 100 },
                { label: 'Passes/Match', value: kpis.passesPerMatch, max: 60 },
                { label: 'Progressive', value: kpis.progressivePasses, max: 40 },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{kpi.label}</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}{kpi.max === 100 ? '%' : ''}</span>
                  </div>
                  <ProgressBar value={kpi.value} max={kpi.max} color="bg-gradient-to-r from-green-400 to-green-600" />
                </div>
              ))}
            </div>

            {/* Form & Consistency */}
            <div className="card p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><TrendingUp size={16} className="text-purple-500" /> Form & Reliability</h3>
              <KPICard label="Last 5 Matches Rating" value={kpis.last5Rating} />
              <KPICard label="Consistency Score" value={kpis.consistencyScore} suffix="/10" />
              <KPICard label="Minutes/Match" value={kpis.minutesPerMatch} />
            </div>
          </div>

          {/* Position-specific work plan */}
          {behaviors && (
            <div className="card p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Activity size={18} /> Development Plan ({player.position})
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold text-sm text-brand-600 mb-2">🎯 Technical Work</h4>
                  {behaviors.techniques.slice(0, 4).map((t, i) => (
                    <div key={i} className="text-xs p-1.5 mb-1 rounded" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-blue-600 mb-2">🧠 Tactical Focus</h4>
                  {behaviors.tactical.slice(0, 4).map((t, i) => (
                    <div key={i} className="text-xs p-1.5 mb-1 rounded" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-600 mb-2">💪 Physical Goals</h4>
                  {behaviors.physical.slice(0, 4).map((t, i) => (
                    <div key={i} className="text-xs p-1.5 mb-1 rounded" style={{ background: 'var(--bg-soft)', color: 'var(--text-primary)' }}>• {t}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
