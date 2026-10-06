import React, { useState } from 'react';
import { 
  UserCheck, 
  Award, 
  Search, 
  Plus, 
  CheckCircle2, 
  Stethoscope, 
  Calendar,
  Building2
} from 'lucide-react';
import { DoctorProfile, Specialization } from '../../types';

interface DoctorsViewProps {
  doctors: DoctorProfile[];
  onOpenDoctorSetup: () => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  onOpenDoctorSetup,
}) => {
  const [filterSpec, setFilterSpec] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = filterSpec === 'All' || doc.specialization === filterSpec;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  const specializations = ['All', 'Implantologist', 'Oral Surgeon', 'Periodontist', 'Endodontist', 'General Dentist'];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-status badge-cyan">Surgical Faculty</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• Credentialed Operating Surgeons</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Doctor Profile Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Board-certified surgeons with stereotactic navigation privileges and optical tracking certification.
          </p>
        </div>

        <button
          onClick={onOpenDoctorSetup}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Register New Surgeon</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="medical-card" style={{ padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {specializations.map(spec => (
            <button
              key={spec}
              onClick={() => setFilterSpec(spec)}
              style={{
                background: filterSpec === spec ? '#00d4ff' : 'var(--bg-surface)',
                color: filterSpec === spec ? '#050b14' : 'var(--text-secondary)',
                border: filterSpec === spec ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {spec}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            className="form-input"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            placeholder="Search doctor name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="medical-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '2px solid #00d4ff',
                  boxShadow: '0 0 16px rgba(0, 212, 255, 0.3)'
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{doctor.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{doctor.email}</p>
                <div style={{ marginTop: '6px' }}>
                  <span className="badge-status badge-cyan" style={{ fontSize: '0.68rem' }}>
                    {doctor.specialization}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '14px'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>EXPERIENCE</span>
                <span className="font-mono-telemetry" style={{ fontWeight: 700, fontSize: '0.85rem' }}>{doctor.yearsExperience} Years</span>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>CASES GUIDED</span>
                <span className="font-mono-telemetry" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981' }}>{doctor.surgicalCasesCompleted}+</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
              <span className="font-mono-telemetry" style={{ color: '#64748b' }}>{doctor.licenseNumber}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 600 }}>
                <Award size={13} /> Optical Tracker Certified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
