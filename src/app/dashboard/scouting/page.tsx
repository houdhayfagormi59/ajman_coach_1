'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Plus, Search, UserCheck, Phone } from 'lucide-react';
import type { Recruitment, AgeGroup } from '@/lib/types';

export default function ScoutingPage() {
  const supabase = createClient();
  const [recruits, setRecruits] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('recruitment')
      .select('*')
      .order('created_at', { ascending: false });
    setRecruits((data ?? []) as Recruitment[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const ageGroups: AgeGroup[] = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19','U20','U21','U22','U23','Senior'];
  const statuses = ['interested', 'contacted', 'trial', 'signed', 'rejected', 'not_interested'] as const;

  const filtered = recruits.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (ageGroupFilter !== 'all' && r.age_group !== ageGroupFilter) return false;
    return true;
  });

  const stats = {
    interested: recruits.filter((r) => r.status === 'interested').length,
    trial: recruits.filter((r) => r.status === 'trial').length,
    signed: recruits.filter((r) => r.status === 'signed').length,
    rejected: recruits.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-800">Scouting & Recruitment</h1>
          <p className="text-sm text-slate-600">Manage future players and recruitment pipeline</p>
        </div>
        <Link href="/dashboard/scouting/new"><Button><Plus size={16} /> Add prospect</Button></Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-4 card-hover"><div className="label">Interested</div><div className="text-3xl font-extrabold text-brand-700">{stats.interested}</div></div>
        <div className="card p-4 card-hover"><div className="label">On Trial</div><div className="text-3xl font-extrabold text-brand-700">{stats.trial}</div></div>
        <div className="card p-4 card-hover"><div className="label">Signed</div><div className="text-3xl font-extrabold text-brand-700">{stats.signed}</div></div>
        <div className="card p-4 card-hover"><div className="label">Rejected</div><div className="text-3xl font-extrabold text-brand-700">{stats.rejected}</div></div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center md:justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <label className="label shrink-0">Filter by status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-base py-1.5"
            >
              <option value="all">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="label shrink-0">Filter by age group</label>
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="input-base py-1.5"
            >
              <option value="all">All age groups</option>
              {ageGroups.map((ag) => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate-500">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <Search size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-slate-500">No prospects match your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link key={r.id} href={`/dashboard/scouting/${r.id}`} className="card p-5 card-hover group">
              <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-xl">
                  {r.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photo_url} alt="" className="w-full h-full object-cover rounded" />
                  ) : '⚽'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 group-hover:text-brand-700 transition">{r.first_name} {r.last_name}</div>
                  <div className="text-xs text-slate-500">{r.age_group} · {r.position}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="brand">{r.status}</Badge>
                {r.age_group && <Badge variant="neutral">{r.age_group}</Badge>}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                {r.club_origin && <div>Club: {r.club_origin}</div>}
                {r.whatsapp_number && (
                  <div className="flex items-center gap-1 text-green-700">
                    <Phone size={12} /> {r.whatsapp_number}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
