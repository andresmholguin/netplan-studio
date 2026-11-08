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
import { DEFAULT_PROJECT } from './data/defaultProject';

const PROJECT_STORAGE_VERSION = 'netplan_v3_uploaded_project';

export function App() {
  const [projectName, setProjectName] = useState<string>(() => {
    const version = localStorage.getItem('netplan_version');
    if (version !== PROJECT_STORAGE_VERSION) {
      return DEFAULT_PROJECT.projectName || 'Proyecto Red Corporativa';
    }
    const saved = localStorage.getItem('netplan_name');
    return saved || DEFAULT_PROJECT.projectName;
  });

  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    const version = localStorage.getItem('netplan_version');
    if (version !== PROJECT_STORAGE_VERSION) {
      return DEFAULT_PROJECT.devices;
    }
    const saved = localStorage.getItem('netplan_devices');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT.devices;
  });

  const [cables, setCables] = useState<CableConnection[]>(() => {
    const version = localStorage.getItem('netplan_version');
    if (version !== PROJECT_STORAGE_VERSION) {
      return DEFAULT_PROJECT.cables;
    }
    const saved = localStorage.getItem('netplan_cables');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT.cables;
  });

  const [background, setBackground] = useState<FloorPlanBackground>(() => {
    const version = localStorage.getItem('netplan_version');
    if (version !== PROJECT_STORAGE_VERSION) {
      return DEFAULT_PROJECT.background;
    }
    const saved = localStorage.getItem('netplan_background');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT.background;
  });

  const [scale, setScale] = useState<ScaleConfig>(() => {
    const version = localStorage.getItem('netplan_version');
    if (version !== PROJECT_STORAGE_VERSION) {
      return DEFAULT_PROJECT.scale || { pixelsPerMeter: 20, unit: 'm' };
    }
    const saved = localStorage.getItem('netplan_scale');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT.scale || { pixelsPerMeter: 20, unit: 'm' };
  });

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
    localStorage.setItem('netplan_version', PROJECT_STORAGE_VERSION);
    localStorage.setItem('netplan_devices', JSON.stringify(devices));
    localStorage.setItem('netplan_cables', JSON.stringify(cables));
    localStorage.setItem('netplan_background', JSON.stringify(background));
    localStorage.setItem('netplan_scale', JSON.stringify(scale));
    localStorage.setItem('netplan_name', projectName);
  }, [devices, cables, background, scale, projectName]);

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
