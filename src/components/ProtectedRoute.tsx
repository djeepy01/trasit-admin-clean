import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const ALLOWED_UIDS = new Set([
  'ppuRg7UAB6WEwBT6yhFu0A9mVWB3',
  'rzorfCI5Z8R3ZHmkSyVn4zEZLI03',
]);

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthorized(!!user?.uid && ALLOWED_UIDS.has(user.uid));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          color: '#1A1A1A',
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Chargement…
      </div>
    );
  }

  if (!authorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

