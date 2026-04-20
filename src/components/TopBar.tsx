'use client';
import { useRouter } from 'next/navigation';
import { LogOut, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function TopBar({ coachName }: { coachName: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login'); router.refresh();
  }

  const initials = coachName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="h-14 card rounded-none border-x-0 border-t-0 px-4 md:px-6 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
      <div className="pl-10 md:pl-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome, {coachName}</div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ajman Club · Pro</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs shadow-glow-orange">{initials || 'C'}</div>
        <button onClick={signOut} className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-700 font-medium"
          style={{ color: 'var(--text-secondary)' }}>
          <LogOut size={14} /><span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
