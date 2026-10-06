import React from 'react';
import { 
  CheckCircle2, 
  Crosshair, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Edit3, 
  Share2, 
  Download,
  AlertTriangle,
  FileCheck2,
  Activity,
  Layers
} from 'lucide-react';
import { SurgicalCaseConfig, PatientProfile, DoctorProfile } from '../../types';

interface SummaryCardProps {
  config: SurgicalCaseConfig;
  patient: PatientProfile;
  doctor: DoctorProfile;
  onEditStep: (stepNumber: number) => void;
  onLaunchNavigation: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  config,
  patient,
  doctor,
  onEditStep,
  onLaunchNavigation,
}) => {
  const activeRisks = config.riskStructures.filter(r => r.enabled);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(0, 212, 255, 0.05) 100%)',
        border: '1px solid #00d4ff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px -4px rgba(0, 212, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-status badge-cyan">Navigation Configuration Card</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <CheckCircle2 size={14} /> STEREO-OPTICAL CALIBRATION VERIFIED
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              Surgical Case Configuration Summary
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Case <span className="font-mono-telemetry" style={{ color: '#00d4ff', fontWeight: 700 }}>{config.caseNumber}</span> • Patient: <strong style={{ color: 'var(--text-primary)' }}>{patient.name}</strong> ({patient.patientCode}) • Surgeon: <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onLaunchNavigation}
              className="btn-primary"
              style={{ 
                padding: '14px 26px', 
                fontSize: '0.95rem',
                boxShadow: '0 0 24px rgba(0, 212, 255, 0.5)'
              }}
            >
              <Crosshair size={18} strokeWidth={2.5} />
              <span>Launch Real-Time 3D Navigation</span>
            </button>
          </div>
        </div>

        {/* Generated Navigation Mode Banner */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(5, 11, 20, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} color="#00d4ff" />
            <div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                GENERATED NAVIGATION MODE
              </span>
              <span className="font-mono-telemetry" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                {config.navigationMode}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>TARGET ACCURACY</span>
              <span className="font-mono-telemetry" style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>±0.15 mm / 0.5°</span>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>STEREO IR FIDUCIALS</span>
              <span className="font-mono-telemetry" style={{ color: '#00d4ff', fontWeight: 700, fontSize: '0.85rem' }}>{config.opticalFiducialsRequired} Marker Array</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Configuration Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Selected Surgery Type & Stage */}
        <div className="medical-card" style={{ padding: '18px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase' }}>
              Steps 1 & 2 • Procedure & Stage
            </span>
            <button
              onClick={() => onEditStep(1)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              title="Edit Procedure"
            >
              <Edit3 size={15} />
            </button>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>SELECTED SURGERY TYPE</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {config.surgeryType}
            </h4>
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>SURGICAL STAGE</span>
            <span className="badge-status badge-cyan" style={{ marginTop: '2px' }}>
              {config.surgicalStage}
            </span>
          </div>
        </div>

        {/* Anatomical Region & Target Teeth */}
        <div className="medical-card" style={{ padding: '18px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
              Step 3 • Anatomical Region
            </span>
            <button
              onClick={() => onEditStep(3)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              title="Edit Anatomy"
            >
              <Edit3 size={15} />
            </button>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>REGION & JAW</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {config.anatomicalRegion}
            </h4>
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>TARGET SITES (FDI)</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {config.targetTeeth.map(t => (
                <span key={t} className="font-mono-telemetry" style={{ 
                  background: 'rgba(0, 212, 255, 0.15)', 
                  color: '#00d4ff', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  Tooth #{t}
                </span>
              ))}
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center', marginLeft: '4px' }}>
                {config.quadrant}
              </span>
            </div>
          </div>
        </div>

        {/* Instrument Selection */}
        <div className="medical-card" style={{ padding: '18px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Step 5 • Selected Instrument
            </span>
            <button
              onClick={() => onEditStep(5)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              title="Edit Instrument"
            >
              <Edit3 size={15} />
            </button>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>INSTRUMENT TYPE</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {config.instrument.type}
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>CALIBER</span>
              <span className="font-mono-telemetry" style={{ fontWeight: 700 }}>Ø {config.instrument.diameterMm} mm × {config.instrument.lengthMm} mm</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>LIMITS</span>
              <span className="font-mono-telemetry" style={{ color: '#38bdf8', fontWeight: 700 }}>{config.instrument.rpmLimit} RPM / {config.instrument.torqueLimitNcm} Ncm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Risk Structures & Safety Zones */}
      <div className="medical-card" style={{ padding: '22px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="#f59e0b" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monitored Risk Structures & Safety Zones</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Active stereotactic barriers configured to trigger acoustic deceleration and optical HUD alerts.
              </p>
            </div>
          </div>

          <button
            onClick={() => onEditStep(6)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Edit3 size={14} />
            <span>Configure Zones</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {activeRisks.map((risk, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                borderLeft: '3px solid #f59e0b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {risk.structure}
                </span>
                <span className="font-mono-telemetry" style={{ 
                  fontSize: '0.72rem', 
                  color: '#fbbf24', 
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  Buffer: {risk.safeMarginMm} mm
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                {risk.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Specific Anatomy Summary */}
      <div className="medical-card" style={{ padding: '22px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#a78bfa" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Patient Anatomy Parameters</h4>
          </div>
          <button
            onClick={() => onEditStep(4)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            <Edit3 size={13} />
            <span>Modify</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.8rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>BONE DENSITY</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.anatomy.boneDensity}</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>BONE MORPHOLOGY</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.anatomy.boneShape}</span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>NERVE LOCATION</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              {config.anatomy.nerveLocation}
            </span>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>SINUS PROXIMITY</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              {config.anatomy.sinusPosition}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => onEditStep(1)}
          className="btn-secondary"
          style={{ padding: '10px 18px' }}
        >
          <span>Modify Configuration Wizard</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => alert(`Exporting DICOM Surgical Guide Protocol (${config.caseNumber}) to hospital PACS archive.`)}
            className="btn-secondary"
          >
            <Download size={16} />
            <span>Export DICOM Protocol</span>
          </button>

          <button
            onClick={onLaunchNavigation}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Crosshair size={18} />
            <span>Enter Real-Time 3D Surgical Navigation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
