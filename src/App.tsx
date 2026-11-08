import React, { useState, useEffect } from 'react';
import {
  DeviceNode,
  CableConnection,
  FloorPlanBackground,
  ScaleConfig,
  CableType,
  DeviceDefinition,
  ProjectState,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { BackgroundModal } from './components/BackgroundModal';
import { BOMModal } from './components/BOMModal';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_PLANS } from './data/samplePlans';

// Initial preloaded devices on Corporate Office plan
const initialDevices: DeviceNode[] = [
  {
    id: 'dev-router-1',
    type: 'router_core',
    name: 'Router Gateway Core',
    category: 'network',
    icon: 'Router',
    x: 130,
    y: 190,
    ip: '192.168.1.1',
    mac: 'E4:8D:8C:01:23:45',
    vlan: 'VLAN 1 - Default',
    model: 'Enterprise Core Router',
    status: 'online',
    color: '#0284c7',
  },
  {
    id: 'dev-switch-1',
    type: 'switch_poe',
    name: 'Switch PoE+ 24P (MDF)',
    category: 'network',
    icon: 'Boxes',
    x: 230,
    y: 190,
    ip: '192.168.1.2',
    mac: 'E4:8D:8C:01:23:46',
    vlan: 'VLAN 10 - Infraestructura',
    model: 'Switch L2+ 370W PoE',
    status: 'online',
    color: '#7c3aed',
  },
  {
    id: 'dev-server-1',
    type: 'server_blade',
    name: 'Servidor VM Host 01',
    category: 'servers',
    icon: 'HardDrive',
    x: 130,
    y: 110,
    ip: '192.168.1.10',
    mac: 'E4:8D:8C:01:23:99',
    vlan: 'VLAN 20 - Servidores',
    model: 'PowerEdge 2U',
    status: 'online',
    color: '#3b82f6',
  },
  {
    id: 'dev-ap-1',
    type: 'ap_indoor',
    name: 'AP Wi-Fi 6 (Juntas)',
    category: 'wireless',
    icon: 'Wifi',
    x: 580,
    y: 170,
    ip: '192.168.1.20',
    mac: 'A0:B1:C2:33:44:55',
    vlan: 'VLAN 30 - Wi-Fi Corporativo',
    model: 'UniFi U6 Pro',
    status: 'online',
    color: '#06b6d4',
    coverageRadius: 240,
  },
  {
    id: 'dev-pc-1',
    type: 'pc_desktop',
    name: 'PC Operativa 01',
    category: 'computers',
    icon: 'Monitor',
    x: 190,
    y: 410,
    ip: '192.168.1.101',
    mac: '10:7C:61:A1:B2:C3',
    vlan: 'VLAN 40 - Usuarios',
    model: 'Dell OptiPlex 7090',
    status: 'online',
    color: '#0ea5e9',
  },
  {
    id: 'dev-pc-2',
    type: 'laptop',
    name: 'Laptop Gerencia',
    category: 'computers',
    icon: 'Laptop',
    x: 980,
    y: 170,
    ip: '192.168.1.102',
    mac: '3C:06:30:D4:E5:F6',
    vlan: 'VLAN 40 - Usuarios',
    model: 'ThinkPad X1 Carbon',
    status: 'online',
    color: '#38bdf8',
  },
  {
    id: 'dev-cam-1',
    type: 'cctv_dome',
    name: 'Cámara Acceso Principal',
    category: 'cctv',
    icon: 'Camera',
    x: 1280,
    y: 390,
    ip: '192.168.1.50',
    mac: '70:B3:D5:12:34:56',
    vlan: 'VLAN 50 - CCTV',
    model: 'Hikvision 4K IP Dome',
    status: 'online',
    color: '#f59e0b',
    cameraAngle: 125,
    cameraFOV: 85,
    cameraDistance: 190,
  },
  {
    id: 'dev-iot-1',
    type: 'sensor_motion',
    name: 'Sensor PIR Pasillo',
    category: 'iot',
    icon: 'Activity',
    x: 620,
    y: 320,
    ip: '192.168.1.80',
    mac: '54:48:E6:AA:BB:CC',
    vlan: 'VLAN 60 - IoT',
    model: 'Zigbee Motion Sensor',
    status: 'online',
    color: '#059669',
    cameraAngle: 90,
    cameraFOV: 90,
    cameraDistance: 130,
  },
];

