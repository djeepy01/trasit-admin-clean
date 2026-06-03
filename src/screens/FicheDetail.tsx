import React, { useState } from 'react';
import type { Fiche, Agent } from '../types';

const C = {
  sidebar: '#1B3A52',
  bordeaux: '#6B1E2E',
  bg: '#F7F5F2',
  text: '#1A1A1A',
  textSec: '#444444',
  border: '#DDDDDD',
  white: '#ffffff',
};

interface FieldProps { label: string; value: string; }
function Field({ label, value }: FieldProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: C.textSec, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{value}</div>
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: C.bordeaux, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 14, ...style }}>
      {children}
    </div>
  );
}

interface FicheDetailProps { fiche: Fiche; agents: Agent[]; onBack: () => void; }

export default function FicheDetail({ fiche, agents, onBack }: FicheDetailProps) {
  const [selectedAgent, setSelectedAgent] = useState(fiche.assignedAgent ?? '');
  const [avisText, setAvisText] = useState(fiche.avisTransit);
  const detected = fiche.detectedAnimaux ?? 47;
  const declared = fiche.declaredAnimaux ?? 50;
  const ratio = Math.round((detected / declared) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: C.white, borderBottom: `0.5px solid ${C.border}`, padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.bordeaux, fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 500 }}>
          ← Retour aux fiches
        </button>
        <span style={{ color: C.border }}>|</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{fiche.providerName}</span>
        <span style={{ fontSize: 12, color: C.textSec, marginLeft: 'auto' }}>{fiche.id}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Card>
            <CardTitle>Client</CardTitle>
            <Field label="Nom" value={fiche.providerName} />
            <Field label="Email" value={fiche.clientEmail} />
            <Field label="Service" value={fiche.service} />
            <Field label="Type" value={fiche.type} />
            <Field label="Adresse" value={fiche.address} />
            <Field label="Contact site" value={fiche.contactSite} />
          </Card>
          <Card>
            <CardTitle>Assignation agent</CardTitle>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: C.textSec, marginBottom: 4 }}>Agent</div>
              <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ width: '100%', padding: '7px 10px', border: `0.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, background: C.white, cursor: 'pointer', outline: 'none' }}>
                <option value="">— Sélectionner un agent —</option>
                {agents.map((a) => (<option key={a.id} value={a.name}>{a.name} ({a.vertical})</option>))}
              </select>
            </div>
            <button style={{ width: '100%', padding: '8px 0', background: C.sidebar, color: C.white, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}>
              Assigner
            </button>
            {fiche.assignedDate && (<div style={{ fontSize: 11, color: C.textSec, marginBottom: 12 }}>Assigné le {fiche.assignedDate}</div>)}
            <button style={{ width: '100%', padding: '8px 0', background: C.bordeaux, color: C.white, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              ✓ Marquer achevée
            </button>
          </Card>
          <Card>
            <CardTitle>Analyse IA</CardTitle>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.textSec }}>Animaux détectés / déclarés</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{detected} / {declared}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ratio}%`, background: C.bordeaux, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: C.textSec, marginTop: 4 }}>{ratio}% de correspondance</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.textSec }}>Cohérence documents</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>82 / 100</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '82%', background: C.sidebar, borderRadius: 4 }} />
              </div>
            </div>
            <button style={{ width: '100%', padding: '8px 0', background: C.sidebar, color: C.white, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Lancer analyse IA
            </button>
          </Card>
          <Card>
            <CardTitle>Photos terrain</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ background: C.bg, border: `0.5px solid ${C.border}`, borderRadius: 4, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < fiche.photos && (<div style={{ width: '60%', height: '60%', background: C.border, borderRadius: 2, opacity: 0.6 }} />)}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.textSec }}>{fiche.photos} photos · GPS · Horodatées</div>
          </Card>
          <Card style={{ gridColumn: '1 / -1' }}>
            <CardTitle>Avis TRASIT</CardTitle>
            <div style={{ borderLeft: `3px solid ${C.bordeaux}`, background: C.bg, padding: '10px 12px', marginBottom: 14, borderRadius: '0 4px 4px 0' }}>
              <textarea value={avisText} onChange={(e) => setAvisText(e.target.value)} rows={4} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: C.text, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '8px 0', background: C.white, color: C.sidebar, border: `0.5px solid ${C.sidebar}`, borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Modifier</button>
              <button style={{ flex: 1, padding: '8px 0', background: C.sidebar, color: C.white, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Générer via IA</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
