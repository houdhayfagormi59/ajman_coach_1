export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import SessionForm from '@/components/SessionForm';
import type { Player, Team } from '@/lib/types';

export default async function NewSessionPage() {
  const supabase = createClient();
  const [pR, tR] = await Promise.all([
    supabase.from('players').select('*').order('last_name'),
    supabase.from('teams').select('*').order('name'),
  ]);

  return (
    <div className="max-w-4xl animate-fade-in-up">
      <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>New Training Session</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Plan a session with tactical boards and player lineup</p>
      <div className="card p-6">
        <SessionForm players={(pR.data ?? []) as Player[]} teams={(tR.data ?? []) as Team[]} />
      </div>
    </div>
  );
}
