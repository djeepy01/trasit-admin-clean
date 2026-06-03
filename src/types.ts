export type FicheStatus = 'Nouvelle' | 'Assignée' | 'Soumise' | 'Achevée';
export type FicheType = 'BTP' | 'AGRO' | 'COMMERCE';
export type Screen = 'fiches' | 'fiche-detail' | 'agents' | 'statistiques';
export interface Fiche {
  id: string;
  type: FicheType;
  status: FicheStatus;
  providerName: string;
  address: string;
  clientEmail: string;
  service: string;
  contactSite: string;
  assignedAgent: string | null;
  assignedDate: string | null;
  declaredAnimaux?: number;
  detectedAnimaux?: number;
  avisTransit: string;
  photos: number;
}
export interface Agent {
  id: string;
  code: string;
  name: string;
  vertical: string;
  missions: number;
  scoreReliability: number;
  status: 'Actif' | 'Inactif';
}
