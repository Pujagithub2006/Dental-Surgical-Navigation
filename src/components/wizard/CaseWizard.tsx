import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Crosshair, 
  ShieldAlert, 
  Wrench, 
  Layers, 
  Activity, 
  Sparkles,
  AlertCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { 
  SurgicalCaseConfig, 
  SurgeryType, 
  SurgicalStage, 
  AnatomicalRegion, 
  BoneDensityType, 
  BoneShapeType, 
  InstrumentType, 
  RiskStructureType,
  PatientProfile,
  DoctorProfile,
  RiskZoneConfig
} from '../../types';
import { SummaryCard } from './SummaryCard';

interface CaseWizardProps {
  initialConfig?: Partial<SurgicalCaseConfig>;
  patient: PatientProfile;
  doctor: DoctorProfile;
  onSaveCase: (config: SurgicalCaseConfig) => void;
  onLaunchNavigation: (config: SurgicalCaseConfig) => void;
  onCancel: () => void;
}

const surgeryTypes: { type: SurgeryType; desc: string; icon: string }[] = [
  { type: 'Implant Placement', desc: 'Stereotactic guided osteotomy & digital fixture insertion with depth lock', icon: '🔩' },
  { type: 'Tooth Extraction', desc: 'Minimally invasive atraumatic extraction preserving cortical bone envelope', icon: '🦷' },
  { type: 'Endodontic Surgery', desc: 'Navigated apicoectomy & retrograde root-end resection with microscopic precision', icon: '🔬' },
  { type: 'Bone Grafting', desc: 'Guided sinus elevation, ridge augmentation & autologous/allograft positioning', icon: '🧱' },
  { type: 'Periodontal Surgery', desc: 'Micro-surgical crown lengthening, osseous recontouring & soft tissue mucogingival flaps', icon: '🌿' },
];

const surgicalStages: { stage: SurgicalStage; desc: string; order: number }[] = [
  { stage: 'Initial Positioning', desc: 'Patient-to-tracker stereotactic registration & optical probe calibration', order: 1 },
  { stage: 'Incision / Access', desc: 'Dynamic mucoperiosteal flap guidance avoiding mental/palatine vessels', order: 2 },
  { stage: 'Drilling / Osteotomy', desc: 'Real-time multi-angle drill trajectory with depth stop & safety margin alarm', order: 3 },
  { stage: 'Tissue Manipulation', desc: 'Subperiosteal tunnel reflection, sinus membrane elevation', order: 4 },
  { stage: 'Implant Placement', desc: 'Torque-monitored fixture drive, apex orientation & hex index verification', order: 5 },
  { stage: 'Verification / Completion', desc: 'Post-op 3D stereotactic alignment check, CBCT co-registration audit', order: 6 },
];

const anatomicalRegions: { region: AnatomicalRegion; defaultQuadrant: string; desc: string }[] = [
  { region: 'Maxilla (Upper Jaw)', defaultQuadrant: 'Upper Right (Q1)', desc: 'Sinus floor, nasopalatine canal, zygomatic buttress' },
  { region: 'Mandible (Lower Jaw)', defaultQuadrant: 'Lower Left (Q3)', desc: 'Inferior alveolar canal, mental foramen, lingual concavity' },
  { region: 'Anterior Region', defaultQuadrant: 'Upper Front', desc: 'Incisive canal, facial cortical plate thinness' },
  { region: 'Premolar Region', defaultQuadrant: 'Lower Left (Q3)', desc: 'Proximity to mental foramen loop, bicuspid root divergence' },
  { region: 'Molar Region', defaultQuadrant: 'Lower Left (Q3)', desc: 'Deep mandibular canal, maxillary sinus pneumatization' },
];

const instruments: { type: InstrumentType; defaultModel: string; defaultDia: number; defaultLen: number; rpm: number; torque: number }[] = [
  { type: 'Surgical Drill', defaultModel: 'NaviDrill Pro Optical 2.8x11.5mm', defaultDia: 2.8, defaultLen: 11.5, rpm: 800, torque: 35 },
  { type: 'Implant Driver', defaultModel: 'HexDrive Smart-Torque 3.5/4.3', defaultDia: 3.5, defaultLen: 10.0, rpm: 25, torque: 45 },
  { type: 'Surgical Bur', defaultModel: 'Lindemann Side-Cutting Bur Ø2.0', defaultDia: 2.0, defaultLen: 14.0, rpm: 1200, torque: 20 },
  { type: 'Forceps', defaultModel: 'Atraumatic Luxating Forceps Q3', defaultDia: 4.0, defaultLen: 22.0, rpm: 0, torque: 0 },
  { type: 'Scaler / Curette', defaultModel: 'PiezoMicro Surgical Curette Tip', defaultDia: 1.5, defaultLen: 12.0, rpm: 0, torque: 0 },
];

