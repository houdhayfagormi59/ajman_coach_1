'use client';
import { useRouter } from 'next/navigation';
import { LogOut, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function TopBar({ coachName }: { coachName: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const initials = coachName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-orange-100 px-5 flex items-center justify-between shadow-sm">
      <div>
        <div className="text-sm font-semibold text-slate-800">Welcome back, {coachName} 👋</div>
        <div className="text-xs text-slate-500">Ajman Club · Player Management System</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center">
          <Bell size={17} />
        </button>
        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-glow-orange">
          {initials || 'C'}
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 font-medium"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
