import type { Fiche, Agent } from '../types';
export const mockFiches: Fiche[] = [
  { id: 'F-2024-001', type: 'BTP', status: 'Nouvelle', providerName: 'Constructions Modernes SARL', address: 'Zone Industrielle, Abidjan, Côte d\'Ivoire', clientEmail: 'contact@constructmod.ci', service: 'Audit BTP Standard', contactSite: '+225 07 00 11 22', assignedAgent: null, assignedDate: null, avisTransit: 'Site en activité partielle. Infrastructures conformes aux normes locales.', photos: 4 },
  { id: 'F-2024-002', type: 'AGRO', status: 'Assignée', providerName: 'Ferme Kaboré & Fils', address: 'Route de Bobo-Dioulasso, Ouagadougou, Burkina Faso', clientEmail: 'info@ferme-kabore.bf', service: 'Vérification Élevage', contactSite: '+226 70 44 55 66', assignedAgent: 'Koné Issa', assignedDate: '14/05/2024', declaredAnimaux: 50, detectedAnimaux: 47, avisTransit: 'Exploitation conforme sur les principaux indicateurs.', photos: 6 },
  { id: 'F-2024-003', type: 'COMMERCE', status: 'Soumise', providerName: 'Maison Diallo Trading', address: 'Quartier Plateau, Dakar, Sénégal', clientEmail: 'diallo.trading@gmail.com', service: 'Audit Commerce Avancé', contactSite: '+221 77 123 45 67', assignedAgent: 'Traoré Aminata', assignedDate: '08/05/2024', avisTransit: 'Activité commerciale bien établie.', photos: 5 },
  { id: 'F-2024-004', type: 'BTP', status: 'Achevée', providerName: 'Groupe Infrastructures Mali', address: 'ACI 2000, Bamako, Mali', clientEmail: 'gim@infra-mali.ml', service: 'Audit BTP Complet', contactSite: '+223 20 22 33 44', assignedAgent: 'Coulibaly Jean-Marc', assignedDate: '01/05/2024', avisTransit: 'Vérification terrain complète effectuée.', photos: 9 },
];
export const mockAgents: Agent[] = [
  { id: 'AGT-001', code: 'KI-001', name: 'Koné Issa', vertical: 'Agro', missions: 24, scoreReliability: 92, status: 'Actif' },
  { id: 'AGT-002', code: 'TA-002', name: 'Traoré Aminata', vertical: 'Commerce', missions: 18, scoreReliability: 87, status: 'Actif' },
  { id: 'AGT-003', code: 'CJ-003', name: 'Coulibaly Jean-Marc', vertical: 'BTP', missions: 31, scoreReliability: 95, status: 'Actif' },
  { id: 'AGT-004', code: 'DB-004', name: 'Diallo Boubacar', vertical: 'Agro', missions: 9, scoreReliability: 71, status: 'Inactif' },
];
