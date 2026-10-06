export type Specialization = 
  | 'Implantologist'
  | 'Oral Surgeon'
  | 'Periodontist'
  | 'Endodontist'
  | 'General Dentist';

export type SurgeryType = 
  | 'Implant Placement'
  | 'Tooth Extraction'
  | 'Endodontic Surgery'
  | 'Bone Grafting'
  | 'Periodontal Surgery';

export type SurgicalStage = 
  | 'Initial Positioning'
  | 'Incision / Access'
  | 'Drilling / Osteotomy'
  | 'Tissue Manipulation'
  | 'Implant Placement'
  | 'Verification / Completion';

export type AnatomicalRegion = 
  | 'Maxilla (Upper Jaw)'
  | 'Mandible (Lower Jaw)'
  | 'Anterior Region'
  | 'Premolar Region'
  | 'Molar Region';

export type BoneDensityType = 'D1 (Dense Cortical)' | 'D2 (Thick Porous Cortical)' | 'D3 (Thin Porous Cortical)' | 'D4 (Fine Trabecular)';
export type BoneShapeType = 'Type A (Abundant)' | 'Type B (Barely Sufficient)' | 'Type C (Compromised)' | 'Type D (Deficient)';

export interface PatientAnatomy {
  boneDensity: BoneDensityType;
  boneShape: BoneShapeType;
  nerveLocation: string; // e.g. "Inferior Alveolar Canal 3.2mm inferior to planned apex"
  rootStructure: string; // e.g. "Dilacerated roots on adjacent #18"
  sinusPosition: string; // e.g. "Pneumatized sinus floor 1.8mm superior"
  existingConditions: string[]; // e.g. ["Immediate extraction socket", "Knife-edge crest", "Periapical radiolucency"]
}

export type InstrumentType = 
  | 'Surgical Drill'
  | 'Implant Driver'
  | 'Surgical Bur'
  | 'Forceps'
  | 'Scaler / Curette';

export interface InstrumentConfig {
  type: InstrumentType;
  model: string;
  diameterMm: number;
  lengthMm: number;
  rpmLimit: number;
  torqueLimitNcm: number;
  opticalTrackerCalibrated: boolean;
  irrigationRateMlMin: number;
}

export type RiskStructureType = 
  | 'Inferior Alveolar Nerve'
  | 'Mental Nerve'
  | 'Maxillary Sinus'
  | 'Adjacent Tooth Roots'
  | 'Bone Boundaries'
  | 'Blood Vessels';

export interface RiskZoneConfig {
  structure: RiskStructureType;
  enabled: boolean;
  safeMarginMm: number; // e.g. 1.5mm
  currentProximityMm?: number;
  alertLevel: 'safe' | 'caution' | 'critical';
  description: string;
}

// 1. Organization Setup Model
export interface ClinicSetup {
  clinicName: string;
  registrationNumber: string;
  regulatoryBody: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    orSuitesCount: number;
  };
  contact: {
    phone: string;
    emergencyLine: string;
    email: string;
    website: string;
  };
  adminAccount: {
    adminName: string;
    workEmail: string;
    securityClearance: 'Level 4 (Chief Administrator)' | 'Level 3 (Surgical Director)' | 'Level 2 (Biomedical Staff)';
    role: string;
    twoFactorEnabled: boolean;
  };
  setupCompleted: boolean;
}

// 2. Doctor Profile Model
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  specialization: Specialization;
  yearsExperience: number;
  licenseNumber: string;
  surgicalCasesCompleted: number;
  trackerCertified: boolean;
  assignedRoom: string;
}

// 3. Patient Profile Model
export interface PatientProfile {
  id: string;
  patientCode: string; // e.g. "PT-2026-8891"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory: string[];
  allergies: string[];
  previousProcedures: string[];
  cbctScanDate: string;
  cbctScanResolution: string;
  cbctScanStatus: 'Uploaded & Segmented' | 'Pending Segmentation' | 'Required';
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
}

// 4. Surgical Case Configuration Model
export interface SurgicalCaseConfig {
  id: string;
  caseNumber: string;
  patientId: string;
  doctorId: string;
  createdAt: string;
  scheduledDate: string;
  status: 'Draft' | 'Planned' | 'Navigation Active' | 'Completed';
  
  // Step 1: Surgery / Procedure Type
  surgeryType: SurgeryType;
  
  // Step 2: Surgical Stage
  surgicalStage: SurgicalStage;
  
  // Step 3: Anatomical Region
  anatomicalRegion: AnatomicalRegion;
  targetTeeth: number[]; // FDI tooth numbers e.g. [19] or [14, 15]
  quadrant: 'Upper Right (Q1)' | 'Upper Left (Q2)' | 'Lower Left (Q3)' | 'Lower Right (Q4)';
  
  // Step 4: Patient-Specific Anatomy
  anatomy: PatientAnatomy;
  
  // Step 5: Instrument Selection
  instrument: InstrumentConfig;
  
  // Step 6: Risk Structures / Safety Zones
  riskStructures: RiskZoneConfig[];
  
  // Summary & Mode
  navigationMode: string;
  plannedDepthMm: number;
  plannedTrajectoryAngleDeg: number;
  opticalFiducialsRequired: number;
}

export type ActiveTab = 
  | 'dashboard'
  | 'onboarding'
  | 'doctors'
  | 'patients'
  | 'cases'
  | 'navigation-session'
  | 'reports';
