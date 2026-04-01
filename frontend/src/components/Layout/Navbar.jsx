import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, LogOut, Search, Settings, UserCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import api from '../../services/api';

export default function Navbar() {
  const { user, refreshToken, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U';

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch {
      // proceed with logout regardless
    }
    logout();
    navigate('/login');
  };

  const tabs = [
    { label: 'Dashboard', to: '/dashboard?tab=dashboard' },
    { label: 'Profile', to: '/dashboard?tab=profile' },
    { label: 'Settings', to: '/dashboard?tab=settings' },
  ];

  const activeTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-300/90 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center gap-3 px-4 sm:px-6">
        <Link to="/dashboard?tab=dashboard" className="flex items-center gap-3 group pr-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-[1.03]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-zinc-950 sm:block">TaskManager</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-gray-300 bg-zinc-50 p-1 md:flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.to.split('=')[1];
            return (
              <Link
                key={tab.label}
                to={tab.to}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${isActive ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-64 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search profiles..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <Link
            to="/dashboard?tab=profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-zinc-700 hover:bg-zinc-50"
            aria-label="Profile"
          >
            <UserCircle2 className="size-5" />
          </Link>

          <Link
            to="/dashboard?tab=settings"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-zinc-700 hover:bg-zinc-50 sm:flex"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
