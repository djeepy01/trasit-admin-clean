import { mockAgents, mockFiches } from '../data/mockData';
import type { FicheStatus } from '../types';

const STATUS_LABELS: FicheStatus[] = ['Nouvelle', 'Assignée', 'Soumise', 'Achevée'];

const STATUS_COLORS: Record<FicheStatus, string> = {
  Nouvelle: '#378ADD',
  Assignée: '#EF9F27',
  Soumise: '#9F7AEA',
  Achevée: '#639922',
};

export default function Statistiques() {
  const statusCounts = STATUS_LABELS.map((status) => ({
    status,
    count: mockFiches.filter((f) => f.status === status).length,
  }));

  const actifs = mockAgents.filter((a) => a.status === 'Actif').length;
  const avgReliability = Math.round(
    mockAgents.reduce((sum, a) => sum + a.scoreReliability, 0) / mockAgents.length
  );

  return (
    <div style={{ flex: 1, background: '#F7F5F2', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderBottom: '0.5px solid #DDDDDD',
          padding: '11px 20px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Statistiques</div>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div
          style={{
            background: '#fff',
            border: '0.5px solid #DDDDDD',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#1B3A52' }}>{mockFiches.length}</div>
          <div style={{ fontSize: '12px', color: '#444444', marginTop: '4px' }}>Fiches totales</div>
        </div>
        <div
          style={{
            background: '#fff',
            border: '0.5px solid #DDDDDD',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#1B3A52' }}>{actifs}</div>
          <div style={{ fontSize: '12px', color: '#444444', marginTop: '4px' }}>Agents actifs</div>
        </div>
        <div
          style={{
            background: '#fff',
            border: '0.5px solid #DDDDDD',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#1B3A52' }}>{avgReliability}%</div>
          <div style={{ fontSize: '12px', color: '#444444', marginTop: '4px' }}>Fiabilité moyenne</div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            background: '#fff',
            border: '0.5px solid #DDDDDD',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', marginBottom: '16px' }}>
            Répartition par statut
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {statusCounts.map(({ status, count }) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: STATUS_COLORS[status],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '13px', color: '#1A1A1A', width: '80px' }}>{status}</span>
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    background: '#F7F5F2',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${mockFiches.length ? (count / mockFiches.length) * 100 : 0}%`,
                      height: '100%',
                      background: STATUS_COLORS[status],
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#444444', width: '24px', textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
