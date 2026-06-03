import React from 'react';

const C = {
  sidebar: '#1B3A52',
  bordeaux: '#6B1E2E',
  bg: '#F7F5F2',
  text: '#1A1A1A',
  textSec: '#444444',
  border: '#DDDDDD',
  white: '#ffffff',
};

interface BarRowProps { label: string; value: number; max: number; display: string; fillColor?: string; }
function BarRow({ label, value, max, display, fillColor = C.sidebar }: BarRowProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: C.textSec, width: 70, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fillColor, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: C.text, minWidth: 28, textAlign: 'right' }}>{display}</span>
    </div>
  );
}

function StatCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 14, ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: C.textSec, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function BigNumber({ value, unit }: { value: string | number; unit?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
      <span style={{ fontSize: 32, fontWeight: 600, color: C.text, lineHeight: 1 }}>{value}</span>
      {unit && <span style={{ fontSize: 12, color: C.textSec, fontWeight: 400 }}>{unit}</span>}
    </div>
  );
}

export default function Statistiques() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: C.white, borderBottom: `0.5px solid ${C.border}`, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Statistiques</span>
        <span style={{ fontSize: 12, color: C.textSec }}>Juin 2026</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <StatCard>
            <CardTitle>Total missions</CardTitle>
            <BigNumber value={84} unit="missions" />
            <BarRow label="BTP" value={32} max={84} display="32" />
            <BarRow label="Agro" value={28} max={84} display="28" />
            <BarRow label="Commerce" value={24} max={84} display="24" />
          </StatCard>
          <StatCard>
            <CardTitle>Missions achevées</CardTitle>
            <BigNumber value={61} unit="achevées" />
            <BarRow label="Achevées" value={61} max={84} display="73%" fillColor="#639922" />
            <BarRow label="Soumises" value={11} max={84} display="13%" fillColor="#9F7AEA" />
            <BarRow label="Assignées" value={8} max={84} display="10%" fillColor="#EF9F27" />
            <BarRow label="Nouvelles" value={4} max={84} display="4%" fillColor="#378ADD" />
          </StatCard>
          <StatCard>
            <CardTitle>Agents actifs</CardTitle>
            <BigNumber value={8} unit="agents" />
            <BarRow label="BTP" value={3} max={8} display="3" />
            <BarRow label="Agro" value={3} max={8} display="3" />
            <BarRow label="Commerce" value={2} max={8} display="2" />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: C.textSec }}>Score moyen fiabilité</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>86%</div>
            </div>
          </StatCard>
          <StatCard>
            <CardTitle>Revenus FCFA du mois</CardTitle>
            <BigNumber value="4 200 000" unit="FCFA" />
            <BarRow label="Ponctuel" value={1200000} max={4200000} display="1,2M" fillColor={C.bordeaux} />
            <BarRow label="Renforcé" value={1800000} max={4200000} display="1,8M" fillColor={C.bordeaux} />
            <BarRow label="Suivi" value={1200000} max={4200000} display="1,2M" fillColor={C.bordeaux} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: C.textSec }}>vs. mois précédent</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#3B6D11' }}>+18%</div>
            </div>
          </StatCard>
        </div>
      </div>
    </div>
  );
}
