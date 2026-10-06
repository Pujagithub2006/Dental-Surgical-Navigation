import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Crosshair, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Radio, 
  Cpu, 
  Activity,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { SurgicalCaseConfig, PatientProfile, DoctorProfile } from '../../types';

interface SurgicalNavigationTheaterProps {
  caseConfig: SurgicalCaseConfig;
  patient: PatientProfile;
  doctor: DoctorProfile;
  audioAlarmEnabled: boolean;
  onExitNavigation: () => void;
}

export const SurgicalNavigationTheater: React.FC<SurgicalNavigationTheaterProps> = ({
  caseConfig,
  patient,
  doctor,
  audioAlarmEnabled,
  onExitNavigation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Real-time telemetry state
  const [drillDepthMm, setDrillDepthMm] = useState<number>(5.2);
  const [targetDepthMm] = useState<number>(caseConfig.plannedDepthMm || 11.5);
  const [angularDeviationDeg, setAngularDeviationDeg] = useState<number>(0.8);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeStage, setActiveStage] = useState<string>(caseConfig.surgicalStage || 'Drilling / Osteotomy');
  const [boneOpacity, setBoneOpacity] = useState<number>(0.65);
  const [selectedViewport, setSelectedViewport] = useState<'3D' | 'Multi-Planar'>('3D');

  // References for Three.js animations
  const drillGroupRef = useRef<THREE.Group | null>(null);
  const boneMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Calculate distance to Inferior Alveolar Nerve dynamically
  // For targetDepth 11.5mm, nerve is at ~14.5mm below crest.
  // When drillDepth is 0, distance is 14.5mm. When drillDepth is 11.5, distance is 3.0mm.
  const nerveDepthMm = 14.5;
  const currentNerveProximityMm = Math.max(0.2, +(nerveDepthMm - drillDepthMm).toFixed(2));
  
  const isCaution = currentNerveProximityMm < 2.5 && currentNerveProximityMm >= 1.2;
  const isCritical = currentNerveProximityMm < 1.2;

  // Sound generator for surgical navigation proximity beep
  const playAlertBeep = (freq: number) => {
    if (!audioAlarmEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isCritical ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (err) {
      // Audio autoplay policy handled
    }
  };

  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 32);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const surgicalSpot = new THREE.DirectionalLight(0x00d4ff, 2.5);
    surgicalSpot.position.set(10, 30, 20);
    surgicalSpot.castShadow = true;
    scene.add(surgicalSpot);

    const warmFill = new THREE.DirectionalLight(0xffffff, 1.2);
    warmFill.position.set(-15, 20, -10);
    scene.add(warmFill);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x00d4ff, 0x1e3256);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // 1. Mandibular Alveolar Bone Arch (Curved semi-ellipse bone)
    const boneShape = new THREE.Shape();
    // Generate curved mandibular ridge
    boneShape.moveTo(-12, -4);
    boneShape.quadraticCurveTo(-14, 2, -7, 8);
    boneShape.quadraticCurveTo(0, 11, 7, 8);
    boneShape.quadraticCurveTo(14, 2, 12, -4);
    boneShape.lineTo(9, -4);
    boneShape.quadraticCurveTo(10, 1, 5, 5);
    boneShape.quadraticCurveTo(0, 7, -5, 5);
    boneShape.quadraticCurveTo(-10, 1, -9, -4);
    boneShape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 9,
      bevelEnabled: true,
      bevelThickness: 1.2,
      bevelSize: 1,
      bevelSegments: 4,
    };

    const boneGeometry = new THREE.ExtrudeGeometry(boneShape, extrudeSettings);
    boneGeometry.rotateX(-Math.PI / 2);
    boneGeometry.center();

    const boneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xebf2fa,
      roughness: 0.35,
      metalness: 0.05,
      transmission: 0.45,
      opacity: boneOpacity,
      transparent: true,
      ior: 1.45,
      wireframe: false,
    });
    boneMaterialRef.current = boneMaterial;

    const boneMesh = new THREE.Mesh(boneGeometry, boneMaterial);
    boneMesh.position.set(0, -2, 0);
    boneMesh.receiveShadow = true;
    scene.add(boneMesh);

    // 2. Teeth crowns along the arch
    const toothGeo = new THREE.CylinderGeometry(1.2, 1.4, 3.2, 12);
    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.1,
    });

    // Create 10 tooth positions along mandibular curve
    const toothPositions = [
      { x: -9.5, z: -3.5, rot: 0.3, id: 47 },
      { x: -7.5, z: 0.5, rot: 0.5, id: 46 },
      { x: -5.0, z: 3.8, rot: 0.7, id: 45 },
      { x: -2.4, z: 5.6, rot: 0.9, id: 44 },
      { x: 0, z: 6.2, rot: 1.57, id: 41 },
      { x: 2.4, z: 5.6, rot: 2.2, id: 31 },
      { x: 5.0, z: 3.8, rot: 2.4, id: 34 },
      // Target site is at x: 7.5, z: 0.5 (Tooth 19 / 36 site - missing tooth for osteotomy!)
      { x: 9.5, z: -3.5, rot: 2.8, id: 37 },
    ];

    toothPositions.forEach(pos => {
      const tooth = new THREE.Mesh(toothGeo, toothMat);
      tooth.position.set(pos.x, 2.5, pos.z);
      tooth.rotation.y = pos.rot;
      tooth.castShadow = true;
      scene.add(tooth);
    });

    // 3. Inferior Alveolar Nerve Canal (Glowing amber/neon tube inside mandible)
    const nerveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -3.8, -4),
      new THREE.Vector3(-7, -4.2, 0),
      new THREE.Vector3(-4, -4.0, 3.5),
      new THREE.Vector3(0, -3.8, 5.0),
      new THREE.Vector3(4, -4.0, 3.5),
      new THREE.Vector3(7.2, -4.2, 0.2), // directly beneath our surgical site!
      new THREE.Vector3(9.5, -3.8, -4),
    ]);

    const nerveGeo = new THREE.TubeGeometry(nerveCurve, 40, 0.65, 12, false);
    const nerveMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: false,
    });
    const nerveMesh = new THREE.Mesh(nerveGeo, nerveMat);
    scene.add(nerveMesh);

    // Glowing nerve outer aura
    const nerveAuraMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const nerveAuraGeo = new THREE.TubeGeometry(nerveCurve, 40, 0.95, 8, false);
    const nerveAura = new THREE.Mesh(nerveAuraGeo, nerveAuraMat);
    scene.add(nerveAura);

    // 4. Target Osteotomy Trajectory & Entry Ring
    const targetSitePos = new THREE.Vector3(7.2, 1.2, 0.2); // Alveolar ridge crest
    const apexTargetPos = new THREE.Vector3(7.2, -3.2, 0.2); // Planned apex depth

    // Trajectory guide line
    const trajectoryPoints = [
      new THREE.Vector3(7.2, 10.0, 0.2),
      targetSitePos,
      apexTargetPos
    ];
    const trajectoryGeo = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    const trajectoryMat = new THREE.LineDashedMaterial({
      color: 0x00d4ff,
      dashSize: 0.8,
      gapSize: 0.4,
    });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    trajectoryLine.computeLineDistances();
    scene.add(trajectoryLine);

    // Entry point target crosshair ring
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, side: THREE.DoubleSide });
    const entryRing = new THREE.Mesh(ringGeo, ringMat);
    entryRing.rotation.x = Math.PI / 2;
    entryRing.position.copy(targetSitePos);
    scene.add(entryRing);

    // Apex safety target sphere
    const apexGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const apexMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const apexSphere = new THREE.Mesh(apexGeo, apexMat);
    apexSphere.position.copy(apexTargetPos);
    scene.add(apexSphere);

    // 5. Real-Time Navigated Surgical Drill Handpiece Probe Model
    const drillGroup = new THREE.Group();
    drillGroup.position.set(7.2, 6.0, 0.2); // Start hovering above entry point

    // Drill Handpiece Head
    const handpieceGeo = new THREE.CylinderGeometry(1.4, 1.4, 5.0, 16);
    const handpieceMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const handpiece = new THREE.Mesh(handpieceGeo, handpieceMat);
    handpiece.position.y = 5.5;
    drillGroup.add(handpiece);

    // Optical Tracking Array on Handpiece (4 IR reflective fiducial spheres)
    const trackerFrameGeo = new THREE.BoxGeometry(3.6, 0.4, 2.0);
    const trackerFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 });
    const trackerFrame = new THREE.Mesh(trackerFrameGeo, trackerFrameMat);
    trackerFrame.position.set(0, 8.5, 0);
    drillGroup.add(trackerFrame);

    const fiducialGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const fiducialMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    [-1.5, 1.5].forEach(x => {
      [-0.8, 0.8].forEach(z => {
        const marker = new THREE.Mesh(fiducialGeo, fiducialMat);
        marker.position.set(x, 8.8, z);
        drillGroup.add(marker);
      });
    });

    // Surgical Drill Bur (Twist drill shaft)
    const burShaftGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 12);
    const burShaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.1,
    });
    const burShaft = new THREE.Mesh(burShaftGeo, burShaftMat);
    burShaft.position.y = 2.0;
    drillGroup.add(burShaft);

    // Drill Flutes / Tip
    const burTipGeo = new THREE.ConeGeometry(0.35, 0.8, 12);
    const burTipMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.9,
      roughness: 0.2,
    });
    const burTip = new THREE.Mesh(burTipGeo, burTipMat);
    burTip.rotation.x = Math.PI;
    burTip.position.y = 0.25;
    drillGroup.add(burTip);

    scene.add(drillGroup);
    drillGroupRef.current = drillGroup;

    // Camera Orbit drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      scene.rotation.y += deltaX * 0.006;
      camera.position.y = Math.max(5, Math.min(35, camera.position.y - deltaY * 0.1));
      camera.lookAt(0, 0, 0);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Spin bur flutes to simulate active drill handpiece
      if (burShaft && burTip) {
        burShaft.rotation.y += 0.4;
        burTip.rotation.y += 0.4;
      }

      // Small subtle trajectory oscillation to simulate real human surgeon hand microsaccades
      if (drillGroupRef.current) {
        const jitterX = Math.sin(elapsedTime * 8) * 0.03;
        const jitterZ = Math.cos(elapsedTime * 6) * 0.03;
        drillGroupRef.current.position.x = 7.2 + jitterX;
        drillGroupRef.current.position.z = 0.2 + jitterZ;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  // Update bone material opacity whenever slider changes
  useEffect(() => {
    if (boneMaterialRef.current) {
      boneMaterialRef.current.opacity = boneOpacity;
    }
  }, [boneOpacity]);

  // Real-time drill depth simulation timer
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDrillDepthMm(prev => {
        let next = prev + 0.15;
        if (next > targetDepthMm + 0.8) {
          next = 0.5; // Loop back
        }

        // Move 3D drill group down accordingly
        if (drillGroupRef.current) {
          // At depth 0, y is 4.0; at depth 11.5, y is -0.4
          const yPos = 4.0 - (next / 11.5) * 4.4;
          drillGroupRef.current.position.y = yPos;
        }

        // Slight simulated angular variance
        setAngularDeviationDeg(+(0.5 + Math.sin(next * 2) * 0.4).toFixed(1));

        return +next.toFixed(1);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulating, targetDepthMm]);

  // Audio warning alert triggers
  useEffect(() => {
    if (isCritical) {
      playAlertBeep(880); // High pitch continuous alarm
    } else if (isCaution) {
      playAlertBeep(520); // Medium warning pulse
    }
  }, [isCritical, isCaution, drillDepthMm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', background: '#050b14', overflow: 'hidden' }}>
      {/* Top Surgical HUD Bar */}
      <div style={{
        height: '56px',
        background: 'rgba(12, 22, 38, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 212, 255, 0.12)',
            border: '1px solid #00d4ff',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            <span className="pulse-led" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d4ff' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00d4ff', letterSpacing: '0.05em' }}>
              STEREOTACTIC 3D NAVIGATION ACTIVE
            </span>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Case: <strong style={{ color: '#f8fafc' }}>{caseConfig.caseNumber}</strong> • Site: <strong style={{ color: '#00d4ff' }}>#{caseConfig.targetTeeth[0]} ({caseConfig.anatomicalRegion})</strong>
          </span>

          <span style={{ 
            fontSize: '0.72rem', 
            background: 'rgba(16, 185, 129, 0.15)', 
            color: '#10b981', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontWeight: 700 
          }}>
            {activeStage}
          </span>
        </div>

        {/* Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            {isSimulating ? <Pause size={14} /> : <Play size={14} />}
            <span>{isSimulating ? 'Pause Drilling Sim' : 'Resume Auto-Drill'}</span>
          </button>

          {/* Bone Opacity Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Layers size={14} color="#94a3b8" />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bone Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={boneOpacity}
              onChange={e => setBoneOpacity(parseFloat(e.target.value))}
              style={{ width: '60px', accentColor: '#00d4ff', cursor: 'pointer' }}
            />
          </div>

          <button
            onClick={onExitNavigation}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          >
            Exit Navigation Theater
          </button>
        </div>
      </div>

      {/* Main View Area with 3D Canvas and Live Telemetry Sidebars */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Three.js Interactive Canvas Container */}
        <div 
          ref={mountRef} 
          style={{ flex: 1, width: '100%', height: '100%', cursor: 'grab', position: 'relative' }}
        >
          {/* Orbit hint overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(5, 11, 20, 0.75)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.7rem',
            color: '#64748b',
            pointerEvents: 'none'
          }}>
            🖱 Click & Drag to Orbit 3D Model • Amber tube = Inferior Alveolar Canal
          </div>

          {/* Critical Hazard Flashing HUD if drill gets too close to nerve */}
          {isCritical && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(239, 68, 68, 0.92)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
              border: '2px solid #ffffff',
              zIndex: 30,
              animation: 'pulse-glow 0.8s infinite'
            }}>
              <AlertTriangle size={24} color="#ffffff" strokeWidth={3} />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, display: 'block', letterSpacing: '0.05em' }}>
                  SAFETY ZONE BREACH IMMINENT!
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Drill is {currentNerveProximityMm} mm from Inferior Alveolar Nerve. Stop drilling immediately.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Surgical Telemetry HUD Panel */}
        <div style={{
          width: '340px',
          minWidth: '340px',
          background: 'rgba(11, 22, 38, 0.95)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '18px',
          overflowY: 'auto',
          zIndex: 10
        }}>
          {/* Telemetry Gauge 1: Drill Depth */}
          <div className="medical-card" style={{ padding: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                OSTEOTOMY DEPTH GAUGE
              </span>
              <span className="font-mono-telemetry" style={{ 
                fontSize: '0.72rem', 
                color: drillDepthMm >= targetDepthMm ? '#10b981' : '#00d4ff', 
                fontWeight: 700 
              }}>
                Target: {targetDepthMm} mm
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span className="font-mono-telemetry" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
                {drillDepthMm.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>mm</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: drillDepthMm >= targetDepthMm ? '#10b981' : '#38bdf8', fontWeight: 700 }}>
                {((drillDepthMm / targetDepthMm) * 100).toFixed(0)}% REACHED
              </span>
            </div>

            {/* Depth Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (drillDepthMm / targetDepthMm) * 100)}%`,
                height: '100%',
                background: drillDepthMm >= targetDepthMm ? 'linear-gradient(90deg, #10b981, #00d4ff)' : 'linear-gradient(90deg, #0284c7, #00d4ff)',
                borderRadius: '4px',
                transition: 'width 0.15s ease'
              }} />
            </div>

            {/* Manual Depth Adjuster */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Manual:</span>
              <input
                type="range"
                min="0"
                max={targetDepthMm + 1.5}
                step="0.1"
                value={drillDepthMm}
                onChange={e => {
                  setIsSimulating(false);
                  setDrillDepthMm(parseFloat(e.target.value));
                  if (drillGroupRef.current) {
                    drillGroupRef.current.position.y = 4.0 - (parseFloat(e.target.value) / 11.5) * 4.4;
                  }
                }}
                style={{ flex: 1, accentColor: '#00d4ff', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Telemetry Gauge 2: Inferior Alveolar Nerve Proximity Barrier */}
          <div className="medical-card" style={{ 
            padding: '16px', 
            marginBottom: '14px',
            border: isCritical ? '2px solid #ef4444' : isCaution ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
            background: isCritical ? 'rgba(239, 68, 68, 0.15)' : isCaution ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} color={isCritical ? '#ef4444' : isCaution ? '#f59e0b' : '#10b981'} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isCritical ? '#f87171' : isCaution ? '#fbbf24' : '#10b981' }}>
                  NERVE PROXIMITY
                </span>
              </div>
              <span className={`badge-status ${isCritical ? 'badge-rose' : isCaution ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                {isCritical ? 'CRITICAL HAZARD' : isCaution ? 'CAUTION' : 'SAFE ZONE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
              <span className="font-mono-telemetry" style={{ 
                fontSize: '2.2rem', 
                fontWeight: 900, 
                color: isCritical ? '#ef4444' : isCaution ? '#fbbf24' : '#10b981', 
                lineHeight: 1 
              }}>
                {currentNerveProximityMm.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>mm distance</span>
            </div>

            <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
              Safe margin buffer: <strong style={{ color: '#f8fafc' }}>2.0 mm</strong>. Dynamic acoustic deceleration triggers below 1.5 mm.
            </p>
          </div>

          {/* Telemetry Gauge 3: Angular Deviation & Trajectory Error */}
          <div className="medical-card" style={{ padding: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                ANGULAR DEVIATION
              </span>
              <span className="font-mono-telemetry" style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                Tolerance: &lt; 2.0°
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span className="font-mono-telemetry" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc' }}>
                    {angularDeviationDeg}°
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>tilt error</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Trajectory Locked</span>
              </div>

              {/* Crosshair Target Visualizer */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1px solid #1e3256',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5, 11, 20, 0.8)'
              }}>
                <div style={{ position: 'absolute', width: '100%', height: '1px', background: '#1e3256' }} />
                <div style={{ position: 'absolute', height: '100%', width: '1px', background: '#1e3256' }} />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00d4ff',
                  boxShadow: '0 0 10px #00d4ff',
                  transform: `translate(${angularDeviationDeg * 6}px, ${-angularDeviationDeg * 4}px)`
                }} />
              </div>
            </div>
          </div>

          {/* Tri-Planar CBCT Cross-Section Mini-Viewer */}
          <div className="medical-card" style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              CO-REGISTERED CBCT SLICES
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
              {/* Axial slice */}
              <div style={{
                background: '#050b14',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.625rem', color: '#00d4ff', fontWeight: 700 }}>
                  AXIAL
                </span>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px dashed #38bdf8', opacity: 0.7 }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
              </div>

              {/* Sagittal slice */}
              <div style={{
                background: '#050b14',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.625rem', color: '#10b981', fontWeight: 700 }}>
                  SAGITTAL
                </span>
                <div style={{ width: '50px', height: '2px', background: '#f59e0b', opacity: 0.8 }} />
                <div style={{ position: 'absolute', width: '2px', height: '35px', background: '#00d4ff' }} />
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
              <span>Slice: 0.125mm</span>
              <span className="font-mono-telemetry" style={{ color: '#00d4ff' }}>HU: 980 (D2 Bone)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