// Initial preloaded cables
const initialCables: CableConnection[] = [
  {
    id: 'cable-1',
    fromId: 'dev-router-1',
    toId: 'dev-switch-1',
    type: 'cat6',
    label: 'Troncal 10G',
  },
  {
    id: 'cable-2',
    fromId: 'dev-switch-1',
    toId: 'dev-server-1',
    type: 'fiber',
    label: 'OM3 Fibra',
    curvature: -0.5,
  },
  {
    id: 'cable-3',
    fromId: 'dev-switch-1',
    toId: 'dev-ap-1',
    type: 'poe',
    label: 'PoE+ Datos',
    curvature: 0.3,
  },
  {
    id: 'cable-4',
    fromId: 'dev-switch-1',
    toId: 'dev-pc-1',
    type: 'cat6',
    label: 'Cat6 Puesto 1',
    curvature: 0.2,
  },
  {
    id: 'cable-5',
    fromId: 'dev-switch-1',
    toId: 'dev-cam-1',
    type: 'poe',
    label: 'PoE+ CCTV',
    curvature: -0.4,
  },
  {
    id: 'cable-6',
    fromId: 'dev-ap-1',
    toId: 'dev-pc-2',
    type: 'wifi',
    label: 'Wi-Fi 6',
  },
];

export function App() {
  const [projectName, setProjectName] = useState<string>('Proyecto Red Corporativa');
  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    const saved = localStorage.getItem('netplan_devices');
    return saved ? JSON.parse(saved) : initialDevices;
  });
  const [cables, setCables] = useState<CableConnection[]>(() => {
    const saved = localStorage.getItem('netplan_cables');
    return saved ? JSON.parse(saved) : initialCables;
  });
  const [background, setBackground] = useState<FloorPlanBackground>(() => {
    const defaultSample = SAMPLE_PLANS[0];
    return {
      imageSrc: defaultSample.imageSrc,
      name: defaultSample.name,
      opacity: 0.85,
      x: 0,
      y: 0,
      scale: 1,
      width: 1400,
      height: 900,
      locked: true,
    };
  });
  const [scale, setScale] = useState<ScaleConfig>({ pixelsPerMeter: 20, unit: 'm' });

  // UI state
  const [activeTool, setActiveTool] = useState<'select' | 'cable' | 'pan'>('select');
  const [activeCableType, setActiveCableType] = useState<CableType>('cat6');
  const [snapGrid, setSnapGrid] = useState<boolean>(true);
  const [showWifiCoverage, setShowWifiCoverage] = useState<boolean>(true);
  const [showCameraFOV, setShowCameraFOV] = useState<boolean>(true);

  // Selection
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);

  // Cable creation mode
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Modals
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('netplan_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('netplan_cables', JSON.stringify(cables));
  }, [cables]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'v' || e.key === 'V') setActiveTool('select');
      if (e.key === 'c' || e.key === 'C') setActiveTool('cable');
      if (e.key === 'h' || e.key === 'H') setActiveTool('pan');
      if (e.key === 'Escape') {
        setConnectingFromId(null);
        setSelectedDeviceId(null);
        setSelectedCableId(null);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedDeviceId) {
          handleDeleteDevice(selectedDeviceId);
        } else if (selectedCableId) {
          handleDeleteCable(selectedCableId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDeviceId, selectedCableId]);

  // Device manipulation
  const handleMoveDevice = (id: string, x: number, y: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, x, y } : d)));
  };

  const handleUpdateDevice = (id: string, updates: Partial<DeviceNode>) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setCables((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
    if (selectedDeviceId === id) setSelectedDeviceId(null);
  };

  // Cable manipulation
  const handleConnectDevices = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    // Check if cable already exists in this direction or reverse
    const exists = cables.some(
      (c) => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );

    const newCable: CableConnection = {
      id: `cable-${Date.now()}`,
      fromId,
      toId,
      type: activeCableType,
      curvature: exists ? 0.6 : 0, // Curve if another cable connects them
    };

    setCables((prev) => [...prev, newCable]);
    setConnectingFromId(null);
    setSelectedCableId(newCable.id);
  };

  const handleUpdateCable = (id: string, updates: Partial<CableConnection>) => {
    setCables((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeleteCable = (id: string) => {
    setCables((prev) => prev.filter((c) => c.id !== id));
    if (selectedCableId === id) setSelectedCableId(null);
  };

  // Add device by dropping or clicking
  const handleAddDevice = (deviceDef: DeviceDefinition, x?: number, y?: number) => {
    const posX = x !== undefined ? x : 400 + Math.random() * 200;
    const posY = y !== undefined ? y : 300 + Math.random() * 200;

    const countOfType = devices.filter((d) => d.type === deviceDef.type).length + 1;
    const newDevice: DeviceNode = {
      id: `dev-${deviceDef.type}-${Date.now()}`,
      type: deviceDef.type,
      name: `${deviceDef.name} #${countOfType}`,
      category: deviceDef.category,
      icon: deviceDef.icon,
      x: posX,
      y: posY,
      status: 'online',
      color: deviceDef.color,
      ip: `192.168.1.${100 + devices.length}`,
      coverageRadius: deviceDef.defaultCoverageRadius
        ? deviceDef.defaultCoverageRadius * scale.pixelsPerMeter
        : undefined,
      cameraFOV: deviceDef.defaultFOVAngle,
      cameraDistance: deviceDef.defaultFOVDistance
        ? deviceDef.defaultFOVDistance * scale.pixelsPerMeter
        : undefined,
      cameraAngle: 90,
    };

    setDevices((prev) => [...prev, newDevice]);
    setSelectedDeviceId(newDevice.id);
    setSelectedCableId(null);
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (confirm('¿Deseas vaciar todos los dispositivos y conexiones del plano?')) {
      setDevices([]);
      setCables([]);
      setSelectedDeviceId(null);
      setSelectedCableId(null);
    }
  };

  // Load project
  const handleLoadProject = (newState: ProjectState) => {
    if (newState.projectName) setProjectName(newState.projectName);
    if (newState.devices) setDevices(newState.devices);
    if (newState.cables) setCables(newState.cables);
    if (newState.background) setBackground(newState.background);
    if (newState.scale) setScale(newState.scale);
  };

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || null;
  const selectedCable = cables.find((c) => c.id === selectedCableId) || null;

  const currentProjectState: ProjectState = {
    version: '1.0.0',
    projectName,
    devices,
    cables,
    background,
    scale,
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTool={activeTool}
        activeCableType={activeCableType}
        snapGrid={snapGrid}
        showWifiCoverage={showWifiCoverage}
        showCameraFOV={showCameraFOV}
        deviceCount={devices.length}
        cableCount={cables.length}
        onSetTool={setActiveTool}
        onSetCableType={setActiveCableType}
        onToggleSnapGrid={() => setSnapGrid((prev) => !prev)}
        onToggleWifiCoverage={() => setShowWifiCoverage((prev) => !prev)}
        onToggleCameraFOV={() => setShowCameraFOV((prev) => !prev)}
        onOpenBackgroundModal={() => setIsBackgroundModalOpen(true)}
        onOpenBOMModal={() => setIsBOMModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onClearCanvas={handleClearCanvas}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Devices Sidebar */}
        <Sidebar onAddDevice={(def) => handleAddDevice(def)} />

        {/* Center Interactive Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          <Canvas
            devices={devices}
            cables={cables}
            background={background}
            scale={scale}
            activeTool={activeTool}
            activeCableType={activeCableType}
            selectedDeviceId={selectedDeviceId}
            selectedCableId={selectedCableId}
            connectingFromId={connectingFromId}
            snapGrid={snapGrid}
            showWifiCoverage={showWifiCoverage}
            showCameraFOV={showCameraFOV}
            onSelectDevice={(id) => {
              setSelectedDeviceId(id);
              if (id) setSelectedCableId(null);
            }}
            onSelectCable={(id) => {
              setSelectedCableId(id);
              if (id) setSelectedDeviceId(null);
            }}
            onMoveDevice={handleMoveDevice}
            onConnectDevices={handleConnectDevices}
            onStartConnecting={(id) => setConnectingFromId(id)}
            onCancelConnecting={() => setConnectingFromId(null)}
            onDropNewDevice={(def, x, y) => handleAddDevice(def, x, y)}
          />
        </main>

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedDevice={selectedDevice}
          selectedCable={selectedCable}
          devices={devices}
          scale={scale}
          onUpdateDevice={handleUpdateDevice}
          onDeleteDevice={handleDeleteDevice}
          onUpdateCable={handleUpdateCable}
          onDeleteCable={handleDeleteCable}
          onStartConnecting={(id) => setConnectingFromId(id)}
          onClose={() => {
            setSelectedDeviceId(null);
            setSelectedCableId(null);
          }}
        />
      </div>

      {/* Modals */}
      <BackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        background={background}
        scale={scale}
        onUpdateBackground={(updates) => setBackground((prev) => ({ ...prev, ...updates }))}
        onUpdateScale={(updates) => setScale((prev) => ({ ...prev, ...updates }))}
      />

      <BOMModal
        isOpen={isBOMModalOpen}
        onClose={() => setIsBOMModalOpen(false)}
        devices={devices}
        cables={cables}
        scale={scale}
        projectName={projectName}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectState={currentProjectState}
        onLoadProject={handleLoadProject}
      />
    </div>
  );
}

export default App;
