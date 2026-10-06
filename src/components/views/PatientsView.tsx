import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Scan, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface PatientsViewProps {
  patients: PatientProfile[];
  onCreateNewCase: (patient: PatientProfile) => void;
  onOpenPatientSetup: () => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onCreateNewCase,
  onOpenPatientSetup,
}) => {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.patientCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-status badge-cyan">Clinical Records</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• CBCT Volumetric Scans & Contraindications</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Patient Profile Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Patient dossiers with medical risk stratification, CBCT segmentation status, and direct surgical case configuration.
          </p>
        </div>

        <button
          onClick={onOpenPatientSetup}
          className="btn-primary"
        >
          <PlusCircle size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="medical-card" style={{ padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '350px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            className="form-input"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            placeholder="Search by patient name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Showing <strong>{filtered.length}</strong> active patient profiles
        </span>
      </div>

      {/* Patients Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '18px' }}>
        {filtered.map(patient => (
          <div key={patient.id} className="medical-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
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

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>
                  {patient.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {patient.age} years old • {patient.gender}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
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
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Medical History / Systemic Conditions
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {patient.medicalHistory.map((item, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.72rem', 
                    background: 'rgba(245, 158, 11, 0.1)', 
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
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
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

            {/* Action Bar */}
            <div style={{ 
              borderTop: '1px solid var(--border-subtle)', 
              paddingTop: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Scan Date: {patient.cbctScanDate}
              </span>

              <button
                onClick={() => onCreateNewCase(patient)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <PlusCircle size={15} />
                <span>Create New Surgical Case</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
