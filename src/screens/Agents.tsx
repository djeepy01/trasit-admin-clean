import { mockAgents } from '../data/mockData';

export default function Agents() {
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
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Agents</div>
        <div style={{ fontSize: '12px', color: '#444444' }}>
          {mockAgents.length} agent{mockAgents.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mockAgents.map((agent) => {
            const isActif = agent.status === 'Actif';
            return (
              <div
                key={agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 16px',
                  background: '#fff',
                  border: '0.5px solid #DDDDDD',
                  borderRadius: '8px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A' }}>{agent.name}</div>
                  <div style={{ fontSize: '12px', color: '#444444', marginTop: '2px' }}>
                    {agent.code} · {agent.vertical}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#444444', textAlign: 'right' }}>
                  <div>{agent.missions} missions</div>
                  <div>Fiabilité {agent.scoreReliability}%</div>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: isActif ? '#EAF3DE' : '#F7F5F2',
                    color: isActif ? '#3B6D11' : '#444444',
                    flexShrink: 0,
                  }}
                >
                  {agent.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
