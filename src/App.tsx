import { useState } from 'react';
import Sidebar from './components/Sidebar';
import { mockAgents, mockFiches } from './data/mockData';
import Agents from './screens/Agents';
import FicheDetail from './screens/FicheDetail';
import Fiches from './screens/Fiches';
import Statistiques from './screens/Statistiques';
import type { Screen } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('fiches');
  const [selectedFicheId, setSelectedFicheId] = useState<string | null>(null);

  const sidebarScreen = screen === 'fiche-detail' ? 'fiches' : screen;

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
          ? mockFiches.find((f) => f.id === selectedFicheId)
          : undefined;
        return fiche ? (
          <FicheDetail fiche={fiche} agents={mockAgents} onBack={handleBack} />
        ) : (
          <Fiches onOpenFiche={handleOpenFiche} />
        );
      }
      case 'agents':
        return <Agents agents={mockAgents} />;
      case 'statistiques':
        return <Statistiques />;
      default:
        return <Fiches onOpenFiche={handleOpenFiche} />;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F5F2' }}>
      <Sidebar
        activeScreen={sidebarScreen}
        onNavigate={handleNavigate}
        totalFiches={mockFiches.length}
      />
      <main style={{ marginLeft: '220px', flex: 1, minWidth: 0 }}>{renderScreen()}</main>
    </div>
  );
}
