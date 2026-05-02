import { signOut } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

type MissionStatus = 'en_attente' | 'assignée' | 'livrée' | string;

type MissionDoc = {
  id: string;
  missionType?: string;
  providerName?: string;
  siteAddress?: string;
  statut?: MissionStatus;
  timestamp?: unknown;
};

function formatSubmittedAt(ts: unknown): string {
  let d: Date | null = null;
  const anyTs = ts as any;

  if (anyTs?.toDate && typeof anyTs.toDate === 'function') {
    d = anyTs.toDate();
  } else if (typeof anyTs === 'string' || typeof anyTs === 'number') {
    const dd = new Date(anyTs);
    if (!Number.isNaN(dd.getTime())) d = dd;
  }

  if (!d) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function missionTypeLabel(t?: string): string {
  if (t === 'btp') return 'BTP';
  if (t === 'agro') return 'Agro';
  if (t === 'commerce') return 'Commerce';
  return t ? String(t) : '';
}

function statusLabel(s?: MissionStatus): string {
  if (s === 'en_attente') return 'En attente';
  if (s === 'assignée') return 'Assignée';
  if (s === 'livrée') return 'Livrée';
  return s ? String(s) : '';
}

function statusBadgeStyle(s?: MissionStatus): { background: string; color: string } {
  if (s === 'en_attente') return { background: '#FEF3C7', color: '#92400E' };
  if (s === 'assignée') return { background: '#DBEAFE', color: '#1E40AF' };
  if (s === 'livrée') return { background: '#D1FAE5', color: '#065F46' };
  return { background: 'rgba(26,26,26,0.08)', color: '#1A1A1A' };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<MissionDoc[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const q = query(collection(db, 'fiches_mission'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const rows: MissionDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        if (mounted) setMissions(rows);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const counters = useMemo(
    () => [
      { label: 'Total', value: missions.length },
      { label: 'En attente', value: missions.filter((m) => m.statut === 'en_attente').length },
      { label: 'Assignées', value: missions.filter((m) => m.statut === 'assignée').length },
      { label: 'Livrées', value: missions.filter((m) => m.statut === 'livrée').length },
    ],
    [missions]
  );

  async function onLogout() {
    await signOut(auth);
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '68px' }}>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          background: '#1E5FA6',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 50,
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 800 }}>TRASIT Admin</div>
        <button
          type="button"
          onClick={onLogout}
          style={{
            background: '#8B1A1A',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '8px',
            padding: '10px 14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Se déconnecter
        </button>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px 60px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '18px' }}>Tableau de bord</h1>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px' }}>
          {counters.map((c) => (
            <div
              key={c.label}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(26,26,26,0.10)',
                padding: '16px 16px',
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1E5FA6', lineHeight: 1 }}>{c.value}</div>
              <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>{c.label}</div>
            </div>
          ))}
        </section>

        {loading ? (
          <section
            style={{
              marginTop: '22px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid rgba(26,26,26,0.10)',
            }}
          >
            <div style={{ padding: '18px 16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>Chargement des missions...</div>
            </div>
          </section>
        ) : missions.length === 0 ? (
          <section
            style={{
              marginTop: '22px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid rgba(26,26,26,0.10)',
            }}
          >
            <div style={{ padding: '18px 16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>Aucune mission pour le moment</div>
            </div>
          </section>
        ) : (
          <section style={{ marginTop: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '12px' }}>
              {missions.map((m) => {
                const badge = statusBadgeStyle(m.statut);
                return (
                  <div
                    key={m.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(26,26,26,0.10)',
                      padding: '16px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
                        {missionTypeLabel(m.missionType)}
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>
                        {m.providerName || ''}
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>
                        {m.siteAddress || ''}
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>
                        {formatSubmittedAt(m.timestamp)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span
                        style={{
                          background: badge.background,
                          color: badge.color,
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '8px 10px',
                          borderRadius: '999px',
                          lineHeight: 1,
                        }}
                      >
                        {statusLabel(m.statut)}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/fiche/${m.id}`)}
                        style={{
                          background: '#1E5FA6',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          padding: '10px 12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Voir le détail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

