'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import RecruitmentForm from '@/components/RecruitmentForm';
import Modal from '@/components/Modal';
import { Pencil, Trash2, ChevronLeft, Phone } from 'lucide-react';
import type { Recruitment } from '@/lib/types';

export default function ScoutingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const router = useRouter();
  const [recruit, setRecruit] = useState<Recruitment | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('recruitment')
      .select('*')
      .eq('id', params.id)
      .single();
    setRecruit(data as Recruitment);
    setLoading(false);
  }

  useEffect(() => { load(); }, [params.id]);

  async function deleteRecruit() {
    if (!confirm('Delete this prospect?')) return;
    await fetch(`/api/recruitment/${params.id}`, { method: 'DELETE' });
    router.push('/dashboard/scouting');
    router.refresh();
  }

  if (loading) return <div className="card p-8 text-center">Loading…</div>;
  if (!recruit) return <div className="card p-8 text-center">Prospect not found</div>;

  return (
    <div className="space-y-5 max-w-4xl animate-fade-in-up">
      <Link href="/dashboard/scouting" className="inline-flex items-center gap-1 text-sm text-brand-600 font-semibold hover:underline">
        <ChevronLeft size={16} /> Back to scouting
      </Link>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-5 md:items-start md:justify-between">
          <div className="flex gap-5 items-start">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-300 flex items-center justify-center text-5xl overflow-hidden shadow-glow-orange border-2 border-brand-200">
              {recruit.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={recruit.photo_url} alt="" className="w-full h-full object-cover" />
              ) : '⚽'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-brand-800">{recruit.first_name} {recruit.last_name}</h1>
              <div className="text-sm text-slate-600 mt-2 space-y-1">
                <div>{recruit.age_group} · {recruit.position}</div>
                <div>Club: {recruit.club_origin || '—'}</div>
                {recruit.email && <div>Email: {recruit.email}</div>}
                {recruit.phone_number && <div>Phone: {recruit.phone_number}</div>}
                {recruit.whatsapp_number && (
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <Phone size={14} /> WhatsApp: {recruit.whatsapp_number}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="brand">{recruit.status}</Badge>
                {recruit.age_group && <Badge variant="neutral">{recruit.age_group}</Badge>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => setEditModal(true)}><Pencil size={15} /> Edit</Button>
            <Button variant="danger" onClick={deleteRecruit}><Trash2 size={15} /> Delete</Button>
          </div>
        </div>
      </div>

      {recruit.notes && (
        <section className="card p-6">
          <h2 className="font-bold text-brand-800 text-lg mb-3">Scout notes</h2>
          <p className="text-slate-700 whitespace-pre-line">{recruit.notes}</p>
        </section>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {recruit.contacted_date && (
          <div className="card p-4 card-hover">
            <div className="label">Contacted</div>
            <div className="text-lg font-bold text-brand-700 mt-1">{recruit.contacted_date}</div>
          </div>
        )}
        {recruit.trial_date && (
          <div className="card p-4 card-hover">
            <div className="label">Trial scheduled</div>
            <div className="text-lg font-bold text-brand-700 mt-1">{recruit.trial_date}</div>
          </div>
        )}
        <div className="card p-4 card-hover">
          <div className="label">Status</div>
          <div className="text-lg font-bold text-brand-700 mt-1 capitalize">{recruit.status}</div>
        </div>
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit prospect">
        <RecruitmentForm initial={recruit} />
      </Modal>
    </div>
  );
}
