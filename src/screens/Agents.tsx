import type { Agent } from '../types';

const C = {
  sidebar: '#1B3A52',
  bordeaux: '#6B1E2E',
  bg: '#F7F5F2',
  text: '#1A1A1A',
  textSec: '#444444',
  border: '#DDDDDD',
  white: '#ffffff',
};

interface AgentsProps { agents: Agent[]; }

const verticalColors: Record<string, { bg: string; color: string }> = {
  Agro: { bg: '#EAF3DE', color: '#3B6D11' },
  Commerce: { bg: '#FEF3E2', color: '#854F0B' },
  BTP: { bg: '#E6EEF5', color: '#1B3A52' },
};

export default function Agents({ agents }: AgentsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: C.white, borderBottom: `0.5px solid ${C.border}`, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Agents</span>
          <span style={{ fontSize: 12, color: C.textSec, marginLeft: 10 }}>{agents.length} agents enregistrés</span>
        </div>
        <button style={{ padding: '7px 14px', background: C.sidebar, color: C.white, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          + Ajouter un agent
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 140px 80px', padding: '10px 16px', borderBottom: `0.5px solid ${C.border}`, background: C.bg }}>
            {['Agent', 'Vertical', 'Missions', 'Score fiabilité', 'Statut'].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 500, color: C.textSec }}>{h}</div>
            ))}
          </div>
          {agents.map((agent, idx) => {
            const isLast = idx === agents.length - 1;
            const vColor = verticalColors[agent.vertical] ?? { bg: C.bg, color: C.textSec };
            return (
              <div key={agent.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 140px 80px', padding: '12px 16px', borderBottom: isLast ? 'none' : `0.5px solid ${C.border}`, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: C.textSec, marginTop: 1 }}>{agent.code}</div>
                </div>
                <div>
                  <span style={{ padding: '3px 8px', background: vColor.bg, color: vColor.color, borderRadius: 4, fontSize: 11, fontWeight: 500 }}>{agent.vertical}</span>
                </div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{agent.missions}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${agent.scoreReliability}%`, background: C.bordeaux, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.text, fontWeight: 500, minWidth: 32 }}>{agent.scoreReliability}%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: agent.status === 'Actif' ? '#639922' : '#AAAAAA', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: agent.status === 'Actif' ? '#3B6D11' : C.textSec }}>{agent.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
