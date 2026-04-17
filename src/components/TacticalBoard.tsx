'use client';
import { useState } from 'react';

export default function TacticalBoard({ onSave }: { onSave?: (setup: string) => void }) {
  const [formation, setFormation] = useState('4-3-3');
  const [notes, setNotes] = useState('');

  const formations = ['4-3-3', '4-2-3-1', '3-5-2', '5-3-2', '4-4-2', '3-4-3'];

  return (
    <div className="space-y-4">
      <div>
        <label className="label mb-2">Formation</label>
        <div className="grid grid-cols-3 gap-2">
          {formations.map((f) => (
            <button
              key={f}
              onClick={() => setFormation(f)}
              className={`p-2 rounded-lg font-semibold transition ${
                formation === f
                  ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow-orange'
                  : 'bg-white border border-orange-200 text-slate-600 hover:bg-brand-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-orange-300 rounded-xl p-6 bg-green-50 relative aspect-video">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-600">
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-700">{formation}</div>
            <div className="text-xs text-slate-500 mt-1">Tactical Formation</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Tactical Notes</label>
        <textarea
          className="input-base min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the tactical setup, key instructions, positioning..."
        />
      </div>

      {onSave && (
        <button
          onClick={() => onSave(JSON.stringify({ formation, notes }))}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700"
        >
          Save Tactical Setup
        </button>
      )}
    </div>
  );
}
