'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Badge from '@/components/Badge';
import { Brain, Zap, TrendingUp, AlertTriangle, Star, Target, Activity } from 'lucide-react';
import type { Player, Performance, Injury } from '@/lib/types';

function passAcc(c: number, a: number) { return a ? Math.round((c / a) * 100) : 0; }
function avg(nums: number[]) { return nums.length ? +(nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : 0; }

interface AIReport {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  formSummary: string;
  injuryRisk: 'low' | 'medium' | 'high';
  potentialRating: number;
  tacticalFit: string;
  comparisonNote: string;
}

function analyzePlayer(player: Player, performances: Performance[], injuries: Injury[]): AIReport {
  const goals = performances.reduce((s, p) => s + p.goals, 0);
  const assists = performances.reduce((s, p) => s + p.assists, 0);
  const totalShots = performances.reduce((s, p) => s + p.shots, 0);
  const onTarget = performances.reduce((s, p) => s + p.shots_on_target, 0);
  const passComp = performances.reduce((s, p) => s + p.passes_completed, 0);
  const passAtt = performances.reduce((s, p) => s + p.passes_attempted, 0);
  const tackles = performances.reduce((s, p) => s + p.tackles, 0);
  const ratings = performances.map((p) => p.rating).filter((r): r is number => r !== null);
  const avgRating = avg(ratings);
  const pa = passAcc(passComp, passAtt);
  const shotAcc = totalShots ? Math.round((onTarget / totalShots) * 100) : 0;
  const gpm = performances.length ? +(goals / performances.length).toFixed(2) : 0;
  const apm = performances.length ? +(assists / performances.length).toFixed(2) : 0;

  const activeInjuries = injuries.filter((i) => i.status === 'active').length;
  const totalInjuries = injuries.length;
  const severeInjuries = injuries.filter((i) => i.severity === 'severe').length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Strengths
  if (pa >= 80) strengths.push(`Excellent passing accuracy (${pa}%)`);
  if (gpm >= 0.5 && (player.position === 'FWD' || player.position === 'MID')) strengths.push(`Strong goal contribution (${gpm} goals/match)`);
  if (apm >= 0.3) strengths.push(`Creative playmaker (${apm} assists/match)`);
  if (shotAcc >= 50 && totalShots > 5) strengths.push(`Clinical finisher (${shotAcc}% shot accuracy)`);
  if (tackles > performances.length * 3 && (player.position === 'DEF' || player.position === 'MID')) strengths.push(`Solid defensive contribution (${(tackles / (performances.length || 1)).toFixed(1)} tackles/match)`);
  if (avgRating >= 7.5) strengths.push(`Consistently high rated (avg ${avgRating})`);
  if (player.status === 'fit' && activeInjuries === 0) strengths.push('Good physical condition — injury free');
  if (performances.length >= 10 && ratings.length >= 10) {
    const last5 = ratings.slice(0, 5);
    const prev5 = ratings.slice(5, 10);
    if (avg(last5) > avg(prev5) + 0.3) strengths.push('Improving form trend ↑');
  }

  // Weaknesses
  if (pa < 65 && passAtt > 50) weaknesses.push(`Passing needs work (${pa}% accuracy)`);
  if (player.position === 'FWD' && gpm < 0.2 && performances.length > 5) weaknesses.push(`Low goal output for a forward (${gpm}/match)`);
  if (shotAcc < 30 && totalShots > 10) weaknesses.push(`Shot accuracy below standard (${shotAcc}%)`);
  if (avgRating < 5.5 && ratings.length > 3) weaknesses.push(`Below-average match ratings (${avgRating})`);
  if (totalInjuries >= 3) weaknesses.push(`Injury-prone (${totalInjuries} injuries recorded)`);
  if (performances.length >= 6) {
    const last3 = ratings.slice(0, 3);
    const prev3 = ratings.slice(3, 6);
    if (last3.length === 3 && prev3.length === 3 && avg(last3) < avg(prev3) - 0.5) weaknesses.push('Declining form trend ↓');
  }

  // Recommendations
  if (pa < 70) recommendations.push('Focus on passing drills — short & long range accuracy');
  if (player.position === 'FWD' && gpm < 0.3) recommendations.push('Work on finishing exercises — placement and power');
  if (shotAcc < 40) recommendations.push('Shooting sessions — target practice and composure in front of goal');
  if (tackles < performances.length * 2 && player.position === 'DEF') recommendations.push('Defensive drills — 1v1 tackling and positioning');
  if (totalInjuries >= 2) recommendations.push('Injury prevention program — flexibility and strength conditioning');
  if (avgRating < 6) recommendations.push('Individual mentoring sessions to build confidence');
  if (strengths.length === 0 && performances.length < 5) recommendations.push('More match time needed to properly evaluate');
  recommendations.push(`Set ${player.position === 'GK' ? 'clean sheet' : player.position === 'FWD' ? 'goal-scoring' : player.position === 'DEF' ? 'defensive' : 'creative'} targets for next 5 matches`);

  // Form summary
  let formSummary = '';
  if (performances.length === 0) formSummary = 'No match data available yet. Player needs game time for proper analysis.';
  else if (avgRating >= 7.5) formSummary = `${player.first_name} is in excellent form with an average rating of ${avgRating}. ${goals} goals and ${assists} assists in ${performances.length} matches show consistent high-level performance.`;
  else if (avgRating >= 6) formSummary = `${player.first_name} is performing at a solid level (${avgRating} avg). Shows promise but has room for improvement in key areas.`;
  else formSummary = `${player.first_name} is currently underperforming (${avgRating} avg). Needs focused development and possibly adjusted tactical role.`;

  // Injury risk
  let injuryRisk: 'low' | 'medium' | 'high' = 'low';
  if (severeInjuries >= 2 || totalInjuries >= 4) injuryRisk = 'high';
  else if (totalInjuries >= 2 || activeInjuries > 0) injuryRisk = 'medium';

  // Potential rating
  let potentialRating = Math.min(10, avgRating + (player.status === 'fit' ? 1.5 : 0.5));
  if (strengths.length >= 3) potentialRating = Math.min(10, potentialRating + 0.5);
  potentialRating = +potentialRating.toFixed(1);

  // Tactical fit
  const tacticalFit = player.position === 'GK' ? 'Shot-stopping goalkeeper suited for possession-based systems'
    : player.position === 'DEF' ? (tackles > performances.length * 3 ? 'Ball-winning defender suited for high-press systems' : 'Ball-playing defender for build-up play')
    : player.position === 'MID' ? (apm > 0.3 ? 'Creative midfielder — ideal as a #10 or advanced playmaker' : 'Box-to-box midfielder — work-rate and tactical discipline')
    : (gpm > 0.5 ? 'Clinical striker — suits lone-striker formations' : 'Supporting forward — better in a two-striker system');

  const comparisonNote = performances.length >= 5
    ? `Based on ${performances.length} matches: G/A ratio is ${goals}/${assists}, pass accuracy ${pa}%, shot accuracy ${shotAcc}%`
    : 'Insufficient data for detailed comparison — needs more match time';

  const overallScore = performances.length > 0 ? +Math.min(10, Math.max(1, avgRating + (strengths.length - weaknesses.length) * 0.3)).toFixed(1) : 0;

  return { overallScore, strengths, weaknesses, recommendations, formSummary, injuryRisk, potentialRating, tacticalFit, comparisonNote };
}

export default function AIAnalyzerPage() {
  const supabase = createClient();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('players').select('*').order('last_name');
      setPlayers((data ?? []) as Player[]);
      setLoading(false);
    })();
  }, []);

  async function analyze() {
    if (!selectedId) return;
    setAnalyzing(true);
    const player = players.find((p) => p.id === selectedId)!;
    const [perfR, injR] = await Promise.all([
      supabase.from('performances').select('*').eq('player_id', selectedId).order('match_date', { ascending: false }),
      supabase.from('injuries').select('*').eq('player_id', selectedId),
    ]);
    const r = analyzePlayer(player, (perfR.data ?? []) as Performance[], (injR.data ?? []) as Injury[]);
    setReport(r);
    setAnalyzing(false);
  }

  const player = players.find((p) => p.id === selectedId);
  const riskColors = { low: 'text-green-600', medium: 'text-yellow-600', high: 'text-red-600' };
  const riskBg = { low: 'bg-green-100', medium: 'bg-yellow-100', high: 'bg-red-100' };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center"><Brain size={20} /></div>
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>AI Football Analyzer</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Smart performance analysis, tactical insights & development recommendations</p>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Select label="Select Player" value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setReport(null); }}>
              <option value="">Choose a player…</option>
              {players.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.position} ({p.age_group || 'N/A'})</option>)}
            </Select>
          </div>
          <Button onClick={analyze} disabled={!selectedId} loading={analyzing}>
            <Zap size={16} /> Analyze
          </Button>
        </div>
      </div>

      {report && player && (
        <div className="space-y-4">
          {/* Header */}
          <div className="card p-5 gradient-brand-soft">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center text-3xl overflow-hidden border-2" style={{ borderColor: 'var(--border)' }}>
                {player.photo_url ? <img src={player.photo_url} alt="" className="w-full h-full object-cover" /> : '⚽'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{player.first_name} {player.last_name}</h2>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{player.position} · {player.age_group || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-brand-600">{report.overallScore}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>AI Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-purple-600">{report.potentialRating}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Potential</div>
              </div>
            </div>
          </div>

          {/* Form Summary */}
          <div className="card p-5">
            <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}><TrendingUp size={16} /> Form Analysis</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{report.formSummary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="card p-5">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-green-700"><Star size={16} /> Strengths</h3>
              {report.strengths.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Not enough data to identify strengths</p> : (
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-0.5">✓</span><span style={{ color: 'var(--text-primary)' }}>{s}</span></li>
                  ))}
                </ul>
              )}
            </div>

            {/* Weaknesses */}
            <div className="card p-5">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-red-700"><AlertTriangle size={16} /> Areas to Improve</h3>
              {report.weaknesses.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No significant weaknesses detected</p> : (
                <ul className="space-y-2">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-500 mt-0.5">✗</span><span style={{ color: 'var(--text-primary)' }}>{w}</span></li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-5">
            <h3 className="font-bold flex items-center gap-2 mb-3" style={{ color: 'var(--text-primary)' }}><Target size={16} /> Development Recommendations</h3>
            <ul className="space-y-2">
              {report.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full gradient-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Injury Risk */}
            <div className="card p-5">
              <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}><Activity size={16} /> Injury Risk</h3>
              <div className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${riskBg[report.injuryRisk]} ${riskColors[report.injuryRisk]}`}>
                {report.injuryRisk.toUpperCase()}
              </div>
            </div>

            {/* Tactical Fit */}
            <div className="card p-5 md:col-span-2">
              <h3 className="font-bold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}><Brain size={16} /> Tactical Analysis</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{report.tacticalFit}</p>
              <p className="text-xs mt-2 opacity-75" style={{ color: 'var(--text-secondary)' }}>{report.comparisonNote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
