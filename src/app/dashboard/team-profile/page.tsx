'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Select from '@/components/Select';
import Badge from '@/components/Badge';
import PieChart from '@/components/PieChart';
import PhotoUpload from '@/components/PhotoUpload';
import { Shield, TrendingUp, Users, Target, Activity } from 'lucide-react';
import { analyzeTeamStyle } from '@/lib/football-principles';
import type { Team, Player, Performance } from '@/lib/types';

export default function TeamProfilePage() {
  const supabase = createClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLogo, setTeamLogo] = useState<string>('');

  async function loadTeams() {
    setLoading(true);
    const { data } = await supabase.from('teams').select('*').order('name');
    setTeams((data ?? []) as Team[]);
    setLoading(false);
  }

  async function loadTeamData(teamId: string) {
    const [p, perf] = await Promise.all([
      supabase.from('players').select('*').eq('team_id', teamId),
      supabase.from('performances').select('*').eq('team_id', teamId).order('match_date', { ascending: false }),
    ]);
    setPlayers((p.data ?? []) as Player[]);
    setPerformances((perf.data ?? []) as Performance[]);
    const team = teams.find((t) => t.id === teamId);
    setTeamLogo(team?.logo_url || '');
  }

  useEffect(() => { loadTeams(); }, []);
  useEffect(() => { if (selectedId) loadTeamData(selectedId); }, [selectedId]);

  async function saveTeamLogo(b64: string) {
    setTeamLogo(b64);
    if (selectedId) {
      await supabase.from('teams').update({ logo_url: b64 }).eq('id', selectedId);
    }
  }

  const team = teams.find((t) => t.id === selectedId);
  const style = analyzeTeamStyle(performances, players);

  const posData = [
    { name: 'GK', value: players.filter((p) => p.position === 'GK').length },
    { name: 'DEF', value: players.filter((p) => p.position === 'DEF').length },
    { name: 'MID', value: players.filter((p) => p.position === 'MID').length },
    { name: 'FWD', value: players.filter((p) => p.position === 'FWD').length },
  ].filter((d) => d.value > 0);

  const statusData = [
    { name: 'Fit', value: players.filter((p) => p.status === 'fit').length },
    { name: 'Injured', value: players.filter((p) => p.status === 'injured').length },
    { name: 'Recovering', value: players.filter((p) => p.status === 'recovering').length },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Profil d'Équipe</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Style de jeu, données collectives et analyse tactique</p>
      </div>

      <div className="card p-4">
        <Select label="Sélectionner l'équipe" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Choisir une équipe…</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.age_group})</option>)}
        </Select>
      </div>

      {selectedId && team && (
        <>
          {/* Team header */}
          <div className="card p-6 gradient-brand-soft">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center text-4xl overflow-hidden border-2" style={{ borderColor: 'var(--border)' }}>
                {teamLogo ? <img src={teamLogo} alt="" className="w-full h-full object-cover" /> : <Shield size={32} className="text-brand-600" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{team.name}</h2>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{team.age_group} · {team.division || 'N/A'}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="brand">{players.length} joueurs</Badge>
                  <Badge variant="success">{performances.length} matchs</Badge>
                </div>
              </div>
              <PhotoUpload label="Logo" onFile={() => {}} onBase64={saveTeamLogo} preview={teamLogo || undefined} onClear={() => saveTeamLogo('')} />
            </div>
          </div>

          {/* Team style */}
          {style && (
            <div className="card p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Target size={18} /> Style de Jeu: <span className="text-brand-600">{style.style}</span>
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{style.styleDesc}</p>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-soft)' }}>
                  <div className="text-2xl font-extrabold text-brand-600">{style.goalsPerMatch}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Buts/match</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-soft)' }}>
                  <div className="text-2xl font-extrabold text-brand-600">{style.avgPassAcc}%</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Précision passes</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-soft)' }}>
                  <div className="text-2xl font-extrabold text-brand-600">{style.tacklesPerMatch}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tacles/match</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-sm text-green-700 mb-2">✅ Points forts</h4>
                  {style.strengths.length === 0 ? <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Données insuffisantes</p> :
                    style.strengths.map((s, i) => <div key={i} className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>• {s}</div>)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-700 mb-2">⚠️ Axes de travail</h4>
                  {style.improvements.length === 0 ? <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>RAS</p> :
                    style.improvements.map((s, i) => <div key={i} className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>• {s}</div>)}
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4"><h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Répartition par poste</h3><PieChart data={posData} colors={['#3b82f6','#22c55e','#f97316','#a855f7']} /></div>
            <div className="card p-4"><h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Statut des joueurs</h3><PieChart data={statusData} colors={['#22c55e','#ef4444','#eab308']} /></div>
          </div>

          {/* Staff recommendations */}
          <div className="card p-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Activity size={18} /> Recommandations pour le Staff
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-soft)' }}>
                <h4 className="font-bold text-sm text-brand-600 mb-2">📋 Thèmes de travail prioritaires</h4>
                <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-primary)' }}>
                  {style?.improvements.map((imp, i) => <li key={i}>• {imp}</li>)}
                  {(!style || style.improvements.length === 0) && <li>• Maintenir les standards actuels</li>}
                  <li>• Organisation défensive sur CPA</li>
                  <li>• Travail de transition offensive</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-soft)' }}>
                <h4 className="font-bold text-sm text-blue-600 mb-2">🗓️ Organisation suggérée</h4>
                <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-primary)' }}>
                  <li>• <strong>Lundi:</strong> Récupération + Vidéo</li>
                  <li>• <strong>Mardi:</strong> Technique individuelle</li>
                  <li>• <strong>Mercredi:</strong> Tactique collective</li>
                  <li>• <strong>Jeudi:</strong> Jeu réduit + Transitions</li>
                  <li>• <strong>Vendredi:</strong> CPA + Mise en place</li>
                  <li>• <strong>Samedi:</strong> Match</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Players list */}
          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Users size={16} /> Effectif ({players.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="gradient-brand-soft">
                  <th className="px-3 py-2 text-left text-xs font-semibold">Joueur</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Poste</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Âge</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Statut</th>
                </tr></thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {players.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-50 dark:hover:bg-slate-700">
                      <td className="px-3 py-2 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xs overflow-hidden">
                          {p.photo_url ? <img src={p.photo_url} alt="" className="w-full h-full object-cover" /> : '⚽'}
                        </div>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.first_name} {p.last_name}</span>
                      </td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{p.position}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{p.age_group}</td>
                      <td className="px-3 py-2"><Badge variant={p.status}>{p.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
