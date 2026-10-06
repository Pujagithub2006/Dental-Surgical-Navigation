import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HeartPulse, 
  FileBox, 
  PlusCircle,
  Scan,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface PatientSetupStepProps {
  patients: PatientProfile[];
  onUpdatePatients: (patients: PatientProfile[]) => void;
  selectedPatientId: string;
  onSelectPatient: (patient: PatientProfile) => void;
  onCreateNewCase: (patient: PatientProfile) => void;
  onBack: () => void;
}

export const PatientSetupStep: React.FC<PatientSetupStepProps> = ({
  patients,
  onUpdatePatients,
  selectedPatientId,
  onSelectPatient,
  onCreateNewCase,
  onBack,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // New patient state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(52);
  const [gender, setGender] = useState<PatientProfile['gender']>('Female');
  const [patientCode, setPatientCode] = useState(`PT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [medicalConditionInput, setMedicalConditionInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>([
    'Hypertension (Stage 1)',
    'Penicillin allergy (Mild)'
  ]);
  const [previousProcedureInput, setPreviousProcedureInput] = useState('');
  const [previousProcedures, setPreviousProcedures] = useState<string[]>([
    'Surgical Extraction #30 (2024)',
    'Endodontic therapy #19'
  ]);

  const handleAddCondition = () => {
    if (medicalConditionInput.trim()) {
      setMedicalHistory([...medicalHistory, medicalConditionInput.trim()]);
      setMedicalConditionInput('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
  };

  const handleAddProcedure = () => {
    if (previousProcedureInput.trim()) {
      setPreviousProcedures([...previousProcedures, previousProcedureInput.trim()]);
      setPreviousProcedureInput('');
    }
  };

  const handleRemoveProcedure = (index: number) => {
    setPreviousProcedures(previousProcedures.filter((_, i) => i !== index));
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      patientCode,
      name,
      age: Number(age),
      gender,
      medicalHistory: [...medicalHistory],
      allergies: ['Penicillin (Moderate rash)'],
      previousProcedures: [...previousProcedures],
      cbctScanDate: '2026-10-06',
      cbctScanResolution: '0.125 mm Voxel High-Res',
      cbctScanStatus: 'Uploaded & Segmented',
      riskCategory: medicalHistory.length > 2 ? 'High Risk' : 'Moderate Risk',
    };

    onUpdatePatients([...patients, newPatient]);
    onSelectPatient(newPatient);
    setShowAddForm(false);
  };

  const currentSelectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">Hierarchy Level 3</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Patient Demographics & CBCT Diagnostics</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Patient Profile Management</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Maintain patient surgical dossiers, systemic health contraindications, volumetric 3D CBCT models, and launch stereotactic case planning.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>{showAddForm ? 'Close Form' : 'Register New Patient'}</span>
            </button>

            {currentSelectedPatient && (
              <button
                onClick={() => onCreateNewCase(currentSelectedPatient)}
                className="btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                <PlusCircle size={17} />
                <span>Create New Surgical Case</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Patient Form Modal / Accordion */}
      {showAddForm && (
        <div className="medical-card" style={{ padding: '24px', marginBottom: '24px', border: '2px solid #00d4ff', background: 'rgba(11, 23, 44, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Users size={20} color="#00d4ff" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Register Patient Profile</h3>
          </div>

          <form onSubmit={handleSavePatient}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Patient ID *</label>
                <input
                  type="text"
                  className="form-input font-mono-telemetry"
                  required
                  value={patientCode}
                  onChange={e => setPatientCode(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Patient Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Robert Hastings"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="form-input font-mono-telemetry"
                  required
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="form-label">Gender *</label>
                <select
                  className="form-input"
                  value={gender}
                  onChange={e => setGender(e.target.value as PatientProfile['gender'])}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Medical History Tags */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Medical History / Systemic Conditions</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Type II Diabetes, Hypertension, Bisphosphonates, Anticoagulants"
                  value={medicalConditionInput}
                  onChange={e => setMedicalConditionInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCondition(); } }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddCondition}
                >
                  Add Condition
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {medicalHistory.map((cond, idx) => (
                  <span
                    key={idx}
                    className="badge-status badge-amber"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveCondition(idx)}
                    title="Click to remove"
                  >
                    <AlertTriangle size={12} /> {cond} ✕
                  </span>
                ))}
              </div>
            </div>

            {/* Previous Procedures */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Previous Dental / Surgical Procedures</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ridge Augmentation #19, Sinus Lift, Apicoectomy"
                  value={previousProcedureInput}
                  onChange={e => setPreviousProcedureInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddProcedure(); } }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddProcedure}
                >
                  Add Procedure
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {previousProcedures.map((proc, idx) => (
                  <span
                    key={idx}
                    className="badge-status badge-cyan"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveProcedure(idx)}
                    title="Click to remove"
                  >
                    <Clock size={12} /> {proc} ✕
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Register Patient & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patient Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {patients.map(patient => {
          const isSelected = selectedPatientId === patient.id;
          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`medical-card ${isSelected ? 'medical-card-selected' : ''}`}
              style={{ padding: '20px', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono-telemetry" style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(0, 212, 255, 0.1)', 
                      color: '#00d4ff', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontWeight: 700 
                    }}>
                      {patient.patientCode}
                    </span>
                    <span className={`badge-status ${patient.riskCategory === 'High Risk' ? 'badge-rose' : patient.riskCategory === 'Moderate Risk' ? 'badge-amber' : 'badge-emerald'}`}>
                      {patient.riskCategory}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '6px' }}>
                    {patient.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {patient.age} years old • {patient.gender}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#10b981', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    justifyContent: 'flex-end' 
                  }}>
                    <Scan size={14} />
                    {patient.cbctScanStatus}
                  </span>
                  <span className="font-mono-telemetry" style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                    {patient.cbctScanResolution}
                  </span>
                </div>
              </div>

              {/* Medical History */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Medical History
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {patient.medicalHistory.map((item, i) => (
                    <span key={i} style={{ 
                      fontSize: '0.72rem', 
                      background: 'rgba(245, 158, 11, 0.12)', 
                      color: '#fbbf24', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      border: '1px solid rgba(245, 158, 11, 0.25)'
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Previous Procedures */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Previous Procedures
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {patient.previousProcedures.map((proc, i) => (
                    <span key={i} style={{ 
                      fontSize: '0.72rem', 
                      background: 'rgba(14, 165, 233, 0.1)', 
                      color: '#38bdf8', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      border: '1px solid rgba(14, 165, 233, 0.2)'
                    }}>
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Create New Surgical Case */}
              <div style={{ 
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  CBCT Date: {patient.cbctScanDate}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNewCase(patient);
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <PlusCircle size={15} />
                  <span>Create New Surgical Case</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Doctor Profiles</span>
        </button>

        {currentSelectedPatient && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onCreateNewCase(currentSelectedPatient)}
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <span>Proceed to Step 4: Configure Surgical Case Wizard</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
