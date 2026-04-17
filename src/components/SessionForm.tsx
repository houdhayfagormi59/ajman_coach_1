'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import TacticalBoard from '@/components/TacticalBoard';
import type { Player, Team } from '@/lib/types';

export default function SessionForm({ players, teams }: { players: Player[]; teams?: Team[] }) {
  const router = useRouter();
  const [data, setData] = useState({
    team_id: teams?.[0]?.id ?? '',
    title: '',
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: 90,
    focus_area: 'Tactical',
    location: '',
    coach_notes: '',
    tactical_setup: '',
  });
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelectedPlayers((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function selectAll() { setSelectedPlayers(players.map((p) => p.id)); }
  function selectNone() { setSelectedPlayers([]); }

  const filteredPlayers = data.team_id
    ? players.filter((p) => p.team_id === data.team_id)
    : players;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, player_ids: selectedPlayers }),
    });

    setLoading(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || 'Failed');
    router.push('/dashboard/sessions');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Title" required value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Tactical drills" />
      
      <div className="grid md:grid-cols-3 gap-4">
        {teams && (
          <Select label="Team" value={data.team_id} onChange={(e) => setData({ ...data, team_id: e.target.value })}>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        )}
        <Input label="Date" type="date" required value={data.session_date} onChange={(e) => setData({ ...data, session_date: e.target.value })} />
        <Input label="Duration (min)" type="number" min={10} value={data.duration_minutes} onChange={(e) => setData({ ...data, duration_minutes: Number(e.target.value) })} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select label="Focus area" value={data.focus_area} onChange={(e) => setData({ ...data, focus_area: e.target.value })}>
          {['Tactical','Technical','Physical','Set pieces','Recovery','Match preparation'].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
        <Input label="Location" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="Training ground / Stadium" />
      </div>

      <div className="card p-5 bg-brand-50/50 border-brand-200">
        <h3 className="font-bold text-brand-800 mb-3">Tactical Setup</h3>
        <TacticalBoard onSave={(setup) => setData({ ...data, tactical_setup: setup })} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label">Players attending ({selectedPlayers.length}/{filteredPlayers.length})</label>
          <div className="flex gap-1">
            <button type="button" onClick={selectAll} className="text-xs text-brand-600 font-semibold hover:underline">All</button>
            <span className="text-slate-300">·</span>
            <button type="button" onClick={selectNone} className="text-xs text-brand-600 font-semibold hover:underline">None</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-orange-200 rounded-lg max-h-60 overflow-y-auto scrollbar-thin bg-white">
          {filteredPlayers.length === 0 && <p className="text-sm text-slate-500 col-span-full text-center py-4">No players in selected team.</p>}
          {filteredPlayers.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg bg-brand-50 hover:bg-white border border-transparent hover:border-brand-200 transition">
              <input
                type="checkbox"
                checked={selectedPlayers.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="rounded border-brand-300 text-brand-600"
              />
              <span className="font-medium text-slate-700">{p.first_name} {p.last_name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Coach notes</label>
        <textarea className="input-base min-h-[100px]" value={data.coach_notes} onChange={(e) => setData({ ...data, coach_notes: e.target.value })} placeholder="Session plan, drills, tactical focus..." />
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Create session</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
