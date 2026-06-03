import { signOut } from 'firebase/auth';
import { BarChart3, FileText, LogOut, Users } from 'lucide-react';
import { auth } from '../firebase';

type NavScreen = 'fiches' | 'agents' | 'statistiques';

type NavItem = {
  id: NavScreen;
  label: string;
  Icon: typeof FileText;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'fiches', label: 'Fiches', Icon: FileText },
  { id: 'agents', label: 'Agents', Icon: Users },
  { id: 'statistiques', label: 'Statistiques', Icon: BarChart3 },
];

type SidebarProps = {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  totalFiches: number;
};

export default function Sidebar({ activeScreen, onNavigate, totalFiches }: SidebarProps) {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        height: '100vh',
        background: '#1B3A52',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ padding: '20px 16px 16px' }}>
        <div style={{ fontSize: '20px', color: '#fff', fontWeight: 500, lineHeight: 1.2 }}>
          tras<span style={{ color: '#6B1E2E' }}>·</span>it
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          Administration
        </div>
      </div>

      <div style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', margin: '0 12px' }} />

      <nav style={{ padding: '12px 0', flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeScreen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'left',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid #6B1E2E' : '2px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </button>
          );
        })}

        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            padding: '10px 12px',
            margin: '4px 12px 0',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#fff', lineHeight: 1.1 }}>
            {totalFiches}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
            fiches au total
          </div>
        </div>
      </nav>

      <div style={{ padding: '16px 12px' }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} strokeWidth={1.75} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
