import { Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function ProtectedRoute({ children }) {
  const accessToken = useStore((state) => state.accessToken);
  const hasHydrated = useStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    );
  }

  return accessToken ? children : <Navigate to="/login" replace />;
}
