import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Award, 
  Radio, 
  Camera, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { DoctorProfile, Specialization } from '../../types';

interface DoctorSetupStepProps {
  doctors: DoctorProfile[];
  onUpdateDoctors: (doctors: DoctorProfile[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const specializations: { value: Specialization; description: string; iconColor: string }[] = [
  { value: 'Implantologist', description: 'Immediate & delayed dental implantology, sinus elevations, guided bone regeneration', iconColor: '#00d4ff' },
  { value: 'Oral Surgeon', description: 'Maxillofacial trauma, orthognathic osteotomies, complex impactions & pathology', iconColor: '#38bdf8' },
  { value: 'Periodontist', description: 'Soft tissue mucogingival grafting, osseous recontouring & peri-implantitis management', iconColor: '#10b981' },
  { value: 'Endodontist', description: 'Surgical apicoectomies, retrograde root fillings, microscopic navigation', iconColor: '#f59e0b' },
  { value: 'General Dentist', description: 'Comprehensive prosthetics, single-unit implants, surgical tooth extractions', iconColor: '#a78bfa' },
];

export const DoctorSetupStep: React.FC<DoctorSetupStepProps> = ({
  doctors,
  onUpdateDoctors,
  onContinue,
  onBack,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');

  // Form fields for adding new doctor
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300');
  const [specialization, setSpecialization] = useState<Specialization>('Implantologist');
  const [yearsExperience, setYearsExperience] = useState<number>(10);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [assignedRoom, setAssignedRoom] = useState('OR Suite 1');

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newDoc: DoctorProfile = {
      id: `doc-${Date.now()}`,
      name,
      email,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
      specialization,
      yearsExperience: Number(yearsExperience),
      licenseNumber: licenseNumber || `LIC-MA-${Math.floor(10000 + Math.random() * 90000)}`,
      surgicalCasesCompleted: 0,
      trackerCertified: true,
      assignedRoom,
    };

    onUpdateDoctors([...doctors, newDoc]);
    setSelectedDoctorId(newDoc.id);
    setShowAddForm(false);
    // Reset form
    setName('');
    setEmail('');
    setLicenseNumber('');
  };

  const handleRemoveDoctor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doctors.length <= 1) {
      alert("At least one registered doctor profile is required for surgical navigation safety compliance.");
      return;
    }
    const filtered = doctors.filter(d => d.id !== id);
    onUpdateDoctors(filtered);
    if (selectedDoctorId === id && filtered.length > 0) {
      setSelectedDoctorId(filtered[0].id);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">Hierarchy Level 2</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Surgical Team & Credentialing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Doctor Profile Management</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Register licensed clinicians, select surgical specializations, verify tracker certifications, and configure operating theater authorizations.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel Registration' : 'Register New Doctor'}</span>
          </button>
        </div>
      </div>

      {/* Add New Doctor Inline Form */}
      {showAddForm && (
        <div className="medical-card" style={{ padding: '24px', marginBottom: '24px', border: '2px solid #00d4ff', background: 'rgba(11, 23, 44, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sparkles size={18} color="#00d4ff" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Doctor Profile</h3>
          </div>

          <form onSubmit={handleAddDoctor}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Doctor Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Dr. Alex Mercer, DDS"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Doctor Work Email *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="a.mercer@apexprecisiondental.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Years of Experience *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="form-input font-mono-telemetry"
                  required
                  value={yearsExperience}
                  onChange={e => setYearsExperience(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Specialization Selection Cards */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                Specialization Selection *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                {specializations.map(spec => (
                  <div
                    key={spec.value}
                    onClick={() => setSpecialization(spec.value)}
                    className={`medical-card-interactive ${specialization === spec.value ? 'medical-card-selected' : ''}`}
                    style={{ padding: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: specialization === spec.value ? '#00d4ff' : 'var(--text-primary)' }}>
                        {spec.value}
                      </span>
                      {specialization === spec.value && <Check size={16} color="#00d4ff" />}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                      {spec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Profile Avatar Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="Image URL..."
                />
              </div>

              <div>
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  className="form-input font-mono-telemetry"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  placeholder="LIC-MA-44910-IMP"
                />
              </div>

              <div>
                <label className="form-label">Primary Assigned Suite</label>
                <select
                  className="form-input"
                  value={assignedRoom}
                  onChange={e => setAssignedRoom(e.target.value)}
                >
                  <option value="OR Suite 1">OR Suite 1 (Stereotactic)</option>
                  <option value="OR Suite 2">OR Suite 2 (Trauma)</option>
                  <option value="OR Suite 3">OR Suite 3 (Microsurgical)</option>
                  <option value="OR Suite 4">OR Suite 4</option>
                </select>
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
                Save Doctor Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Doctor Profiles Directory Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {doctors.map(doctor => {
          const isSelected = selectedDoctorId === doctor.id;
          return (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctorId(doctor.id)}
              className={`medical-card ${isSelected ? 'medical-card-selected' : ''}`}
              style={{ padding: '18px', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: isSelected ? '2px solid #00d4ff' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 14px rgba(0, 212, 255, 0.4)' : 'none'
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doctor.name}
                    </h4>
                    <button
                      onClick={(e) => handleRemoveDoctor(doctor.id, e)}
                      title="Remove Doctor"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doctor.email}
                  </p>
                  <div style={{ marginTop: '6px' }}>
                    <span className="badge-status badge-cyan" style={{ fontSize: '0.65rem' }}>
                      {doctor.specialization}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics & Badges */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem'
              }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>EXPERIENCE</span>
                  <span className="font-mono-telemetry" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {doctor.yearsExperience} Years Active
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>CASES GUIDED</span>
                  <span className="font-mono-telemetry" style={{ fontWeight: 600, color: '#10b981' }}>
                    {doctor.surgicalCasesCompleted}+ Navigated
                  </span>
                </div>
              </div>

              <div style={{ 
                marginTop: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#94a3b8'
              }}>
                <span className="font-mono-telemetry" style={{ color: '#64748b' }}>{doctor.licenseNumber}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                  <Award size={12} /> Optical Certified
                </span>
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
          <span>Back to Clinic Setup</span>
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={onContinue}
          style={{ padding: '12px 28px', fontSize: '0.95rem' }}
        >
          <span>Continue to Patient Profile Management</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
