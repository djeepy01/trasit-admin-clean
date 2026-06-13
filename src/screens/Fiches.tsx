import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Fiche, FicheStatus, FicheType } from '../types';

const COUNTERS: { key: FicheStatus; label: string; dot: string }[] = [
  { key: 'Nouvelle', label: 'Nouvelles', dot: '#378ADD' },
  { key: 'Assignée', label: 'Assignées', dot: '#EF9F27' },
  { key: 'Soumise', label: 'Soumises', dot: '#9F7AEA' },
  { key: 'Achevée', label: 'Achevées', dot: '#639922' },
];

const VERTICALS: { key: FicheType; label: string }[] = [
  { key: 'BTP', label: 'BTP' },
  { key: 'AGRO', label: 'Agro' },
  { key: 'COMMERCE', label: 'Commerce' },
];

function statusBadge(status: FicheStatus): { bg: string; color: string } {
  switch (status) {
    case 'Nouvelle':
      return { bg: '#E6F1FB', color: '#185FA5' };
    case 'Assignée':
      return { bg: '#FAEEDA', color: '#854F0B' };
    case 'Soumise':
      return { bg: '#f0e6ff', color: '#5c3d8f' };
    case 'Achevée':
      return { bg: '#EAF3DE', color: '#3B6D11' };
  }
}

type FichesProps = {
  fiches: Fiche[];
  onOpenFiche: (id: string) => void;
};

export default function Fiches({ fiches, onOpenFiche }: FichesProps) {
  const [activeCounter, setActiveCounter] = useState<FicheStatus | null>(null);
  const [activeVertical, setActiveVertical] = useState<FicheType | null>(null);

  const filtered = useMemo(() => {
    return fiches.filter((f) => {
      if (activeCounter && f.status !== activeCounter) return false;
      if (activeVertical && f.type !== activeVertical) return false;
      return true;
    });
  }, [fiches, activeCounter, activeVertical]);

  const subtitle = `${filtered.length} fiche${filtered.length !== 1 ? 's' : ''} affichée${filtered.length !== 1 ? 's' : ''}`;

  return (
    <div style={{ flex: 1, background: '#F7F5F2', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderBottom: '0.5px solid #DDDDDD',
          padding: '11px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>Fiches de mission</div>
        <div style={{ fontSize: '15px', color: '#444444' }}>{subtitle}</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {COUNTERS.map(({ key, label, dot }) => {
            const isActive = activeCounter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCounter(isActive ? null : key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: isActive ? '#1B3A52' : '#fff',
                  color: isActive ? '#fff' : '#1A1A1A',
                  border: isActive ? '0.5px solid #1B3A52' : '0.5px solid #DDDDDD',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: dot,
                    flexShrink: 0,
                  }}
                />
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {VERTICALS.map(({ key, label }) => {
            const isActive = activeVertical === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveVertical(isActive ? null : key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: isActive ? '#1B3A52' : '#fff',
                  color: isActive ? '#fff' : '#444444',
                  border: isActive ? '0.5px solid #1B3A52' : '0.5px solid #DDDDDD',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ fontSize: '16px', color: '#444444', padding: '20px 0' }}>Aucune fiche trouvée</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((f) => {
              const badge = statusBadge(f.status);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onOpenFiche(f.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    background: '#fff',
                    border: '0.5px solid #DDDDDD',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1B3A52',
                      background: '#E6F1FB',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  >
                    {f.type}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#1A1A1A',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.providerName}
                    </div>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#444444',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.address}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      background: badge.bg,
                      color: badge.color,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      flexShrink: 0,
                    }}
                  >
                    {f.status}
                  </span>

                  <ChevronRight size={16} color="#444444" strokeWidth={1.75} style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
