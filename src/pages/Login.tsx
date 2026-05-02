import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError("Identifiants invalides. Vérifie l'email et le mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ color: '#1E5FA6', fontSize: '24px', fontWeight: 700 }}>TRASIT ADMIN</div>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(30,95,166,0.18)',
            borderRadius: '10px',
            padding: '22px 20px',
          }}
        >
          <label style={{ display: 'block', marginBottom: '14px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                fontSize: '16px',
                padding: '12px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26,26,26,0.22)',
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Mot de passe</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                fontSize: '16px',
                padding: '12px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(26,26,26,0.22)',
                outline: 'none',
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#1E5FA6',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 700,
              padding: '12px 14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          {error ? (
            <div style={{ marginTop: '14px', color: '#8B1A1A', fontSize: '16px', fontWeight: 600 }}>{error}</div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

