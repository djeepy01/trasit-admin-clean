import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';

type MissionStatus = 'en_attente' | 'assignée' | 'livrée' | string;

type MissionDoc = {
  missionType?: string;
  providerName?: string;
  providerRegistration?: string;
  providerOther?: string;
  siteAddress?: string;
  siteDistrict?: string;
  siteLandmarks?: string;
  statut?: MissionStatus;
  timestamp?: unknown;
  serviceLevel?: string;
  onSiteContactName?: string;
  onSiteContactPhone?: string;
  frequency?: string;
  nom?: string;
  code?: string;
  telephoneAgent?: string;
  dateAssignation?: unknown;
  /** Si présent sur la fiche : ID du document `missions` lié. */
  missionId?: string;
  linkedMissionId?: string;
  [key: string]: unknown;
};

type ActiveAgent = { code: string; nom: string };

function formatDateOnly(ts: unknown): string {
  let d: Date | null = null;
  const anyTs = ts as any;
  if (anyTs?.toDate && typeof anyTs.toDate === 'function') d = anyTs.toDate();
  if (!d && (typeof anyTs === 'string' || typeof anyTs === 'number')) {
    const dd = new Date(anyTs);
    if (!Number.isNaN(dd.getTime())) d = dd;
  }
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

type MissionPhotoEntry = { zoneKey: string; zoneLabel: string; url: string };

async function resolveMissionDocumentId(
  ficheDocId: string,
  ficheData: MissionDoc | null
): Promise<string | null> {
  if (!ficheDocId) return null;

  const fromFiche =
    (typeof ficheData?.missionId === 'string' && ficheData.missionId.trim()) ||
    (typeof ficheData?.linkedMissionId === 'string' && ficheData.linkedMissionId.trim());
  if (fromFiche) {
    const snap = await getDoc(doc(db, 'missions', fromFiche.trim()));
    if (snap.exists()) return snap.id;
  }

  const direct = await getDoc(doc(db, 'missions', ficheDocId));
  if (direct.exists()) return direct.id;

  const linkFields = ['ficheId', 'ficheMissionId', 'fichesMissionId', 'sourceFicheId', 'adminFicheId'];
  for (const field of linkFields) {
    const q = query(collection(db, 'missions'), where(field, '==', ficheDocId), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].id;
  }

  return null;
}

function formatZoneLabelFromKey(key: string): string {
  const s = key.replace(/_/g, ' ').trim();
  if (!s) return key;
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(ts: unknown): string {
  let d: Date | null = null;
  const anyTs = ts as any;
  if (anyTs?.toDate && typeof anyTs.toDate === 'function') d = anyTs.toDate();
  if (!d && (typeof anyTs === 'string' || typeof anyTs === 'number')) {
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

function fieldLabel(key: string): string {
  const map: Record<string, string> = {
    serviceLevel: 'Niveau de service',
    providerName: 'Nom du prestataire',
    missionType: 'Type de mission',
    siteAddress: 'Adresse',
    siteDistrict: 'Quartier',
    onSiteContactName: 'Contact sur place (nom)',
    onSiteContactPhone: 'Contact sur place (téléphone)',
    registrationNumber: 'Immatriculation',
    providerRegistration: 'Immatriculation',
    siteLandmarks: 'Repères',
    frequency: 'Fréquence',
    status: 'Statut',
    statut: 'Statut',
    timestamp: 'Date de soumission',
  };
  return map[key] || key;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '1px solid rgba(26,26,26,0.10)',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', marginBottom: '14px' }}>{title}</div>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '14px', marginBottom: '10px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>{label}</div>
      <div
        style={{
          fontSize: strong ? '20px' : '20px',
          fontWeight: strong ? 700 : 500,
          color: '#1A1A1A',
          minWidth: 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function FicheDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [docData, setDocData] = useState<MissionDoc | null>(null);
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [missionPhotosLoading, setMissionPhotosLoading] = useState(false);
  const [missionPhotoEntries, setMissionPhotoEntries] = useState<MissionPhotoEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const ref = doc(db, 'fiches_mission', id);
        const snap = await getDoc(ref);
        if (!mounted) return;
        setDocData(snap.exists() ? (snap.data() as MissionDoc) : null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadMissionPhotos() {
      if (!id || !docData) {
        setMissionPhotoEntries([]);
        return;
      }

      setMissionPhotosLoading(true);
      try {
        const missionDocId = await resolveMissionDocumentId(id, docData);
        if (cancelled) return;

        if (!missionDocId) {
          setMissionPhotoEntries([]);
          return;
        }

        const missionSnap = await getDoc(doc(db, 'missions', missionDocId));
        if (cancelled) return;

        if (!missionSnap.exists()) {
          setMissionPhotoEntries([]);
          return;
        }

        const raw = missionSnap.data()?.photos as unknown;
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
          setMissionPhotoEntries([]);
          return;
        }

        const entries: MissionPhotoEntry[] = Object.entries(raw as Record<string, unknown>)
          .filter(([, v]) => typeof v === 'string' && (v as string).trim() !== '')
          .map(([zoneKey, v]) => ({
            zoneKey,
            zoneLabel: formatZoneLabelFromKey(zoneKey),
            url: String(v).trim(),
          }));

        setMissionPhotoEntries(entries);
      } finally {
        if (!cancelled) setMissionPhotosLoading(false);
      }
    }

    loadMissionPhotos();
    return () => {
      cancelled = true;
    };
  }, [id, docData]);

  useEffect(() => {
    let mounted = true;
    async function loadActiveAgents() {
      setAgentsLoading(true);
      try {
        const q = query(collection(db, 'agents'), where('statut', '==', 'actif'));
        const snap = await getDocs(q);
        const list: ActiveAgent[] = snap.docs
          .map((d) => d.data() as any)
          .map((a) => ({
            code: String(a.code || '').trim(),
            nom: String(a.nom || '').trim(),
          }))
          .filter((a) => a.code && a.nom);
        if (mounted) setActiveAgents(list);
      } finally {
        if (mounted) setAgentsLoading(false);
      }
    }
    loadActiveAgents();
    return () => {
      mounted = false;
    };
  }, []);

  const alreadyAssigned = !!docData?.nom && !!docData?.code;

  const descriptionEntries = useMemo(() => {
    if (!docData) return [];
    const keysToSkip = new Set([
      'timestamp',
      'statut',
      'nom',
      'code',
      'telephoneAgent',
      'dateAssignation',
    ]);
    const entries = Object.entries(docData)
      .filter(([k, v]) => !keysToSkip.has(k) && v !== undefined && v !== null && String(v).trim() !== '')
      .map(([k, v]) => ({ k, v }));
    return entries;
  }, [docData]);

  async function onAssign() {
    if (!id || !selectedAgent) return;
    const found = activeAgents.find((a) => a.code === selectedAgent);
    if (!found) return;
    setAssigning(true);
    setAssignSuccess(false);
    try {
      await updateDoc(doc(db, 'fiches_mission', id), {
        statut: 'assignée',
        nom: found.nom,
        code: found.code,
        dateAssignation: serverTimestamp(),
      });
      setDocData((prev) =>
        prev
          ? {
              ...prev,
              statut: 'assignée',
              nom: found.nom,
              code: found.code,
              dateAssignation: new Date().toISOString(),
            }
          : prev
      );
      setAssignSuccess(true);
      window.setTimeout(() => setAssignSuccess(false), 4000);
    } finally {
      setAssigning(false);
    }
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
        <div style={{ fontSize: '20px', fontWeight: 800 }}>TRASIT Admin</div>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: '#1A1A1A',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 700,
            borderRadius: '8px',
            padding: '10px 14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ← Retour
        </button>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {loading ? (
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>Chargement des détails...</div>
        ) : !docData ? (
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>Fiche introuvable</div>
        ) : (
          <>
            <Card title="Informations générales">
              <Row label="Type de mission" value={missionTypeLabel(docData.missionType)} strong />
              <Row label="Date de soumission" value={formatDate(docData.timestamp)} />
              <Row
                label="Statut"
                value={
                  <span
                    style={{
                      background: statusBadgeStyle(docData.statut).background,
                      color: statusBadgeStyle(docData.statut).color,
                      fontSize: '20px',
                      fontWeight: 700,
                      padding: '8px 10px',
                      borderRadius: '999px',
                      lineHeight: 1,
                      display: 'inline-block',
                    }}
                  >
                    {statusLabel(docData.statut)}
                  </span>
                }
              />
              <Row label="Niveau de service" value={docData.serviceLevel ? String(docData.serviceLevel) : ''} />
            </Card>

            <Card title="Prestataire">
              <Row label="Nom du prestataire" value={docData.providerName ? String(docData.providerName) : ''} />
              {docData.providerRegistration ? (
                <Row label="Immatriculation" value={String(docData.providerRegistration)} />
              ) : null}
            </Card>

            <Card title="Localisation">
              <Row label="Adresse" value={docData.siteAddress ? String(docData.siteAddress) : ''} />
              <Row label="Quartier" value={docData.siteDistrict ? String(docData.siteDistrict) : ''} />
              {docData.siteLandmarks ? <Row label="Repères" value={String(docData.siteLandmarks)} /> : null}
            </Card>

            <Card title="Contact sur place">
              <Row label="Contact sur place (nom)" value={docData.onSiteContactName ? String(docData.onSiteContactName) : ''} />
              <Row
                label="Contact sur place (téléphone)"
                value={docData.onSiteContactPhone ? String(docData.onSiteContactPhone) : ''}
              />
            </Card>

            <Card title="Description mission">
              {descriptionEntries.length === 0 ? (
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}>Aucun champ supplémentaire.</div>
              ) : (
                <div>
                  {descriptionEntries.map((e) => (
                    <Row key={e.k} label={fieldLabel(e.k)} value={String(e.v)} />
                  ))}
                </div>
              )}
            </Card>

            <Card title="Assignation agent">
              <div
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 24,
                  marginTop: 24,
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 }}>Assignation agent</h3>
                {alreadyAssigned && (
                  <p style={{ fontSize: 16, color: '#1a1a1a', marginBottom: 12, fontWeight: 700 }}>
                    Agent actuel : {docData?.code} — {docData?.nom}
                    {docData?.dateAssignation ? ` — assigné le ${formatDateOnly(docData.dateAssignation)}` : ''}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    disabled={agentsLoading || activeAgents.length === 0}
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 16,
                      color: '#1a1a1a',
                      backgroundColor: 'white',
                      outline: 'none',
                    }}
                  >
                    <option value="">
                      {agentsLoading
                        ? 'Chargement...'
                        : activeAgents.length === 0
                          ? 'Aucun agent disponible'
                          : 'Sélectionner un agent'}
                    </option>
                    {activeAgents.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.code} — {a.nom}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={onAssign}
                    disabled={assigning || agentsLoading || activeAgents.length === 0 || !selectedAgent}
                    style={{
                      backgroundColor: '#8B1A1A',
                      color: 'white',
                      borderRadius: 6,
                      padding: '10px 20px',
                      fontSize: 16,
                      fontWeight: 700,
                      border: 'none',
                      cursor: assigning || agentsLoading || activeAgents.length === 0 || !selectedAgent ? 'not-allowed' : 'pointer',
                      opacity: assigning || agentsLoading ? 0.9 : 1,
                    }}
                  >
                    {assigning ? 'Assignation…' : 'Assigner'}
                  </button>
                </div>

                {assignSuccess ? (
                  <div
                    style={{
                      marginTop: 14,
                      color: '#166534',
                      backgroundColor: '#f0fdf4',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    Agent assigné avec succès
                  </div>
                ) : null}
              </div>
            </Card>

            <Card title="Photos de la mission">
              {missionPhotosLoading ? (
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}>Chargement des photos…</div>
              ) : missionPhotoEntries.length === 0 ? (
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}>Aucune photo disponible.</div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
                  {missionPhotoEntries.map((item) => (
                    <div key={item.zoneKey} style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#1A1A1A',
                          marginBottom: '8px',
                        }}
                      >
                        {item.zoneLabel}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', lineHeight: 0 }}
                      >
                        <img
                          src={item.url}
                          alt={item.zoneLabel}
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            display: 'block',
                          }}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

