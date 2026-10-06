import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FolderKanban, 
  Crosshair, 
  FileText, 
  Building2, 
  Activity, 
  Cpu, 
  Radio
} from 'lucide-react';
import { ActiveTab, ClinicSetup } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  clinic: ClinicSetup;
  activeCaseCount: number;
}

export const NavigationSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  clinic,
  activeCaseCount
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors' as ActiveTab, label: 'Doctors', icon: UserCheck, count: 5 },
    { id: 'patients' as ActiveTab, label: 'Patients', icon: Users, count: 4 },
    { id: 'cases' as ActiveTab, label: 'Surgical Cases', icon: FolderKanban, badge: activeCaseCount },
    { id: 'navigation-session' as ActiveTab, label: 'Navigation Sessions', icon: Crosshair, live: true },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      {/* Clinic & Brand Header */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #00d4ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 212, 255, 0.4)'
          }}>
            <Crosshair size={22} color="#050b14" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                NaviDent<span style={{ color: '#00d4ff' }}>AI</span>
              </span>
              <span style={{ 
                fontSize: '0.625rem', 
                fontWeight: 700, 
                backgroundColor: 'rgba(0, 212, 255, 0.15)', 
                color: '#00d4ff', 
                padding: '2px 5px', 
                borderRadius: '4px',
                border: '1px solid rgba(0, 212, 255, 0.3)'
              }}>
                v3.4 PRO
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '175px' }}>
              {clinic.clinicName}
            </p>
          </div>
        </div>

        {/* Setup Flow Direct Access Button */}
        <button
          onClick={() => setActiveTab('onboarding')}
          style={{
            marginTop: '16px',
            width: '100%',
            background: activeTab === 'onboarding' ? 'rgba(0, 212, 255, 0.18)' : 'rgba(17, 31, 56, 0.8)',
            border: activeTab === 'onboarding' ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
            color: activeTab === 'onboarding' ? '#00d4ff' : '#94a3b8',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} />
            <span>Clinic Onboarding & Case Wizard</span>
          </div>
          <span style={{ 
            fontSize: '0.65rem', 
            background: 'rgba(16, 185, 129, 0.2)', 
            color: '#10b981', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontWeight: 700
          }}>
            STEPS 1-4
          </span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <p style={{ 
          fontSize: '0.6875rem', 
          fontWeight: 700, 
          color: '#64748b', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          padding: '0 8px 8px 8px' 
        }}>
          Navigation Console
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.03) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #00d4ff' : '3px solid transparent',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? '#00d4ff' : '#64748b'} />
                  <span>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.live && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.65rem',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}>
                      <span className="pulse-led" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                      LIVE OR
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span style={{
                      fontSize: '0.72rem',
                      background: 'rgba(14, 165, 233, 0.2)',
                      color: '#38bdf8',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Optical Tracking Hardware Telemetry Footer */}
      <div style={{ 
        padding: '14px 16px', 
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(5, 11, 20, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="#00d4ff" />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8' }}>
              Stereo IR Optical Tracker
            </span>
          </div>
          <span style={{ 
            fontSize: '0.625rem', 
            color: '#10b981', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px' 
          }}>
            <span className="pulse-led" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            CALIBRATED
          </span>
        </div>

        <div style={{ 
          background: 'rgba(17, 31, 56, 0.8)', 
          borderRadius: '6px', 
          padding: '8px 10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          fontSize: '0.6875rem'
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.6rem' }}>FIDUCIALS</span>
            <span className="font-mono-telemetry" style={{ color: '#38bdf8', fontWeight: 600 }}>4 / 4 Locked</span>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.6rem' }}>LATENCY</span>
            <span className="font-mono-telemetry" style={{ color: '#10b981', fontWeight: 600 }}>2.8 ms (60 FPS)</span>
          </div>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b' }}>
          <span>Suite: OR-1 (Mandibular)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
            <Radio size={12} /> Sync OK
          </span>
        </div>
      </div>
    </aside>
  );
};
