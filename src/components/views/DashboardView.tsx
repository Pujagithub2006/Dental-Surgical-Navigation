import React from 'react';
import { 
  Crosshair, 
  Activity, 
  Users, 
  UserCheck, 
  Cpu, 
  ShieldCheck, 
  ArrowUpRight, 
  PlusCircle, 
  Scan, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { ClinicSetup, DoctorProfile, PatientProfile, SurgicalCaseConfig } from '../../types';

interface DashboardViewProps {
  clinic: ClinicSetup;
  doctors: DoctorProfile[];
  patients: PatientProfile[];
  cases: SurgicalCaseConfig[];
  onOpenCase: (c: SurgicalCaseConfig) => void;
  onLaunchNewCaseWizard: () => void;
  onNavigateToOnboarding: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clinic,
  doctors,
  patients,
  cases,
  onOpenCase,
  onLaunchNewCaseWizard,
  onNavigateToOnboarding,
}) => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(5, 11, 20, 0.9) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-status badge-cyan">Surgical Guidance Operating Console</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <span className="pulse-led" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              ALL 4 OR SUITES SYNCHRONIZED
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            {clinic.clinicName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '650px' }}>
            AI-assisted sub-millimeter stereotactic navigation platform. Real-time optical tool tracking, dynamic neurovascular hazard envelopes, and multi-slice CBCT correlation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
          <button
            onClick={onNavigateToOnboarding}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <span>Onboarding Hierarchy Flow</span>
          </button>

          <button
            onClick={onLaunchNewCaseWizard}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '12px 22px' }}
          >
            <PlusCircle size={17} />
            <span>Configure New Case</span>
          </button>
        </div>

        <div className="scanline-effect" />
      </div>

      {/* Quick Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Metric 1 */}
        <div className="medical-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              ACTIVE SURGICAL CASES
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(0, 212, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crosshair size={18} color="#00d4ff" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 800 }}>{cases.length}</span>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>1 Live In Navigation</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            Scheduled for today across OR Suites 1-4
          </p>
        </div>

        {/* Metric 2 */}
        <div className="medical-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              STEREOTACTIC ACCURACY
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>±0.12</span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>mm deviation</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            Sub-millimeter osteotomy apex accuracy
          </p>
        </div>

        {/* Metric 3 */}
        <div className="medical-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              TRACKER FIDUCIAL STATUS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} color="#38bdf8" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 800 }}>4 / 4</span>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Fiducials Locked</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            60 FPS stereo IR optical telemetry (2.8ms latency)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="medical-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              REGISTERED SURGEONS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(167, 139, 250, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={18} color="#a78bfa" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="font-mono-telemetry" style={{ fontSize: '2rem', fontWeight: 800 }}>{doctors.length}</span>
            <span style={{ fontSize: '0.78rem', color: '#a78bfa' }}>Specialists Certified</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            Implantology, OMS, Periodontics & Endo
          </p>
        </div>
      </div>

      {/* Operating Rooms Live Status Grid */}
      <div className="medical-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Hospital Operating Suites Telemetry</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Real-time status of navigation optical camera rigs across OR suites</p>
          </div>
          <span className="badge-status badge-cyan">4 Suites Configured</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {/* Suite 1 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid #00d4ff', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>OR Suite 1 (Stereotactic)</span>
              <span className="badge-status badge-rose" style={{ fontSize: '0.625rem' }}>
                <span className="pulse-led" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} /> LIVE NAV
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Dr. Sarah Chen • Implant Placement #19</p>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Patient: Robert Hastings</span>
              <span className="font-mono-telemetry" style={{ color: '#10b981' }}>Depth: 5.2mm</span>
            </div>
          </div>

          {/* Suite 2 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>OR Suite 2 (Trauma/OMS)</span>
              <span className="badge-status badge-cyan" style={{ fontSize: '0.625rem' }}>PREP</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dr. Marcus Vance • Sinus Graft #14</p>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Patient: Eleanor Vance</span>
              <span className="font-mono-telemetry" style={{ color: '#00d4ff' }}>CBCT Synced</span>
            </div>
          </div>

          {/* Suite 3 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>OR Suite 3 (Microsurgical)</span>
              <span className="badge-status badge-emerald" style={{ fontSize: '0.625rem' }}>STANDBY</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Dr. Elena Rostova • Ready for check-in</p>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Calibrated: 08:00 AM</span>
              <span className="font-mono-telemetry" style={{ color: '#10b981' }}>Calib OK</span>
            </div>
          </div>

          {/* Suite 4 */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>OR Suite 4</span>
              <span className="badge-status badge-amber" style={{ fontSize: '0.625rem' }}>STERILIZING</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Post-procedure optical shroud change</p>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Next: 11:30 AM</span>
              <span className="font-mono-telemetry" style={{ color: '#fbbf24' }}>Autoclave</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Surgical Cases Pipeline List */}
      <div className="medical-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Today's Surgical Cases & Navigation Pipeline</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Select any case to inspect parameters or enter the live 3D navigation cockpit</p>
          </div>

          <button
            onClick={onLaunchNewCaseWizard}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <PlusCircle size={15} />
            <span>New Surgical Case</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cases.map(caseItem => {
            const patient = patients.find(p => p.id === caseItem.patientId) || patients[0];
            const doctor = doctors.find(d => d.id === caseItem.doctorId) || doctors[0];
            const isLive = caseItem.status === 'Navigation Active';

            return (
              <div
                key={caseItem.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: isLive ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: isLive ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isLive ? '#00d4ff' : '#94a3b8'
                  }}>
                    <Crosshair size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono-telemetry" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#00d4ff' }}>
                        {caseItem.caseNumber}
                      </span>
                      <span className={`badge-status ${isLive ? 'badge-rose' : 'badge-cyan'}`} style={{ fontSize: '0.625rem' }}>
                        {caseItem.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginTop: '2px' }}>
                      {caseItem.surgeryType} • Tooth #{caseItem.targetTeeth[0]} ({caseItem.anatomicalRegion})
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      <span>Patient: <strong style={{ color: 'var(--text-primary)' }}>{patient.name}</strong></span>
                      <span>Surgeon: <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong></span>
                      <span className="font-mono-telemetry">Depth: {caseItem.plannedDepthMm}mm</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => onOpenCase(caseItem)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  >
                    <Play size={14} />
                    <span>Launch 3D Navigation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
