# NaviDent AI™ — Real-Time Dental Surgical Navigation System
### Hospital-Grade Stereotactic Surgical Guidance Platform

NaviDent AI is a high-fidelity healthcare technology platform designed for real-time stereotactic dental and maxillofacial surgery. It incorporates sub-millimeter optical tool tracking, dynamic neurovascular hazard envelopes, multi-slice CBCT co-registration, and a clinic onboarding and case management workflow.

---

## 🏛 System Hierarchy & Workflow Architecture

The application follows the clinical governance hierarchy:

```
Level 1: Organization / Dental Clinic Setup
  ├── Clinic Identification & Regulatory Accreditation
  ├── Facility Location & OR Suites Infrastructure
  ├── 24/7 Emergency & Surgical Desk Contacts
  └── Clinic Administrator Account & 2FA Governance
       │
       ▼
Level 2: Doctor Profile Management
  ├── Doctor Name, Email & Profile Image
  ├── Specialization Selection (Implantologist, Oral Surgeon, Periodontist, Endodontist, General Dentist)
  ├── Years of Clinical Experience & License Numbers
  └── Optical Stereo-Tracker Certification & OR Suite Allocation
       │
       ▼
Level 3: Patient Profile Management
  ├── Patient ID (e.g., PT-2026-9042)
  ├── Demographic Profile (Name, Age, Gender)
  ├── Medical History & Systemic Contraindications
  ├── Previous Dental & Surgical Procedures
  ├── 3D CBCT Volumetric Scan Segmentation Status
  └── "Create New Surgical Case" Direct Trigger
       │
       ▼
Level 4: New Surgical Case Configuration Wizard (6 Steps)
  ├── Step 1: Surgery / Procedure Type (Implant Placement, Tooth Extraction, Endodontic Surgery, Bone Grafting, Periodontal Surgery)
  ├── Step 2: Surgical Stage (Initial Positioning, Incision / Access, Drilling / Osteotomy, Tissue Manipulation, Implant Placement, Verification)
  ├── Step 3: Anatomical Region & FDI Tooth Chart (Maxilla, Mandible, Anterior, Premolar, Molar)
  ├── Step 4: Patient-Specific Anatomy (Bone Density D1-D4, Morphology Type A-D, Nerve Offset, Root Structure, Sinus Proximity)
  ├── Step 5: Instrument Selection (Surgical Drill Ø2.0-Ø4.2mm, Implant Driver, Bur, Forceps, Curette, RPM & Torque Limits)
  └── Step 6: Risk Structures / Safety Zones (Inferior Alveolar Nerve, Mental Nerve, Maxillary Sinus, Adjacent Roots, Bone Boundaries, Blood Vessels)
       │
       ▼
Level 5: Navigation Configuration Summary Card
  ├── Generated Navigation Mode (e.g., PRECISE_SUB_MILLIMETER_OSTEOTOMY_LOCK)
  ├── Surgical Stage, Anatomy, Instrument & Safety Buffer Summary
  └── Action: Launch Real-Time 3D Navigation Session
       │
       ▼
Level 6: Real-Time 3D Surgical Navigation Theater (Three.js)
  ├── Interactive 3D Mandibular Arch & Tooth Root Meshes
  ├── Glowing Inferior Alveolar Nerve Canal & Maxillary Sinus Zones
  ├── Real-time Calibrated Drill Handpiece with 4-Fiducial IR Marker Array
  ├── Dynamic Telemetry: Depth Gauge, Angular Deviation (<2.0°), Proximity Warning
  ├── Tri-Planar CBCT Cross-Section Slices (Axial, Sagittal, Coronal)
  └── Acoustic Deceleration & Emergency Flashing HUD Alerts (<1.2mm)
```

---

## 🛠 Technology Stack Architecture

### 1. Frontend Client
- **Core**: React 19, TypeScript, Vite
- **3D Stereotactic Engine**: Three.js (Custom procedural bone shader, neural canal extrusion, drill probe tracking)
- **Styling**: Vanilla CSS tokens with high-tech surgical navy (`#050b14`), medical slate, and clinical light mode
- **Audio Telemetry**: Web Audio API synthesizer for acoustic distance beeps and proximity alarms
- **Icons**: Lucide React

### 2. Backend Services & Real-Time Telemetry
- **Java Spring Boot**:
  - Organization, Clinic Admin, Doctor credentials, Patient clinical records, and DICOM PACS ingestion
  - Spring Security with JWT & FIDO2 hardware authentication
- **FastAPI (Python)**:
  - Stereotactic coordinate transformation matrix calculations
  - Real-time 3D CBCT voxel segmentation using PyTorch / MONAI
- **WebSockets (`/ws/tracking/v1`)**:
  - High-frequency 60 FPS streaming of stereo IR optical tracking cameras (2.8ms latency)
  - Bi-directional handpiece micro-motor rpm/torque telecontrol

### 3. Data Storage & Persistence
- **PostgreSQL**:
  - Relational clinic setup, doctor profiles, surgical cases, and audit logs
  - PostGIS for 3D coordinate geometry points
- **AWS S3**:
  - High-resolution DICOM (.dcm) volumetric scan archives and pre-op STL surface models
- **MongoDB**:
  - Time-series surgical navigation telemetry logs (drill depth, angular deviation per millisecond)

---

## 🚀 Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://127.0.0.1:5173/`.

3. **Build for Production**:
   ```bash
   npm run build
   ```
