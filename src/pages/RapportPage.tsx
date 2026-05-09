import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../firebase';

type RapportDoc = {
  numerReference?: string;
  dateEmission?: unknown;
  nomClient?: string;
  numeroClient?: string;
  niveauService?: string;
  typeMission?: string;
  prestataire?: string;
  adresse?: string;
  district?: string;
  contactSite?: { nom?: string; telephone?: string } | null;
  dateVisite?: unknown;
  statut?: string;
  observations?: string;
  avisTrasit?: string;
  photos?: string[];
  tokenAcces?: string;
  tokenExpiration?: unknown;
  [key: string]: unknown;
};

function toDate(ts: unknown): Date | null {
  const anyTs = ts as any;
  if (anyTs?.toDate && typeof anyTs.toDate === 'function') {
    const d = anyTs.toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (typeof anyTs === 'string' || typeof anyTs === 'number') {
    const d = new Date(anyTs);
    return !Number.isNaN(d.getTime()) ? d : null;
  }
  return null;
}

function formatDateOnly(ts: unknown): string {
  const d = toDate(ts);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatDateTime(ts: unknown): string {
  const d = toDate(ts);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function safeString(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export default function RapportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [docData, setDocData] = useState<RapportDoc | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const tokenFromUrl = searchParams.get('token') || '';

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'fiches_mission', id));
        if (!mounted) return;

        const data = snap.exists() ? (snap.data() as RapportDoc) : null;
        setDocData(data);

        if (!data) {
          setIsAllowed(false);
          return;
        }

        const tokenAcces = safeString(data.tokenAcces);
        const tokenExpirationDate = toDate(data.tokenExpiration);

        const tokenOk = tokenAcces.length > 0 && tokenFromUrl.length > 0 && tokenAcces === tokenFromUrl;
        const expirationOk = !!tokenExpirationDate && Date.now() <= tokenExpirationDate.getTime();

        setIsAllowed(tokenOk && expirationOk);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, tokenFromUrl]);

  const photos = useMemo(() => {
    const raw = docData?.photos;
    if (!Array.isArray(raw)) return [];
    return raw.filter((u) => isNonEmptyString(u)).map((u) => u.trim());
  }, [docData]);

  const borderBlack = '2px solid #111111';
  const borderBordeaux = '2px solid #6B1E2E';

  const main: React.CSSProperties = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '26px 20px 60px',
    background: '#ffffff',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 900,
    color: '#111111',
    marginBottom: 14,
  };

  const text: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: '#111111',
  };

  const expiredView = (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#111111', marginBottom: 14 }}>Lien expiré</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111111' }}>
          Ce lien a expiré. Contactez TRASIT pour obtenir un nouveau lien.
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>Chargement du rapport…</div>
        </div>
      </div>
    );
  }

  if (!docData || isAllowed !== true) {
    return expiredView;
  }

  const detailsRow = (label: string, value: string, isLast?: boolean) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 14,
        padding: '14px 12px',
        borderBottom: isLast ? 'none' : '1px solid #6B1E2E',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#111111', minWidth: 0 }}>{value}</div>
    </div>
  );

  const logo = (
    <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
      <span style={{ fontSize: 28, fontWeight: 900, color: '#111111' }}>tras</span>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: '#A63D2F',
          display: 'inline-block',
          margin: '0 6px',
          transform: 'translateY(-2px)',
        }}
      />
      <span style={{ fontSize: 28, fontWeight: 900, color: '#111111' }}>it</span>
    </div>
  );

  const openPhoto = (idx: number) => setPhotoIndex(idx);
  const closePhoto = () => setPhotoIndex(null);
  const prevPhoto = () => setPhotoIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  const nextPhoto = () => setPhotoIndex((i) => (i === null ? i : (i + 1) % photos.length));

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111' }}>
      {/* 1) Header */}
      <header style={{ borderBottom: '3px solid #111111', background: '#ffffff' }}>
        <div
          style={{
            ...main,
            paddingTop: 18,
            paddingBottom: 18,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {logo}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#111111' }}>{safeString(docData.numerReference)}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>{formatDateOnly(docData.dateEmission)}</div>
          </div>
        </div>
      </header>

      {/* 2) Bande statut */}
      <section style={{ borderBottom: '1px solid #111111', background: '#ffffff' }}>
        <div
          style={{
            ...main,
            paddingTop: 14,
            paddingBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>
            Statut de la mission : {safeString(docData.statut)}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#111111',
              border: borderBlack,
              padding: '8px 12px',
              borderRadius: 8,
              background: '#ffffff',
            }}
          >
            Rapport vérifié
          </div>
        </div>
      </section>

      <main style={main}>
        {/* 3) Bloc client */}
        <section style={{ border: borderBordeaux, borderRadius: 10, padding: 18, marginBottom: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#111111', marginBottom: 6 }}>{safeString(docData.nomClient)}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>{safeString(docData.numeroClient)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>Niveau de service</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>{safeString(docData.niveauService)}</div>
            </div>
          </div>
        </section>

        {/* 4) Détails mission */}
        <section style={{ marginBottom: 18, background: '#ffffff' }}>
          <div style={sectionTitle}>Détails de la mission</div>
          <div style={{ border: borderBordeaux, borderRadius: 10, overflow: 'hidden', background: '#ffffff' }}>
            {detailsRow('Type de mission', safeString(docData.typeMission))}
            {detailsRow('Prestataire', safeString(docData.prestataire))}
            {detailsRow('Adresse', safeString(docData.adresse))}
            {detailsRow('District', safeString(docData.district))}
            {detailsRow(
              'Contact sur site',
              `${safeString(docData.contactSite?.nom)}${safeString(docData.contactSite?.telephone) ? ` — ${safeString(docData.contactSite?.telephone)}` : ''}`
            )}
            {detailsRow('Date de visite', formatDateOnly(docData.dateVisite))}
            {detailsRow('Date / heure émission', formatDateTime(docData.dateEmission), true)}
          </div>
        </section>

        {/* 5) Photos de terrain */}
        <section style={{ marginBottom: 18, background: '#ffffff' }}>
          <div style={sectionTitle}>Photos de terrain</div>
          {photos.length === 0 ? (
            <div style={{ ...text, border: borderBlack, borderRadius: 10, padding: 14, background: '#ffffff' }}>Aucune photo disponible.</div>
          ) : (
            <div style={{ border: borderBlack, borderRadius: 10, padding: 14, background: '#ffffff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
                {photos.map((url, idx) => (
                  <div key={`${url}-${idx}`} style={{ border: borderBlack, borderRadius: 10, padding: 10, background: '#ffffff' }}>
                    <button
                      type="button"
                      onClick={() => openPhoto(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Zone ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: 220,
                          objectFit: 'cover',
                          borderRadius: 8,
                          display: 'block',
                          border: borderBlack,
                        }}
                      />
                    </button>
                    <div style={{ marginTop: 10, fontSize: 20, fontWeight: 900, color: '#111111' }}>Zone {idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 6) Observations */}
        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ ...sectionTitle, marginBottom: 10 }}>Observations de terrain</div>
          <div style={text}>{safeString(docData.observations)}</div>
        </section>

        {/* 7) Avis TRASIT */}
        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ ...sectionTitle, marginBottom: 10 }}>Avis TRASIT</div>
          <div style={text}>{safeString(docData.avisTrasit)}</div>
        </section>

        {/* 8) Certification */}
        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                border: borderBlack,
                display: 'grid',
                placeItems: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#111111',
                background: '#ffffff',
              }}
              aria-label="Bouclier"
            >
              🛡
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>TRASIT certifie l’authenticité et l’intégrité de ce rapport.</div>
          </div>
        </section>

        {/* 9) Bouton PDF */}
        <section style={{ marginBottom: 26, background: '#ffffff' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: '#ffffff',
              border: borderBlack,
              borderRadius: 10,
              padding: '14px 18px',
              fontSize: 20,
              fontWeight: 900,
              color: '#111111',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Télécharger le rapport PDF
          </button>
        </section>

        {/* 10) Footer */}
        <footer
          style={{
            borderTop: '3px solid #111111',
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            background: '#ffffff',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>TRASIT — Service de vérification terrain indépendante</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111111' }}>trasit.com</div>
        </footer>
      </main>

      {/* Zoom photos */}
      {photoIndex !== null && photos[photoIndex] ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closePhoto}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#111111',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            zIndex: 9999,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 18 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closePhoto();
              }}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 900,
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 18,
              minHeight: 0,
            }}
          >
            <img
              src={photos[photoIndex]}
              alt={`Photo ${photoIndex + 1}`}
              style={{
                maxWidth: '95vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                border: '2px solid #ffffff',
                borderRadius: 12,
                display: 'block',
              }}
            />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 18,
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={prevPhoto}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 900,
                padding: '12px 16px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 900,
                padding: '12px 16px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

