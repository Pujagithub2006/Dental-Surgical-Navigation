import React, { useState, useEffect } from 'react';
import { 
  ClinicSetup, 
  DoctorProfile, 
  PatientProfile, 
  SurgicalCaseConfig, 
  ActiveTab 
} from './types';
import { 
  initialClinicSetup, 
  sampleDoctors, 
  samplePatients, 
  sampleCases 
} from './data/mockData';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/views/DashboardView';
import { DoctorsView } from './components/views/DoctorsView';
import { PatientsView } from './components/views/PatientsView';
import { CasesView } from './components/views/CasesView';
import { ReportsView } from './components/views/ReportsView';
import { OnboardingMaster } from './components/onboarding/OnboardingMaster';
import { SurgicalNavigationTheater } from './components/navigation3d/SurgicalNavigationTheater';
import { CaseWizard } from './components/wizard/CaseWizard';

export const App: React.FC = () => {
  // Global State
  const [clinic, setClinic] = useState<ClinicSetup>(initialClinicSetup);
  const [doctors, setDoctors] = useState<DoctorProfile[]>(sampleDoctors);
  const [patients, setPatients] = useState<PatientProfile[]>(samplePatients);
  const [cases, setCases] = useState<SurgicalCaseConfig[]>(sampleCases);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile>(sampleDoctors[0]);
  const [currentCase, setCurrentCase] = useState<SurgicalCaseConfig>(sampleCases[0]);

  // Modal / Wizard overlay for New Surgical Case
  const [wizardPatient, setWizardPatient] = useState<PatientProfile | null>(null);

  // App Theme: 'dark' (Hospital Surgical Theater Navy) or 'light' (Clinical Consultation)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [audioAlarmEnabled, setAudioAlarmEnabled] = useState<boolean>(true);

  // Apply theme data attribute to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handler: Start New Case Wizard from anywhere
  const handleStartNewCase = (patient?: PatientProfile) => {
    setWizardPatient(patient || patients[0]);
    setActiveTab('onboarding');
  };

  // Handler: Launch Live Navigation Session
  const handleLaunchNavigation = (caseConfig: SurgicalCaseConfig) => {
    setCurrentCase(caseConfig);
    setActiveTab('navigation-session');
    setWizardPatient(null);
  };

  // Handler: Save New or Updated Case
  const handleSaveCase = (newCase: SurgicalCaseConfig) => {
    setCases(prev => {
      const exists = prev.findIndex(c => c.id === newCase.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = newCase;
        return updated;
      }
      return [newCase, ...prev];
    });
  };

  const activePatientForCurrentCase = patients.find(p => p.id === currentCase.patientId) || patients[0];
  const activeDoctorForCurrentCase = doctors.find(d => d.id === currentCase.doctorId) || doctors[0];

  return (
    <div className="app-container">
      {/* 1. Left Sidebar Navigation */}
      <NavigationSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinic={clinic}
        activeCaseCount={cases.filter(c => c.status === 'Planned' || c.status === 'Navigation Active').length}
      />

      {/* 2. Main Workspace */}
      <div className="main-content">
        {/* Top Navbar */}
        <TopHeader
          currentDoctor={currentDoctor}
          doctors={doctors}
          onSelectDoctor={setCurrentDoctor}
          onOpenNewCase={() => handleStartNewCase()}
          theme={theme}
          setTheme={setTheme}
          audioAlarmEnabled={audioAlarmEnabled}
          setAudioAlarmEnabled={setAudioAlarmEnabled}
        />

        {/* View Routing */}
        <main style={{ flex: 1, minHeight: 0 }}>
          {activeTab === 'dashboard' && (
            <DashboardView
              clinic={clinic}
              doctors={doctors}
              patients={patients}
              cases={cases}
              onOpenCase={handleLaunchNavigation}
              onLaunchNewCaseWizard={() => handleStartNewCase()}
              onNavigateToOnboarding={() => setActiveTab('onboarding')}
            />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingMaster
              clinic={clinic}
              onUpdateClinic={setClinic}
              doctors={doctors}
              onUpdateDoctors={setDoctors}
              patients={patients}
              onUpdatePatients={setPatients}
              onSaveCase={handleSaveCase}
              onLaunchNavigation={handleLaunchNavigation}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView
              doctors={doctors}
              onOpenDoctorSetup={() => setActiveTab('onboarding')}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onCreateNewCase={(patient) => handleStartNewCase(patient)}
              onOpenPatientSetup={() => setActiveTab('onboarding')}
            />
          )}

          {activeTab === 'cases' && (
            <CasesView
              cases={cases}
              patients={patients}
              doctors={doctors}
              onOpenCase={handleLaunchNavigation}
              onLaunchNewCaseWizard={() => handleStartNewCase()}
            />
          )}

          {activeTab === 'navigation-session' && (
            <SurgicalNavigationTheater
              caseConfig={currentCase}
              patient={activePatientForCurrentCase}
              doctor={activeDoctorForCurrentCase}
              audioAlarmEnabled={audioAlarmEnabled}
              onExitNavigation={() => setActiveTab('cases')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              cases={cases}
              patients={patients}
              doctors={doctors}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