export const CaseWizard: React.FC<CaseWizardProps> = ({
  patient,
  doctor,
  onSaveCase,
  onLaunchNavigation,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Wizard state: Step 1
  const [surgeryType, setSurgeryType] = useState<SurgeryType>('Implant Placement');

  // Step 2
  const [surgicalStage, setSurgicalStage] = useState<SurgicalStage>('Drilling / Osteotomy');

  // Step 3
  const [anatomicalRegion, setAnatomicalRegion] = useState<AnatomicalRegion>('Mandible (Lower Jaw)');
  const [selectedTooth, setSelectedTooth] = useState<number>(19);
  const [quadrant, setQuadrant] = useState<SurgicalCaseConfig['quadrant']>('Lower Left (Q3)');

  // Step 4
  const [boneDensity, setBoneDensity] = useState<BoneDensityType>('D2 (Thick Porous Cortical)');
  const [boneShape, setBoneShape] = useState<BoneShapeType>('Type A (Abundant)');
  const [nerveLocation, setNerveLocation] = useState<string>('Inferior Alveolar Canal located 3.8mm below planned apex');
  const [rootStructure, setRootStructure] = useState<string>('Divergent roots on adjacent molar #18 with 2.4mm safe clearance');
  const [sinusPosition, setSinusPosition] = useState<string>('Sub-antral floor pneumatization checked; adequate distance');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Healed socket with trabeculated bone',
    'Mild buccal plate resorption'
  ]);

  // Step 5
  const [instrumentType, setInstrumentType] = useState<InstrumentType>('Surgical Drill');
  const [drillDiameter, setDrillDiameter] = useState<number>(2.8);
  const [drillLength, setDrillLength] = useState<number>(11.5);
  const [rpmLimit, setRpmLimit] = useState<number>(800);
  const [torqueLimit, setTorqueLimit] = useState<number>(35);

  // Step 6
  const [riskZones, setRiskZones] = useState<RiskZoneConfig[]>([
    {
      structure: 'Inferior Alveolar Nerve',
      enabled: true,
      safeMarginMm: 2.0,
      currentProximityMm: 3.8,
      alertLevel: 'safe',
      description: 'Mandibular canal nerve bundle; continuous acoustic depth warning active below 2.0mm.'
    },
    {
      structure: 'Mental Nerve',
      enabled: true,
      safeMarginMm: 2.0,
      currentProximityMm: 5.2,
      alertLevel: 'safe',
      description: 'Mental foramen anterior loop monitoring.'
    },
    {
      structure: 'Maxillary Sinus',
      enabled: false,
      safeMarginMm: 1.5,
      currentProximityMm: 7.0,
      alertLevel: 'safe',
      description: 'Schneiderian sinus floor elevation threshold.'
    },
    {
      structure: 'Adjacent Tooth Roots',
      enabled: true,
      safeMarginMm: 1.5,
      currentProximityMm: 2.4,
      alertLevel: 'safe',
      description: 'Neighboring periodontal ligament clearance on #18 and #20.'
    },
    {
      structure: 'Bone Boundaries',
      enabled: true,
      safeMarginMm: 1.0,
      currentProximityMm: 1.9,
      alertLevel: 'safe',
      description: 'Buccal and lingual cortical plates containment boundary.'
    },
    {
      structure: 'Blood Vessels',
      enabled: false,
      safeMarginMm: 2.5,
      currentProximityMm: 6.5,
      alertLevel: 'safe',
      description: 'Sublingual and facial artery branches in lingual undercut.'
    }
  ]);

  const toggleRiskStructure = (structure: RiskStructureType) => {
    setRiskZones(riskZones.map(r => r.structure === structure ? { ...r, enabled: !r.enabled } : r));
  };

  const updateRiskMargin = (structure: RiskStructureType, margin: number) => {
    setRiskZones(riskZones.map(r => r.structure === structure ? { ...r, safeMarginMm: margin } : r));
  };

  // Compile final surgical case configuration
  const buildConfig = (): SurgicalCaseConfig => {
    // Generate dynamic navigation mode name based on inputs
    let generatedMode = 'OPTICAL_STEREOTACTIC_GUIDANCE_ACTIVE';
    if (surgeryType === 'Implant Placement') {
      generatedMode = 'PRECISE_SUB_MILLIMETER_OSTEOTOMY_LOCK';
    } else if (surgeryType === 'Bone Grafting') {
      generatedMode = 'SINUS_FLOOR_PROXIMITY_MAPPING_V3';
    } else if (surgeryType === 'Endodontic Surgery') {
      generatedMode = 'MICRO_APICOECTOMY_RETRO_NAV';
    }

    return {
      id: `case-${Date.now()}`,
      caseNumber: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patient.id,
      doctorId: doctor.id,
      createdAt: '2026-10-06 09:30 AM',
      scheduledDate: '2026-10-07 10:00 AM',
      status: 'Planned',
      surgeryType,
      surgicalStage,
      anatomicalRegion,
      targetTeeth: [selectedTooth],
      quadrant,
      anatomy: {
        boneDensity,
        boneShape,
        nerveLocation,
        rootStructure,
        sinusPosition,
        existingConditions: selectedConditions
      },
      instrument: {
        type: instrumentType,
        model: `NaviGuide ${instrumentType} Series-X`,
        diameterMm: drillDiameter,
        lengthMm: drillLength,
        rpmLimit,
        torqueLimitNcm: torqueLimit,
        opticalTrackerCalibrated: true,
        irrigationRateMlMin: 45
      },
      riskStructures: riskZones,
      navigationMode: generatedMode,
      plannedDepthMm: drillLength,
      plannedTrajectoryAngleDeg: 8.5,
      opticalFiducialsRequired: 4
    };
  };

  const handleFinishWizard = () => {
    const config = buildConfig();
    onSaveCase(config);
    setIsCompleted(true);
  };

  // Steps breadcrumb
  const stepsList = [
    { number: 1, title: 'Surgery Type' },
    { number: 2, title: 'Surgical Stage' },
    { number: 3, title: 'Anatomical Region' },
    { number: 4, title: 'Patient Anatomy' },
    { number: 5, title: 'Instrument' },
    { number: 6, title: 'Safety Zones' },
  ];

  if (isCompleted) {
    const config = buildConfig();
    return (
      <SummaryCard
        config={config}
        patient={patient}
        doctor={doctor}
        onEditStep={(step) => {
          setIsCompleted(false);
          setCurrentStep(step);
        }}
        onLaunchNavigation={() => onLaunchNavigation(config)}
      />
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Wizard Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-cyan">Hierarchy Level 4</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Real-Time Navigation Configuration Wizard</span>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Patient: <strong style={{ color: 'var(--text-primary)' }}>{patient.name}</strong> • Surgeon: <strong style={{ color: 'var(--text-primary)' }}>{doctor.name}</strong>
          </span>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>New Surgical Case Configuration</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Configure optical navigation parameters, anatomical risk thresholds, and stereotactic instrument guidance.
        </p>
      </div>

      {/* Step Progress Indicators */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(6, 1fr)', 
        gap: '8px', 
        marginBottom: '28px',
        padding: '12px 14px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px'
      }}>
        {stepsList.map(step => {
          const isCurrent = currentStep === step.number;
          const isDone = currentStep > step.number;
          return (
            <div
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                opacity: isCurrent || isDone ? 1 : 0.45,
                transition: 'opacity 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isCurrent 
                  ? '#00d4ff' 
                  : isDone 
                  ? 'rgba(16, 185, 129, 0.25)' 
                  : 'var(--bg-surface)',
                color: isCurrent 
                  ? '#050b14' 
                  : isDone 
                  ? '#10b981' 
                  : 'var(--text-secondary)',
                border: isDone ? '1px solid #10b981' : isCurrent ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.75rem',
                flexShrink: 0
              }}>
                {isDone ? <Check size={14} strokeWidth={3} /> : step.number}
              </div>

              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.625rem', 
                  color: isCurrent ? '#00d4ff' : '#64748b', 
                  fontWeight: 700, 
                  textTransform: 'uppercase' 
                }}>
                  STEP {step.number}
                </span>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="medical-card" style={{ padding: '28px', marginBottom: '24px' }}>
        {/* STEP 1: Surgery / Procedure Type */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 1 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Surgery / Procedure Type</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Select the surgical intervention protocol. NaviDent AI initializes appropriate tracking tolerances and coordinate reference frames.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {surgeryTypes.map(item => {
                const isSelected = surgeryType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setSurgeryType(item.type)}
                    className={`medical-card-interactive ${isSelected ? 'medical-card-selected' : ''}`}
                    style={{ padding: '18px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? '#00d4ff' : 'var(--text-primary)' }}>
                          {item.type}
                        </h4>
                      </div>
                      {isSelected && <CheckCircle2 size={18} color="#00d4ff" />}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Surgical Stage */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 2 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Surgical Stage</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Select the initial operational phase. The navigation HUD dynamically changes its depth tracking and acoustic alerts based on the current stage.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {surgicalStages.map(stageItem => {
                const isSelected = surgicalStage === stageItem.stage;
                return (
                  <div
                    key={stageItem.stage}
                    onClick={() => setSurgicalStage(stageItem.stage)}
                    className={`medical-card-interactive ${isSelected ? 'medical-card-selected' : ''}`}
                    style={{ padding: '16px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="font-mono-telemetry" style={{ 
                        fontSize: '0.7rem', 
                        color: isSelected ? '#00d4ff' : '#64748b', 
                        fontWeight: 700 
                      }}>
                        STAGE 0{stageItem.order}
                      </span>
                      {isSelected && <CheckCircle2 size={18} color="#00d4ff" />}
                    </div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '4px', color: isSelected ? '#00d4ff' : 'var(--text-primary)' }}>
                      {stageItem.stage}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.35 }}>
                      {stageItem.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Anatomical Region */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 3 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Anatomical Region & Target Site</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Specify the jaw arch, anatomical sector, and surgical site tooth numbers for registration alignment.
            </p>

            {/* Region Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {anatomicalRegions.map(reg => {
                const isSelected = anatomicalRegion === reg.region;
                return (
                  <div
                    key={reg.region}
                    onClick={() => {
                      setAnatomicalRegion(reg.region);
                      if (reg.region === 'Maxilla (Upper Jaw)') {
                        setSelectedTooth(14);
                        setQuadrant('Upper Left (Q2)');
                      } else {
                        setSelectedTooth(19);
                        setQuadrant('Lower Left (Q3)');
                      }
                    }}
                    className={`medical-card-interactive ${isSelected ? 'medical-card-selected' : ''}`}
                    style={{ padding: '14px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#00d4ff' : 'var(--text-primary)' }}>
                        {reg.region}
                      </span>
                      {isSelected && <Check size={16} color="#00d4ff" />}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {reg.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Dental Tooth Chart */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interactive FDI Dental Tooth Chart</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click tooth to calibrate stereotactic osteotomy target</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Selected Tooth:</span>
                  <span className="font-mono-telemetry" style={{ 
                    fontSize: '0.9rem', 
                    background: 'rgba(0, 212, 255, 0.15)', 
                    color: '#00d4ff', 
                    padding: '2px 10px', 
                    borderRadius: '6px', 
                    fontWeight: 700 
                  }}>
                    #{selectedTooth} ({quadrant})
                  </span>
                </div>
              </div>

              {/* Upper Arch (Maxilla) */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '6px' }}>
                  MAXILLARY ARCH (UPPER)
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(toothNum => (
                    <button
                      key={toothNum}
                      type="button"
                      onClick={() => {
                        setSelectedTooth(toothNum);
                        setAnatomicalRegion('Maxilla (Upper Jaw)');
                        setQuadrant(toothNum <= 18 ? 'Upper Right (Q1)' : 'Upper Left (Q2)');
                      }}
                      style={{
                        width: '36px',
                        height: '42px',
                        borderRadius: '6px',
                        background: selectedTooth === toothNum ? '#00d4ff' : 'var(--bg-secondary)',
                        color: selectedTooth === toothNum ? '#050b14' : 'var(--text-secondary)',
                        border: selectedTooth === toothNum ? '2px solid #00d4ff' : '1px solid var(--border-subtle)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {toothNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Arch (Mandible) */}
              <div>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '6px' }}>
                  MANDIBULAR ARCH (LOWER)
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(toothNum => (
                    <button
                      key={toothNum}
                      type="button"
                      onClick={() => {
                        setSelectedTooth(toothNum);
                        setAnatomicalRegion('Mandible (Lower Jaw)');
                        setQuadrant(toothNum >= 41 ? 'Lower Right (Q4)' : 'Lower Left (Q3)');
                      }}
                      style={{
                        width: '36px',
                        height: '42px',
                        borderRadius: '6px',
                        background: selectedTooth === toothNum ? '#00d4ff' : 'var(--bg-secondary)',
                        color: selectedTooth === toothNum ? '#050b14' : 'var(--text-secondary)',
                        border: selectedTooth === toothNum ? '2px solid #00d4ff' : '1px solid var(--border-subtle)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {toothNum}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Patient-Specific Anatomy */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 4 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Patient-Specific Anatomy</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Define radiographic bone morphology, trabecular density, and proximity landmarks segmented from CBCT DICOM dataset.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
              {/* Bone Density (Misch Classification) */}
              <div>
                <label className="form-label">Bone Density (Misch Classification) *</label>
                <select
                  className="form-input"
                  value={boneDensity}
                  onChange={e => setBoneDensity(e.target.value as BoneDensityType)}
                >
                  <option value="D1 (Dense Cortical)">D1 (Dense Cortical &gt;1250 HU - Anterior Mandible)</option>
                  <option value="D2 (Thick Porous Cortical)">D2 (Thick Porous Cortical 850-1250 HU - Mandible/Maxilla)</option>
                  <option value="D3 (Thin Porous Cortical)">D3 (Thin Porous Cortical 350-850 HU - Posterior Maxilla)</option>
                  <option value="D4 (Fine Trabecular)">D4 (Fine Trabecular 150-350 HU - Soft Tuberosity)</option>
                </select>
              </div>

              {/* Bone Shape / Ridge Width */}
              <div>
                <label className="form-label">Bone Morphology / Ridge Envelope *</label>
                <select
                  className="form-input"
                  value={boneShape}
                  onChange={e => setBoneShape(e.target.value as BoneShapeType)}
                >
                  <option value="Type A (Abundant)">Type A: Abundant bone (&gt;6mm width, &gt;12mm height)</option>
                  <option value="Type B (Barely Sufficient)">Type B: Barely sufficient (5-6mm width, 10-12mm height)</option>
                  <option value="Type C (Compromised)">Type C: Compromised ridge (&lt;5mm width, graft recommended)</option>
                  <option value="Type D (Deficient)">Type D: Severe basal atrophy (severe deficiency)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
              <div>
                <label className="form-label">Nerve Location & Canal Offset</label>
                <input
                  type="text"
                  className="form-input"
                  value={nerveLocation}
                  onChange={e => setNerveLocation(e.target.value)}
                  placeholder="e.g. Inferior alveolar canal 3.8mm below apex"
                />
              </div>

              <div>
                <label className="form-label">Maxillary Sinus Position</label>
                <input
                  type="text"
                  className="form-input"
                  value={sinusPosition}
                  onChange={e => setSinusPosition(e.target.value)}
                  placeholder="e.g. Pneumatized sinus floor, 4.2mm residual ridge"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Root Structure (Adjacent Teeth)</label>
              <input
                type="text"
                className="form-input"
                style={{ marginBottom: '18px' }}
                value={rootStructure}
                onChange={e => setRootStructure(e.target.value)}
                placeholder="e.g. Dilacerated mesial root on #18"
              />
            </div>

            {/* Existing Anatomical Conditions checkboxes */}
            <div>
              <label className="form-label">Existing Anatomical Conditions</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {[
                  'Healed socket with trabeculated bone',
                  'Immediate post-extraction socket',
                  'Mild buccal plate resorption',
                  'Knife-edge alveolar crest',
                  'Schneiderian membrane septa',
                  'Periapical osteolytic lesion'
                ].map((condition) => {
                  const checked = selectedConditions.includes(condition);
                  return (
                    <div
                      key={condition}
                      onClick={() => {
                        if (checked) {
                          setSelectedConditions(selectedConditions.filter(c => c !== condition));
                        } else {
                          setSelectedConditions([...selectedConditions, condition]);
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        background: checked ? 'rgba(0, 212, 255, 0.1)' : 'var(--bg-surface)',
                        border: checked ? '1px solid #00d4ff' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: checked ? '#00d4ff' : 'var(--text-secondary)'
                      }}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: checked ? '1px solid #00d4ff' : '1px solid #64748b',
                        background: checked ? '#00d4ff' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#050b14',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}>
                        {checked && '✓'}
                      </div>
                      <span>{condition}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Instrument Selection */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 5 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Instrument Selection</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Choose calibrated stereotactic handpiece tool, bur diameter, depth stopper length, and motor torque limits.
            </p>

            {/* Instrument Type Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {instruments.map(inst => {
                const isSelected = instrumentType === inst.type;
                return (
                  <div
                    key={inst.type}
                    onClick={() => {
                      setInstrumentType(inst.type);
                      setDrillDiameter(inst.defaultDia);
                      setDrillLength(inst.defaultLen);
                      setRpmLimit(inst.rpm);
                      setTorqueLimit(inst.torque);
                    }}
                    className={`medical-card-interactive ${isSelected ? 'medical-card-selected' : ''}`}
                    style={{ padding: '14px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? '#00d4ff' : 'var(--text-primary)' }}>
                        {inst.type}
                      </span>
                      {isSelected && <Check size={16} color="#00d4ff" />}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {inst.defaultModel}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Handpiece Caliber & Telemetry Controls */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={18} color="#00d4ff" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Calibrated Instrument Specs</h4>
                </div>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#10b981', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  <CheckCircle2 size={14} /> OPTICAL TRACKER PAIRING VERIFIED
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label className="form-label">Drill / Bur Caliber (Ø mm)</label>
                  <select
                    className="form-input font-mono-telemetry"
                    value={drillDiameter}
                    onChange={e => setDrillDiameter(parseFloat(e.target.value))}
                  >
                    <option value="2.0">Ø 2.0 mm (Pilot Drill)</option>
                    <option value="2.8">Ø 2.8 mm (Twist Drill)</option>
                    <option value="3.2">Ø 3.2 mm (Osteotomy Former)</option>
                    <option value="3.65">Ø 3.65 mm (Dense Bone Shaper)</option>
                    <option value="4.2">Ø 4.2 mm (Final Profile Drill)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Planned Stopper Length (mm)</label>
                  <select
                    className="form-input font-mono-telemetry"
                    value={drillLength}
                    onChange={e => setDrillLength(parseFloat(e.target.value))}
                  >
                    <option value="8.0">8.0 mm</option>
                    <option value="10.0">10.0 mm</option>
                    <option value="11.5">11.5 mm (Standard Mandible)</option>
                    <option value="13.0">13.0 mm</option>
                    <option value="16.0">16.0 mm (Zygomatic)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Handpiece RPM Threshold</label>
                  <input
                    type="number"
                    className="form-input font-mono-telemetry"
                    value={rpmLimit}
                    onChange={e => setRpmLimit(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="form-label">Max Torque Limit (N·cm)</label>
                  <input
                    type="number"
                    className="form-input font-mono-telemetry"
                    value={torqueLimit}
                    onChange={e => setTorqueLimit(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Risk Structures / Safety Zones */}
        {currentStep === 6 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">Step 6 of 6</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Risk Structures / Safety Zones</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Select critical neurovascular and anatomical structures to monitor. The system enforces dynamic visual overlays and emergency acoustic alarms.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '14px' }}>
              {riskZones.map(risk => {
                return (
                  <div
                    key={risk.structure}
                    style={{
                      background: risk.enabled ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                      border: risk.enabled ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={risk.enabled}
                          onChange={() => toggleRiskStructure(risk.structure)}
                          style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#00d4ff' }}
                        />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: risk.enabled ? '#fbbf24' : 'var(--text-secondary)' }}>
                          {risk.structure}
                        </h4>
                      </div>

                      {risk.enabled && (
                        <span className="badge-status badge-amber" style={{ fontSize: '0.65rem' }}>
                          MONITORED
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.3 }}>
                      {risk.description}
                    </p>

                    {risk.enabled && (
                      <div style={{
                        background: 'rgba(5, 11, 20, 0.7)',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Safe Zone Buffer:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="range"
                            min="0.5"
                            max="4.0"
                            step="0.5"
                            value={risk.safeMarginMm}
                            onChange={e => updateRiskMargin(risk.structure, parseFloat(e.target.value))}
                            style={{ width: '80px', accentColor: '#f59e0b', cursor: 'pointer' }}
                          />
                          <span className="font-mono-telemetry" style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, minWidth: '46px' }}>
                            {risk.safeMarginMm.toFixed(1)} mm
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Wizard Footer Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft size={16} />
              <span>Previous Step</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              <span>Back to Patients</span>
            </button>
          )}
        </div>

        <div>
          {currentStep < 6 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ padding: '12px 26px' }}
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleFinishWizard}
              style={{ 
                padding: '12px 28px', 
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #10b981 0%, #00d4ff 100%)',
                color: '#050b14',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
              }}
            >
              <Sparkles size={18} />
              <span>Generate Navigation Configuration Summary</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
