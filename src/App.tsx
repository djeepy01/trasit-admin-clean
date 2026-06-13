import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import { mockAgents } from './data/mockData';
import { db } from './firebase';
import Agents from './screens/Agents';
import FicheDetail from './screens/FicheDetail';
import Fiches from './screens/Fiches';
import Statistiques from './screens/Statistiques';
import type { Fiche, Screen } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('fiches');
  const [selectedFicheId, setSelectedFicheId] = useState<string | null>(null);
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sidebarScreen = screen === 'fiche-detail' ? 'fiches' : screen;

  useEffect(() => {
    const q = query(collection(db, 'fiches_mission'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: Fiche[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          const photosRaw = d.photos;
          const photosCount =
            photosRaw && typeof photosRaw === 'object'
              ? Object.keys(photosRaw as Record<string, unknown>).length
              : 0;

          const rawStatus = String(d.statut ?? '');
          const statusMap: Record<string, Fiche['status']> = {
            nouvelle: 'Nouvelle',
            assignée: 'Assignée',
            assignee: 'Assignée',
            soumise: 'Soumise',
            achevée: 'Achevée',
            achevee: 'Achevée',
          };
          const status =
            statusMap[rawStatus.toLowerCase()] ??
            (['Nouvelle', 'Assignée', 'Soumise', 'Achevée'].includes(rawStatus)
              ? (rawStatus as Fiche['status'])
              : 'Nouvelle');

          const dateRaw = d.dateAssignation;
          const assignedDate =
            dateRaw == null
              ? null
              : typeof dateRaw === 'object' && 'toDate' in dateRaw
                ? (dateRaw as { toDate: () => Date }).toDate().toLocaleDateString('fr-FR')
                : String(dateRaw);

          return {
            id: doc.id,
            type: String(d.missionType ?? 'BTP').toUpperCase() as Fiche['type'],
            status,
            providerName: String(d.providerName ?? d.prestataire ?? d.nomClient ?? ''),
            address: String(d.siteAddress ?? d.adresse ?? ''),
            clientEmail: String(d.emailClient ?? ''),
            service: String(d.serviceLevel ?? d.niveauService ?? ''),
            contactSite: String(d.onSiteContactName ?? ''),
            assignedAgent: d.agentCode ? String(d.agentCode) : null,
            assignedDate,
            declaredAnimaux: d.declaredAnimaux as number | undefined,
            detectedAnimaux: d.detectedAnimaux as number | undefined,
            avisTransit: String(d.avisTRASIT ?? ''),
            photos: photosCount,
          };
        });

        setFiches(next);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur lecture fiches_mission:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  function handleNavigate(target: 'fiches' | 'agents' | 'statistiques') {
    setSelectedFicheId(null);
    setScreen(target);
  }

  function handleOpenFiche(id: string) {
    setSelectedFicheId(id);
    setScreen('fiche-detail');
  }

  function handleBack() {
    setSelectedFicheId(null);
    setScreen('fiches');
  }

  function renderScreen() {
    switch (screen) {
      case 'fiche-detail': {
        const fiche = selectedFicheId
          ? fiches.find((f) => f.id === selectedFicheId)
          : undefined;
        return fiche ? (
          <FicheDetail fiche={fiche} agents={mockAgents} onBack={handleBack} />
        ) : (
          <Fiches fiches={fiches} onOpenFiche={handleOpenFiche} />
        );
      }
      case 'agents':
        return <Agents agents={mockAgents} />;
      case 'statistiques':
        return <Statistiques />;
      default:
        return <Fiches fiches={fiches} onOpenFiche={handleOpenFiche} />;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F5F2' }}>
      <Sidebar
        activeScreen={sidebarScreen}
        onNavigate={handleNavigate}
        totalFiches={fiches.length}
      />
      <main style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>
        {loading ? (
          <div style={{ padding: '20px', fontSize: '16px', color: '#444444' }}>
            Chargement des fiches…
          </div>
        ) : (
          renderScreen()
        )}
      </main>
    </div>
  );
}
