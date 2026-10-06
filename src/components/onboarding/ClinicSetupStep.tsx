import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { ClinicSetup } from '../../types';

interface ClinicSetupStepProps {
  clinicData: ClinicSetup;
  onSaveAndContinue: (data: ClinicSetup) => void;
}

export const ClinicSetupStep: React.FC<ClinicSetupStepProps> = ({
  clinicData,
  onSaveAndContinue
}) => {
  const [formData, setFormData] = useState<ClinicSetup>(clinicData);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      onSaveAndContinue({ ...formData, setupCompleted: true });
    }, 400);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">Hierarchy Level 1</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Institutional Profile & Infrastructure</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Organization / Dental Clinic Setup</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Configure institution credentials, surgical OR operating suites, regulatory accreditation, and system administrative authority.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Clinic Identification */}
        <div className="medical-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Building2 size={20} color="#00d4ff" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Clinic Name & Registration Details</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Dental Institute / Clinic Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.clinicName}
                onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                placeholder="e.g. Apex Precision Dental & Maxillofacial Institute"
              />
            </div>

            <div>
              <label className="form-label">Clinic Registration Number *</label>
              <input
                type="text"
                className="form-input font-mono-telemetry"
                required
                value={formData.registrationNumber}
                onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="MED-OR-88219-DX"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Accreditation & Regulatory Body</label>
            <input
              type="text"
              className="form-input"
              value={formData.regulatoryBody}
              onChange={e => setFormData({ ...formData, regulatoryBody: e.target.value })}
              placeholder="e.g. State Board of Dental Examiners & AAOMS Stereotactic Surgery Certified"
            />
          </div>
        </div>

        {/* Section 2: Location & OR Infrastructure */}
        <div className="medical-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <MapPin size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Location & Surgical Facilities</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.location.address}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, address: e.target.value } 
                })}
                placeholder="742 Healthcare Boulevard, Suite 500"
              />
            </div>

            <div>
              <label className="form-label">Surgical OR Suites Count *</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-input font-mono-telemetry"
                required
                value={formData.location.orSuitesCount}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, orSuitesCount: parseInt(e.target.value) || 1 } 
                })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.location.city}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, city: e.target.value } 
                })}
              />
            </div>
            <div>
              <label className="form-label">State / Province *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.location.state}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, state: e.target.value } 
                })}
              />
            </div>
            <div>
              <label className="form-label">Postal Code *</label>
              <input
                type="text"
                className="form-input font-mono-telemetry"
                required
                value={formData.location.postalCode}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, postalCode: e.target.value } 
                })}
              />
            </div>
            <div>
              <label className="form-label">Country *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.location.country}
                onChange={e => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, country: e.target.value } 
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Information */}
        <div className="medical-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Phone size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Contact Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Primary Surgical Desk Phone *</label>
              <input
                type="text"
                className="form-input font-mono-telemetry"
                required
                value={formData.contact.phone}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, phone: e.target.value } 
                })}
                placeholder="+1 (617) 555-0194"
              />
            </div>

            <div>
              <label className="form-label">24/7 Emergency Surgical Line *</label>
              <input
                type="text"
                className="form-input font-mono-telemetry"
                required
                value={formData.contact.emergencyLine}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, emergencyLine: e.target.value } 
                })}
                placeholder="+1 (617) 555-0911"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Clinic Official Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.contact.email}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, email: e.target.value } 
                })}
                placeholder="surgical-ops@apexprecisiondental.org"
              />
            </div>

            <div>
              <label className="form-label">Web / DICOM Portal Link</label>
              <input
                type="text"
                className="form-input"
                value={formData.contact.website}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact, website: e.target.value } 
                })}
                placeholder="https://navigation.apexprecisiondental.org"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Clinic Administrator Account */}
        <div className="medical-card" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <ShieldCheck size={20} color="#a78bfa" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Clinic Administrator Account</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Administrator Full Name & Credentials *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.adminAccount.adminName}
                onChange={e => setFormData({ 
                  ...formData, 
                  adminAccount: { ...formData.adminAccount, adminName: e.target.value } 
                })}
                placeholder="Dr. Kimberly Vance, DDS, MS, FACS"
              />
            </div>

            <div>
              <label className="form-label">Administrator Work Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.adminAccount.workEmail}
                onChange={e => setFormData({ 
                  ...formData, 
                  adminAccount: { ...formData.adminAccount, workEmail: e.target.value } 
                })}
                placeholder="k.vance@apexprecisiondental.org"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
            <div>
              <label className="form-label">Security Clearance Level</label>
              <select
                className="form-input"
                value={formData.adminAccount.securityClearance}
                onChange={e => setFormData({ 
                  ...formData, 
                  adminAccount: { 
                    ...formData.adminAccount, 
                    securityClearance: e.target.value as ClinicSetup['adminAccount']['securityClearance'] 
                  } 
                })}
              >
                <option value="Level 4 (Chief Administrator)">Level 4 (Chief Administrator - Full Surgical Override)</option>
                <option value="Level 3 (Surgical Director)">Level 3 (Surgical Director - Case Approval & Planning)</option>
                <option value="Level 2 (Biomedical Staff)">Level 2 (Biomedical Staff - Calibration & PACS Sync)</option>
              </select>
            </div>

            <div style={{ 
              marginTop: '22px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" />
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', display: 'block' }}>
                  Two-Factor Authentication (2FA) Active
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FIDO2 / WebAuthn Hardware Key Required for OR Launch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <span>Save Clinic Setup & Proceed to Doctor Profiles</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
