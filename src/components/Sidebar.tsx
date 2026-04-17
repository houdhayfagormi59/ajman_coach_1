'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, BarChart3, Calendar, FileText, Target, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/teams', label: 'Teams', icon: Award },
  { href: '/dashboard/players', label: 'Players', icon: Users },
  { href: '/dashboard/injuries', label: 'Injuries', icon: Activity },
  { href: '/dashboard/performance', label: 'Performance', icon: BarChart3 },
  { href: '/dashboard/sessions', label: 'Training', icon: Calendar },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/scouting', label: 'Scouting', icon: Target },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-orange-100 flex-shrink-0 hidden md:flex flex-col">
      <div className="h-20 px-5 flex items-center border-b border-orange-100 gradient-brand-soft">
        <Logo size={42} withText />
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {nav.map((item) => {
          const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition',
                active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow-orange'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-slate-400 border-t border-orange-100 text-center">
        <div className="font-semibold text-brand-700">Ajman FC Management</div>
        <div>v2.0 · Advanced</div>
      </div>
    </aside>
  );
}
