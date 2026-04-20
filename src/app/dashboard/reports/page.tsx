export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EmptyState from '@/components/EmptyState';
import { FileText, ChevronRight } from 'lucide-react';
import type { Player } from '@/lib/types';

export default async function ReportsIndex() {
  const supabase = createClient();
  const { data } = await supabase.from('players').select('*').order('last_name');
  const players = (data ?? []) as Player[];

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Reports</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generate a professional PDF report for any player</p>
      </div>
      {players.length === 0 ? (
        <div className="card"><EmptyState icon={<FileText size={48} />} title="No players yet" description="Add players first to generate reports." /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => (
            <Link key={p.id} href={`/dashboard/reports/${p.id}`} className="card p-5 card-hover group">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl gradient-brand text-white flex items-center justify-center shadow-glow-orange group-hover:scale-110 transition"><FileText size={18} /></div>
                <div className="flex-1">
                  <div className="font-bold group-hover:text-brand-600 transition" style={{ color: 'var(--text-primary)' }}>{p.first_name} {p.last_name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.age_group || 'N/A'} · {p.position}</div>
                </div>
                <ChevronRight size={16} className="text-brand-500 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
