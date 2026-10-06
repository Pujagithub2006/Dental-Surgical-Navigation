import React from 'react';
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  PlusCircle, 
  Wifi, 
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface TopHeaderProps {
  currentDoctor: DoctorProfile;
  doctors: DoctorProfile[];
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onOpenNewCase: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  audioAlarmEnabled: boolean;
  setAudioAlarmEnabled: (val: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentDoctor,
  doctors,
  onSelectDoctor,
  onOpenNewCase,
  theme,
  setTheme,
  audioAlarmEnabled,
  setAudioAlarmEnabled,
}) => {
  return (
    <header className="top-navbar">
      {/* Left: Operating Room Status & Active Surgeon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#10b981',
            fontWeight: 600
          }}>
            <span className="pulse-led" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            OR SUITE 1 ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <Wifi size={14} color="#00d4ff" />
            <span className="font-mono-telemetry">DICOM PACS ONLINE</span>
          </div>
        </div>

        {/* Doctor Quick Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 10px 4px 6px',
            fontSize: '0.8125rem'
          }}>
            <img 
              src={currentDoctor.avatarUrl} 
              alt={currentDoctor.name} 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #00d4ff' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.1 }}>
                {currentDoctor.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#00d4ff' }}>
                {currentDoctor.specialization}
              </span>
            </div>
            <select
              value={currentDoctor.id}
              onChange={(e) => {
                const doc = doctors.find(d => d.id === e.target.value);
                if (doc) onSelectDoctor(doc);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
                cursor: 'pointer'
              }}
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      {/* Right: Actions, Audio Alarm Toggle, Theme Toggle, New Case CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Safety Zone Audio Alert Toggle */}
        <button
          onClick={() => setAudioAlarmEnabled(!audioAlarmEnabled)}
          title={audioAlarmEnabled ? "Hazard Audio Alarm: ACTIVE (Warning beeps enabled)" : "Hazard Audio Alarm: MUTED"}
          style={{
            background: audioAlarmEnabled ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
            border: audioAlarmEnabled ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
            color: audioAlarmEnabled ? '#fbbf24' : '#64748b',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          {audioAlarmEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{audioAlarmEnabled ? 'Surgical Alert Beep ON' : 'Alert Sound Muted'}</span>
        </button>

        {/* Theme Toggle (Hospital Navy Dark vs Clinical Light) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Dark Surgical Theater / Clinical Light Mode"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '8px 10px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#0284c7" />}
        </button>

        {/* Primary CTA: Configure New Case Wizard */}
        <button
          onClick={onOpenNewCase}
          className="btn-primary"
        >
          <PlusCircle size={16} />
          <span>New Surgical Case</span>
        </button>
      </div>
    </header>
  );
};
