import React from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Crosshair, 
  Printer, 
  Share2, 
  Calendar,
  Layers
} from 'lucide-react';
import { SurgicalCaseConfig, PatientProfile, DoctorProfile } from '../../types';

interface ReportsViewProps {
  cases: SurgicalCaseConfig[];
  patients: PatientProfile[];
  doctors: DoctorProfile[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  cases,
  patients,
  doctors,
}) => {
  const currentCase = cases[0];
  const patient = patients.find(p => p.id === currentCase.patientId) || patients[0];
  const doctor = doctors.find(d => d.id === currentCase.doctorId) || doctors[0];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-status badge-cyan">Quality Assurance</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• Post-Operative Navigation Accuracy Verification</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Surgical Navigation Audit & Accuracy Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Multi-planar verification of planned vs actual osteotomy trajectories, sub-millimeter deviation benchmarks, and safety clearance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert("Printing hospital surgical compliance audit report...")}
            className="btn-secondary"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => alert(`Downloading Certified Navigation Audit PDF for Case ${currentCase.caseNumber}...`)}
            className="btn-primary"
          >
            <Download size={16} />
            <span>Export Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="medical-card" style={{ padding: '28px', marginBottom: '24px' }}>
        {/* Header Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="font-mono-telemetry" style={{ fontWeight: 800, fontSize: '0.9rem', color: '#00d4ff' }}>
                {currentCase.caseNumber}
              </span>
              <span className="badge-status badge-emerald">VERIFIED BY OPTICAL ENCODERS</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Stereotactic Implant Osteotomy Audit: Tooth #{currentCase.targetTeeth[0]}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Patient: <strong>{patient.name}</strong> ({patient.patientCode}) • Surgeon: <strong>{doctor.name}</strong> • Modality: {currentCase.navigationMode}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>AUDIT TIMESTAMP</span>
            <span className="font-mono-telemetry" style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>2026-10-06 09:42:18 EST</span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', marginTop: '2px' }}>Passed AAOMS Accuracy Standard</span>
          </div>
        </div>

        {/* 3 Core Accuracy Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Metric 1: Entry Point Deviation */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
              ENTRY POINT DEVIATION
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
              <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>0.18</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>mm</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Within &lt; 0.50mm tolerance</span>
          </div>

          {/* Metric 2: Apex Depth Deviation */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
              APEX DEPTH DEVIATION
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
              <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>0.11</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>mm</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Target: 11.5mm / Actual: 11.61mm</span>
          </div>

          {/* Metric 3: Angular Trajectory Error */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
              ANGULAR TRAJECTORY ERROR
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
              <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>0.74°</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Planned: 8.5° / Executed: 9.24°</span>
          </div>

          {/* Metric 4: Nerve Safety Margin */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
              INFERIOR ALVEOLAR CLEARANCE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
              <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24' }}>2.89</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>mm</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Safe Buffer (&gt;2.0mm) Preserved</span>
          </div>
        </div>

        {/* Safety Zone Adherence Audit Table */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
            Monitored Risk Structures Adherence Checklist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentCase.riskStructures.filter(r => r.enabled).map((risk, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeft: '3px solid #10b981'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{risk.structure}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>{risk.description}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Buffer threshold: {risk.safeMarginMm}mm</span>
                  <span className="badge-status badge-emerald" style={{ fontSize: '0.68rem' }}>0 INCIDENTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
