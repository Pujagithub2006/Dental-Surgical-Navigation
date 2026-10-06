import React, { useState } from 'react';
import { 
  FolderKanban, 
  Crosshair, 
  Play, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  Wrench,
  ShieldAlert
} from 'lucide-react';
import { SurgicalCaseConfig, PatientProfile, DoctorProfile } from '../../types';

interface CasesViewProps {
  cases: SurgicalCaseConfig[];
  patients: PatientProfile[];
  doctors: DoctorProfile[];
  onOpenCase: (caseItem: SurgicalCaseConfig) => void;
  onLaunchNewCaseWizard: () => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  patients,
  doctors,
  onOpenCase,
  onLaunchNewCaseWizard,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = cases.filter(c => filterStatus === 'All' || c.status === filterStatus);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-status badge-cyan">Navigation Pipeline</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• Stereotactic Planning & Live Operating Rigs</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Surgical Cases & Navigation Board</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track planned surgical osteotomies, tissue manipulations, and active stereotactic cases.
          </p>
        </div>

        <button
          onClick={onLaunchNewCaseWizard}
          className="btn-primary"
        >
          <PlusCircle size={16} />
          <span>New Surgical Case</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="medical-card" style={{ padding: '12px 16px', marginBottom: '24px', display: 'flex', gap: '10px' }}>
        {['All', 'Planned', 'Navigation Active', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              background: filterStatus === status ? '#00d4ff' : 'var(--bg-surface)',
              color: filterStatus === status ? '#050b14' : 'var(--text-secondary)',
              border: filterStatus === status ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(caseItem => {
          const patient = patients.find(p => p.id === caseItem.patientId) || patients[0];
          const doctor = doctors.find(d => d.id === caseItem.doctorId) || doctors[0];
          const isLive = caseItem.status === 'Navigation Active';

          return (
            <div
              key={caseItem.id}
              className="medical-card"
              style={{
                padding: '20px',
                border: isLive ? '2px solid #00d4ff' : '1px solid var(--border-subtle)',
                boxShadow: isLive ? '0 0 24px rgba(0, 212, 255, 0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="font-mono-telemetry" style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 800, 
                      color: '#00d4ff', 
                      background: 'rgba(0, 212, 255, 0.1)', 
                      padding: '2px 8px', 
                      borderRadius: '4px' 
                    }}>
                      {caseItem.caseNumber}
                    </span>
                    <span className={`badge-status ${isLive ? 'badge-rose' : 'badge-cyan'}`}>
                      {caseItem.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Created: {caseItem.createdAt}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {caseItem.surgeryType} • Tooth #{caseItem.targetTeeth[0]} ({caseItem.anatomicalRegion})
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    Patient: <strong style={{ color: 'var(--text-primary)' }}>{patient.name}</strong> ({patient.patientCode}) • Surgeon: <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong> ({doctor.specialization})
                  </p>
                </div>

                <button
                  onClick={() => onOpenCase(caseItem)}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.875rem' }}
                >
                  <Play size={16} />
                  <span>Launch 3D Navigation</span>
                </button>
              </div>

              {/* Details Row */}
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                fontSize: '0.78rem'
              }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>STAGE</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseItem.surgicalStage}</span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>INSTRUMENT</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseItem.instrument.type} (Ø {caseItem.instrument.diameterMm}mm)</span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>PLANNED DEPTH</span>
                  <span className="font-mono-telemetry" style={{ fontWeight: 700, color: '#10b981' }}>{caseItem.plannedDepthMm} mm</span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>NAVIGATION PROTOCOL</span>
                  <span className="font-mono-telemetry" style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.72rem' }}>
                    {caseItem.navigationMode}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
