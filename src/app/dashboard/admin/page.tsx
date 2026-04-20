'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { Shield, Users, Eye, BarChart3, Activity } from 'lucide-react';
import type { Coach, Player, Team, Injury, Performance } from '@/lib/types';

interface CoachWithStats extends Coach {
  _players: number; _teams: number; _injuries: number; _performances: number;
}

export default function AdminPanel() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState<CoachWithStats[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [coachPlayers, setCoachPlayers] = useState<Player[]>([]);
  const [coachTeams, setCoachTeams] = useState<Team[]>([]);
  const [coachInjuries, setCoachInjuries] = useState<Injury[]>([]);
  const [coachPerf, setCoachPerf] = useState<Performance[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: coach } = await supabase.from('coaches').select('*').eq('id', user.id).single();
    if (!coach || coach.role !== 'admin') { setIsAdmin(false); setLoading(false); return; }
    setIsAdmin(true);

    const { data: allCoaches } = await supabase.from('coaches').select('*').order('created_at', { ascending: false });
    const { data: allPlayers } = await supabase.from('players').select('id,coach_id');
    const { data: allTeams } = await supabase.from('teams').select('id,coach_id');
    const { data: allInjuries } = await supabase.from('injuries').select('id,coach_id').eq('status', 'active');
    const { data: allPerf } = await supabase.from('performances').select('id,coach_id');

    const enriched = (allCoaches ?? []).map((c: Coach) => ({
      ...c,
      _players: (allPlayers ?? []).filter((p) => p.coach_id === c.id).length,
      _teams: (allTeams ?? []).filter((t) => t.coach_id === c.id).length,
      _injuries: (allInjuries ?? []).filter((i) => i.coach_id === c.id).length,
      _performances: (allPerf ?? []).filter((p) => p.coach_id === c.id).length,
    }));

    setCoaches(enriched);
    setLoading(false);
  }

  async function viewCoach(coachId: string) {
    setSelectedCoach(coachId);
    setDetailLoading(true);
    const [p, t, i, perf] = await Promise.all([
      supabase.from('players').select('*').eq('coach_id', coachId).order('last_name'),
      supabase.from('teams').select('*').eq('coach_id', coachId),
      supabase.from('injuries').select('*').eq('coach_id', coachId).eq('status', 'active'),
      supabase.from('performances').select('*').eq('coach_id', coachId).order('match_date', { ascending: false }).limit(20),
    ]);
    setCoachPlayers((p.data ?? []) as Player[]);
    setCoachTeams((t.data ?? []) as Team[]);
    setCoachInjuries((i.data ?? []) as Injury[]);
    setCoachPerf((perf.data ?? []) as Performance[]);
    setDetailLoading(false);
  }

  async function toggleRole(coachId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'coach' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    await supabase.from('coaches').update({ role: newRole }).eq('id', coachId);
    load();
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="card p-8 text-center">Loading…</div>;
  if (!isAdmin) return (
    <div className="card p-12 text-center animate-fade-in-up">
      <Shield size={48} className="mx-auto mb-3 opacity-30" />
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>You need admin privileges to access this panel.</p>
    </div>
  );

  const selectedData = coaches.find((c) => c.id === selectedCoach);

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center"><Shield size={20} /></div>
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View all coaches, their players, and activity</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="label">Total Coaches</div><div className="text-2xl font-extrabold text-brand-600">{coaches.length}</div></div>
        <div className="card p-4"><div className="label">Total Players</div><div className="text-2xl font-extrabold text-brand-600">{coaches.reduce((s, c) => s + c._players, 0)}</div></div>
        <div className="card p-4"><div className="label">Total Teams</div><div className="text-2xl font-extrabold text-brand-600">{coaches.reduce((s, c) => s + c._teams, 0)}</div></div>
        <div className="card p-4"><div className="label">Active Injuries</div><div className="text-2xl font-extrabold text-red-600">{coaches.reduce((s, c) => s + c._injuries, 0)}</div></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Coaches list */}
        <div className="lg:col-span-1 card p-4 max-h-[600px] overflow-y-auto scrollbar-thin">
          <h2 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>All Coaches</h2>
          <ul className="space-y-2">
            {coaches.map((c) => (
              <li key={c.id}
                onClick={() => viewCoach(c.id)}
                className={`p-3 rounded-lg cursor-pointer transition ${selectedCoach === c.id ? 'gradient-brand text-white' : 'hover:bg-brand-50 dark:hover:bg-slate-700'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{c.full_name}</div>
                    <div className="text-xs opacity-75">{c.email}</div>
                  </div>
                  <Badge variant={c.role === 'admin' ? 'danger' : 'neutral'}>{c.role}</Badge>
                </div>
                <div className="flex gap-3 mt-2 text-xs opacity-75">
                  <span>{c._players} players</span>
                  <span>{c._teams} teams</span>
                  <span>{c._injuries} injuries</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Coach detail */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedCoach ? (
            <div className="card p-12 text-center">
              <Eye size={32} className="mx-auto mb-2 opacity-30" />
              <p style={{ color: 'var(--text-secondary)' }}>Select a coach to view their data</p>
            </div>
          ) : detailLoading ? (
            <div className="card p-8 text-center">Loading coach data…</div>
          ) : (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedData?.full_name}</h2>
                  <Button size="sm" variant="secondary" onClick={() => toggleRole(selectedCoach, selectedData?.role || 'coach')}>
                    Toggle {selectedData?.role === 'admin' ? '→ Coach' : '→ Admin'}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20"><div className="text-lg font-bold text-brand-600">{coachPlayers.length}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Players</div></div>
                  <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20"><div className="text-lg font-bold text-brand-600">{coachTeams.length}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Teams</div></div>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20"><div className="text-lg font-bold text-red-600">{coachInjuries.length}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Injuries</div></div>
                  <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20"><div className="text-lg font-bold text-brand-600">{coachPerf.length}</div><div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Matches</div></div>
                </div>
              </div>

              {/* Players */}
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Users size={16} /> Players ({coachPlayers.length})</h3>
                {coachPlayers.length === 0 ? <p className="text-xs py-3 text-center" style={{ color: 'var(--text-secondary)' }}>No players</p> : (
                  <div className="max-h-60 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead><tr className="gradient-brand-soft"><th className="px-3 py-2 text-left text-xs font-semibold">Name</th><th className="px-3 py-2 text-left text-xs font-semibold">Pos</th><th className="px-3 py-2 text-left text-xs font-semibold">Age Group</th><th className="px-3 py-2 text-left text-xs font-semibold">Status</th></tr></thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {coachPlayers.map((p) => (
                          <tr key={p.id} className="hover:bg-brand-50 dark:hover:bg-slate-700">
                            <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>{p.first_name} {p.last_name}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{p.position}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{p.age_group || '—'}</td>
                            <td className="px-3 py-2"><Badge variant={p.status}>{p.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent performances */}
              <div className="card p-4">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><BarChart3 size={16} /> Recent Matches ({coachPerf.length})</h3>
                {coachPerf.length === 0 ? <p className="text-xs py-3 text-center" style={{ color: 'var(--text-secondary)' }}>No matches</p> : (
                  <div className="max-h-48 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead><tr className="gradient-brand-soft"><th className="px-3 py-2 text-left text-xs font-semibold">Date</th><th className="px-3 py-2 text-left text-xs font-semibold">Opponent</th><th className="px-3 py-2 text-left text-xs font-semibold">Goals</th><th className="px-3 py-2 text-left text-xs font-semibold">Rating</th></tr></thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {coachPerf.slice(0, 10).map((p) => (
                          <tr key={p.id}><td className="px-3 py-2">{p.match_date}</td><td className="px-3 py-2">{p.opponent}</td><td className="px-3 py-2 font-bold text-brand-600">{p.goals}</td><td className="px-3 py-2">{p.rating ?? '—'}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
