import { useState } from 'react';
import { CalendarDays, MapPin, PenLine, Phone, Trash2 } from 'lucide-react';

const getAvatarColor = (name) => {
  const colors = [
    'bg-gradient-to-br from-orange-500 to-amber-300 text-amber-950',
    'bg-gradient-to-br from-yellow-300 to-orange-400 text-amber-950',
    'bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950',
    'bg-gradient-to-br from-orange-400 to-yellow-200 text-amber-950',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const formatDate = (dob) => {
  if (!dob) return '—';
  try {
    return new Date(dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dob;
  }
};

export default function ProfileCard({ profile, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await onDelete(profile.id);
    setDeleting(false);
    setConfirmDelete(false);
  };

  const avatarGradient = getAvatarColor(profile.name);

  return (
    <div className="rounded-2xl p-6 border border-orange-200 bg-white/90 hover:border-orange-300 hover:shadow-[0_16px_32px_rgba(249,115,22,0.14)] transition-all duration-300 group animate-fade-in flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`avatar w-12 h-12 text-base ${avatarGradient} flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-950 truncate">{profile.name}</h3>
            <p className="text-xs text-zinc-600 truncate">{profile.email}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(profile)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            title="Edit profile"
          >
            <PenLine className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${confirmDelete
              ? 'text-white bg-red-500/20 hover:bg-red-500/40 border border-red-500/30'
              : 'text-zinc-600 hover:text-red-500 hover:bg-red-50'
              }`}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete profile'}
          >
            {deleting ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      {/* Details */}
      <div className="space-y-2.5 text-sm">
        {profile.phone && (
          <div className="flex items-center gap-2.5 text-zinc-700">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-200 flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className="truncate">{profile.phone}</span>
          </div>
        )}
        {profile.address && (
          <div className="flex items-start gap-2.5 text-zinc-700">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-200 flex-shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className="line-clamp-2">{profile.address}</span>
          </div>
        )}
        {profile.dob && (
          <div className="flex items-center gap-2.5 text-zinc-700">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-200 flex-shrink-0">
              <CalendarDays className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span>{formatDate(profile.dob)}</span>
          </div>
        )}
      </div>

      {/* Confirm delete warning */}
      {confirmDelete && !deleting && (
        <div className="mt-1 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center animate-fade-in">
          Click the delete button again to confirm
          <button onClick={() => setConfirmDelete(false)} className="ml-2 underline hover:no-underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
