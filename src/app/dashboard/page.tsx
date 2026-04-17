import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/StatCard';
import PieChart from '@/components/PieChart';
import Badge from '@/components/Badge';
import { Users, Activity, BarChart3, Calendar, TrendingUp, Heart, Target } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [playersR, teamsR, injuriesR, sessionsR, perfR, recruitmentR] = await Promise.all([
    supabase.from('players').select('id,status,first_name,last_name,position,team_id,age_group,created_at'),
    supabase.from('teams').select('id,name,age_group'),
    supabase.from('injuries').select('id,severity,status,body_part,player_id').eq('status', 'active'),
    supabase.from('sessions').select('id,title,session_date,focus_area').order('session_date', { ascending: false }).limit(5),
    supabase.from('performances').select('id,rating,match_date,team_id').order('match_date', { ascending: false }).limit(20),
    supabase.from('recruitment').select('id,status').eq('status', 'signed'),
  ]);

  const players = playersR.data ?? [];
  const teams = teamsR.data ?? [];
  const injuries = injuriesR.data ?? [];
  const sessions = sessionsR.data ?? [];
  const performances = perfR.data ?? [];
  const recruits = recruitmentR.data ?? [];

  const fit = players.filter((p) => p.status === 'fit').length;
  const injured = players.filter((p) => p.status === 'injured').length;
  const recovering = players.filter((p) => p.status === 'recovering').length;
  const avgRating = performances.length
    ? (performances.reduce((s, p) => s + (p.rating ?? 0), 0) / performances.length).toFixed(1)
    : '—';

  const injuryData = [
    { name: 'Active', value: injuries.filter((i) => i.status === 'active').length },
    { name: 'Minor', value: injuries.filter((i) => i.severity === 'minor').length },
    { name: 'Moderate', value: injuries.filter((i) => i.severity === 'moderate').length },
    { name: 'Severe', value: injuries.filter((i) => i.severity === 'severe').length },
  ].filter((d) => d.value > 0);

  const playersByTeam = teams.map((t) => ({
    name: t.name || t.age_group || 'Unassigned',
    value: players.filter((p) => p.team_id === t.id).length,
  })).filter((d) => d.value > 0);

  const recentPlayers = [...players]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-800">Dashboard</h1>
          <p className="text-sm text-slate-600">Overview of your squad and activity</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total players" value={players.length} icon={<Users size={20} />} accent />
        <StatCard label="Fit" value={fit} icon={<Heart size={20} />} hint={`${injured} injured`} />
        <StatCard label="Teams" value={teams.length} icon={<Award size={20} />} />
        <StatCard label="Active injuries" value={injuries.length} icon={<Activity size={20} />} />
        <StatCard label="Avg rating" value={avgRating} icon={<TrendingUp size={20} />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-bold text-brand-800 text-lg mb-4">Players by team</h2>
          {playersByTeam.length > 0 ? (
            <PieChart data={playersByTeam} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No teams created yet</p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-brand-800 text-lg mb-4">Injury analysis</h2>
          {injuryData.length > 0 ? (
            <PieChart data={injuryData} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No active injuries</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5">
          <header className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-800 text-lg">Recent players</h2>
            <Link href="/dashboard/players" className="text-sm text-brand-600 hover:underline">View all →</Link>
          </header>
          {recentPlayers.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No players yet.</p>
          ) : (
            <ul className="divide-y divide-orange-50">
              {recentPlayers.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/players/${p.id}`} className="flex items-center justify-between py-3 hover:bg-brand-50/50 -mx-2 px-3 rounded-lg transition">
                    <div>
                      <div className="font-semibold text-slate-800">{p.first_name} {p.last_name}</div>
                      <div className="text-xs text-slate-500">{p.position} · {p.age_group}</div>
                    </div>
                    <Badge variant={p.status as any}>{p.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <header className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-800 text-lg">Training sessions</h2>
            <Link href="/dashboard/sessions" className="text-sm text-brand-600 hover:underline">View all →</Link>
          </header>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No sessions scheduled.</p>
          ) : (
            <ul className="divide-y divide-orange-50">
              {sessions.map((s) => (
                <li key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{s.title}</div>
                    <div className="text-xs text-slate-500">{s.focus_area}</div>
                  </div>
                  <div className="text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">{formatDate(s.session_date)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {recruits.length > 0 && (
        <section className="card p-5 bg-gradient-to-r from-brand-50 to-white border-brand-200">
          <h2 className="font-bold text-brand-800 text-lg mb-2 flex items-center gap-2"><Target size={18} /> Recruitment success</h2>
          <p className="text-sm text-slate-700">{recruits.length} player{recruits.length !== 1 ? 's' : ''} signed from scouting pipeline</p>
        </section>
      )}
    </div>
  );
}

function Award(props: any) {
  return <div {...props}>🏆</div>;
}
