import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  Crosshair, 
  Check, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  ClinicSetup, 
  DoctorProfile, 
  PatientProfile, 
  SurgicalCaseConfig 
} from '../../types';
import { ClinicSetupStep } from './ClinicSetupStep';
import { DoctorSetupStep } from './DoctorSetupStep';
import { PatientSetupStep } from './PatientSetupStep';
import { CaseWizard } from '../wizard/CaseWizard';

interface OnboardingMasterProps {
  clinic: ClinicSetup;
  onUpdateClinic: (c: ClinicSetup) => void;
  doctors: DoctorProfile[];
  onUpdateDoctors: (docs: DoctorProfile[]) => void;
  patients: PatientProfile[];
  onUpdatePatients: (pats: PatientProfile[]) => void;
  onSaveCase: (caseConfig: SurgicalCaseConfig) => void;
  onLaunchNavigation: (caseConfig: SurgicalCaseConfig) => void;
}

export const OnboardingMaster: React.FC<OnboardingMasterProps> = ({
  clinic,
  onUpdateClinic,
  doctors,
  onUpdateDoctors,
  patients,
  onUpdatePatients,
  onSaveCase,
  onLaunchNavigation,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(patients[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(doctors[0]);

  const levels = [
    { num: 1, title: '1. Clinic Setup', icon: Building2, desc: 'Institution & OR Suites' },
    { num: 2, title: '2. Doctor Profiles', icon: UserCheck, desc: 'Surgeons & Credentials' },
    { num: 3, title: '3. Patient Profiles', icon: Users, desc: 'Patient CBCT & Records' },
    { num: 4, title: '4. Surgical Case Wizard', icon: Crosshair, desc: '6-Step Navigation Setup' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Master Hierarchy Navigation Stepper Header */}
      <div className="medical-card" style={{ padding: '16px 20px', marginBottom: '28px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#00d4ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CLINIC ONBOARDING & SURGICAL CASE LIFECYCLE
            </span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '2px' }}>
              Dental Surgical Navigation Onboarding Flow
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              color: '#10b981', 
              background: 'rgba(16, 185, 129, 0.12)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 10px', 
              borderRadius: '6px',
              fontWeight: 700 
            }}>
              STEREO-OPTICAL REGISTERED
            </span>
          </div>
        </div>

        {/* 4 Levels Hierarchy Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {levels.map((lvl, index) => {
            const isCurrent = currentLevel === lvl.num;
            const isDone = currentLevel > lvl.num;
            const Icon = lvl.icon;
            return (
              <div
                key={lvl.num}
                onClick={() => setCurrentLevel(lvl.num)}
                style={{
                  background: isCurrent 
                    ? 'rgba(0, 212, 255, 0.12)' 
                    : isDone 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : 'var(--bg-surface)',
                  border: isCurrent 
                    ? '2px solid #00d4ff' 
                    : isDone 
                    ? '1px solid #10b981' 
                    : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isCurrent ? '#00d4ff' : isDone ? '#10b981' : 'var(--bg-secondary)',
                  color: isCurrent || isDone ? '#050b14' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  {isDone ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </div>

                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: isCurrent ? '#00d4ff' : isDone ? '#10b981' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {lvl.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lvl.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Hierarchy Workspace */}
      <div>
        {currentLevel === 1 && (
          <ClinicSetupStep
            clinicData={clinic}
            onSaveAndContinue={(updated) => {
              onUpdateClinic(updated);
              setCurrentLevel(2);
            }}
          />
        )}

        {currentLevel === 2 && (
          <DoctorSetupStep
            doctors={doctors}
            onUpdateDoctors={onUpdateDoctors}
            onContinue={() => setCurrentLevel(3)}
            onBack={() => setCurrentLevel(1)}
          />
        )}

        {currentLevel === 3 && (
          <PatientSetupStep
            patients={patients}
            onUpdatePatients={onUpdatePatients}
            selectedPatientId={selectedPatient.id}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onCreateNewCase={(p) => {
              setSelectedPatient(p);
              setCurrentLevel(4);
            }}
            onBack={() => setCurrentLevel(2)}
          />
        )}

        {currentLevel === 4 && (
          <CaseWizard
            patient={selectedPatient}
            doctor={selectedDoctor}
            onSaveCase={(cfg) => {
              onSaveCase(cfg);
            }}
            onLaunchNavigation={(cfg) => {
              onSaveCase(cfg);
              onLaunchNavigation(cfg);
            }}
            onCancel={() => setCurrentLevel(3)}
          />
        )}
      </div>
    </div>
  );
};
