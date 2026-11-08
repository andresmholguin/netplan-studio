import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  DeviceNode,
  CableConnection,
  FloorPlanBackground,
  ScaleConfig,
  CableType,
} from '../types';
import { CABLE_STYLES } from '../data/deviceCatalog';
import { DeviceIcon } from './DeviceIcon';
import { getCablePath, getFovConePath, pixelsToMeters, snapToGrid } from '../utils/canvasMath';
import { RotateCw, Link as LinkIcon, Plus } from 'lucide-react';

interface CanvasProps {
  devices: DeviceNode[];
  cables: CableConnection[];
  background: FloorPlanBackground;
  scale: ScaleConfig;
  activeTool: 'select' | 'cable' | 'pan';
  activeCableType: CableType;
  selectedDeviceId: string | null;
  selectedCableId: string | null;
  connectingFromId: string | null;
  snapGrid: boolean;
  showWifiCoverage: boolean;
  showCameraFOV: boolean;
  onSelectDevice: (id: string | null) => void;
  onSelectCable: (id: string | null) => void;
  onMoveDevice: (id: string, x: number, y: number) => void;
  onConnectDevices: (fromId: string, toId: string) => void;
  onStartConnecting: (deviceId: string) => void;
  onCancelConnecting: () => void;
  onDropNewDevice: (deviceDef: any, x: number, y: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  devices,
  cables,
  background,
  scale,
  activeTool,
  activeCableType,
  selectedDeviceId,
  selectedCableId,
  connectingFromId,
  snapGrid,
  showWifiCoverage,
  showCameraFOV,
  onSelectDevice,
  onSelectCable,
  onMoveDevice,
  onConnectDevices,
  onStartConnecting,
  onCancelConnecting,
  onDropNewDevice,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom state
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging device state
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse cursor in world coordinates (for rubber-band cable preview)
  const [mouseWorld, setMouseWorld] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Converting screen to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - pan.x) / zoom;
      const y = (screenY - rect.top - pan.y) / zoom;
      return { x, y };
    },
    [pan, zoom]
  );

  // Wheel zoom centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.2), 4);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Maintain cursor position in world space
    const newPanX = mouseX - ((mouseX - pan.x) / zoom) * newZoom;
    const newPanY = mouseY - ((mouseY - pan.y) / zoom) * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Mouse Down handler (handles pan or deselection)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Pan tool activates pan
    if (e.button === 1 || activeTool === 'pan') {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    // Left click on background
    if (e.button === 0 && e.target === e.currentTarget) {
      if (connectingFromId) {
        onCancelConnecting();
      } else {
        onSelectDevice(null);
        onSelectCable(null);
      }
    }
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    setMouseWorld(worldPos);

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (draggingDeviceId) {
      let newX = worldPos.x - dragOffset.x;
      let newY = worldPos.y - dragOffset.y;

      if (snapGrid) {
        newX = snapToGrid(newX, 20);
        newY = snapToGrid(newY, 20);
      }

      onMoveDevice(draggingDeviceId, newX, newY);
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingDeviceId(null);
  };

  // Device Node Mouse Down (start dragging device or connecting)
  const handleDeviceMouseDown = (e: React.MouseEvent, device: DeviceNode) => {
    e.stopPropagation();

    if (activeTool === 'cable' || connectingFromId) {
      if (connectingFromId && connectingFromId !== device.id) {
        onConnectDevices(connectingFromId, device.id);
      } else {
        onStartConnecting(device.id);
      }
      return;
    }

    onSelectDevice(device.id);
    onSelectCable(null);

    const world = screenToWorld(e.clientX, e.clientY);
    setDraggingDeviceId(device.id);
    setDragOffset({
      x: world.x - device.x,
      y: world.y - device.y,
    });
  };

  // Handle Drag & Drop from Sidebar onto Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('application/json');
    if (!rawData) return;

    try {
      const deviceDef = JSON.parse(rawData);
      const world = screenToWorld(e.clientX, e.clientY);
      let posX = world.x;
      let posY = world.y;

      if (snapGrid) {
        posX = snapToGrid(posX, 20);
        posY = snapToGrid(posY, 20);
      }

      onDropNewDevice(deviceDef, posX, posY);
    } catch (err) {
      console.error('Error handling dropped device', err);
    }
  };

  // Connecting line preview
  const connectingSourceDev = connectingFromId
    ? devices.find((d) => d.id === connectingFromId)
    : null;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        isPanning || activeTool === 'pan'
          ? 'cursor-grab active:cursor-grabbing'
          : activeTool === 'cable' || connectingFromId
          ? 'cursor-crosshair'
          : 'cursor-default'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
        backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      {/* Zoom indicator & Reset button */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 shadow-lg">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 50, y: 50 });
          }}
          className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Cable Tool Notification Banner */}
      {connectingFromId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-blue-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-3 text-xs font-medium animate-pulse">
          <LinkIcon size={16} />
          <span>Haz clic en el dispositivo de destino para conectar el cable</span>
          <button
            onClick={onCancelConnecting}
            className="px-2 py-0.5 bg-blue-800 hover:bg-blue-900 rounded-full text-[11px] transition cursor-pointer"
          >
            Cancelar (ESC)
          </button>
        </div>
      )}

      {/* Main World Transform Container */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* 1. Floor Plan Background Image */}
        {background.imageSrc && (
          <div
            className="absolute pointer-events-none select-none transition-opacity"
            style={{
              left: `${background.x}px`,
              top: `${background.y}px`,
              width: `${background.width * background.scale}px`,
              height: `${background.height * background.scale}px`,
              opacity: background.opacity,
            }}
          >
            <img
              src={background.imageSrc}
              alt="Plano Arquitectónico"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        )}

        {/* 2. SVG Vector Layer for Wi-Fi, Camera FOV, and Cables */}
        <svg
          className="absolute top-0 left-0 overflow-visible pointer-events-none"
          style={{ width: '4000px', height: '4000px' }}
        >
          <defs>
            {/* Glowing filter for PoE cables */}
            <filter id="poe-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial gradient for Wi-Fi */}
            <radialGradient id="wifi-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </radialGradient>
            {/* Gradient for CCTV Cone */}
            <linearGradient id="camera-fov-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Wi-Fi Coverage Heatmap Circles */}
          {showWifiCoverage &&
            devices.map((device) => {
              if (!device.coverageRadius) return null;
              const isSelected = selectedDeviceId === device.id;
              return (
                <g key={`wifi-${device.id}`} className="transition-all">
                  <circle
                    cx={device.x}
                    cy={device.y}
                    r={device.coverageRadius}
                    fill="url(#wifi-gradient)"
                    stroke="#06b6d4"
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray="6,4"
                    strokeOpacity={0.6}
                  />
                  {/* Coverage metric label */}
                  <text
                    x={device.x}
                    y={device.y - device.coverageRadius - 6}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize={11}
                    fontFamily="monospace"
                    fontWeight="bold"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
                  >
                    Wi-Fi ~{pixelsToMeters(device.coverageRadius, scale.pixelsPerMeter)}m
                  </text>
                </g>
              );
            })}

          {/* Camera Field of View (FOV) Cones */}
          {showCameraFOV &&
            devices.map((device) => {
              if (device.cameraFOV === undefined) return null;
              const angle = device.cameraAngle || 0;
              const fov = device.cameraFOV;
              const distance = device.cameraDistance || 150;
              const conePath = getFovConePath(device.x, device.y, angle, fov, distance);
              const isSelected = selectedDeviceId === device.id;

              return (
                <g key={`fov-${device.id}`}>
                  <path
                    d={conePath}
                    fill="url(#camera-fov-gradient)"
                    stroke="#f59e0b"
                    strokeWidth={isSelected ? 1.5 : 1}
                    strokeOpacity={0.7}
                  />
                </g>
              );
            })}

          {/* Render Cable Lines */}
          {cables.map((cable) => {
            const fromDev = devices.find((d) => d.id === cable.fromId);
            const toDev = devices.find((d) => d.id === cable.toId);
            if (!fromDev || !toDev) return null;

            const isSelected = selectedCableId === cable.id;
            const style = CABLE_STYLES[cable.type] || CABLE_STYLES.cat6;
            const { path, midPoint } = getCablePath(
              { x: fromDev.x, y: fromDev.y },
              { x: toDev.x, y: toDev.y },
              cable.curvature || 0
            );

            // Distance calculation
            const dx = toDev.x - fromDev.x;
            const dy = toDev.y - fromDev.y;
            const distPx = Math.sqrt(dx * dx + dy * dy);
            const distMeters = pixelsToMeters(distPx, scale.pixelsPerMeter);

            return (
              <g
                key={cable.id}
                className="group cursor-pointer pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCable(cable.id);
                  onSelectDevice(null);
                }}
              >
                {/* Invisible thicker stroke for easy clicking/hovering */}
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth={20}
                  fill="none"
                  className="pointer-events-auto"
                />

                {/* Cable Outer Glow if selected */}
                {isSelected && (
                  <path
                    d={path}
                    stroke="#ffffff"
                    strokeWidth={style.strokeWidth + 4}
                    fill="none"
                    strokeOpacity={0.6}
                  />
                )}

                {/* Actual Cable Stroke */}
                <path
                  d={path}
                  stroke={style.color}
                  strokeWidth={isSelected ? style.strokeWidth + 1.5 : style.strokeWidth}
                  strokeDasharray={style.dashArray}
                  fill="none"
                  strokeLinecap="round"
                  filter={cable.type === 'poe' ? 'url(#poe-glow)' : undefined}
                  className="transition-all duration-150"
                />

                {/* Cable Info Badge (Distance & Type) at Midpoint */}
                <g transform={`translate(${midPoint.x}, ${midPoint.y})`}>
                  <rect
                    x="-40"
                    y="-12"
                    width="80"
                    height="24"
                    rx="12"
                    fill="#0f172a"
                    stroke={isSelected ? '#ffffff' : style.color}
                    strokeWidth={isSelected ? 1.5 : 1}
                    fillOpacity={0.92}
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {cable.label ? cable.label : `${distMeters}m`}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Rubber-band Cable Preview while connecting */}
          {connectingSourceDev && (
            <line
              x1={connectingSourceDev.x}
              y1={connectingSourceDev.y}
              x2={mouseWorld.x}
              y2={mouseWorld.y}
              stroke={CABLE_STYLES[activeCableType]?.color || '#3b82f6'}
              strokeWidth={3}
              strokeDasharray="6,4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* 3. Interactive Device Nodes Layer */}
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.id;
          const isConnectingSource = connectingFromId === device.id;

          return (
            <div
              key={device.id}
              onMouseDown={(e) => handleDeviceMouseDown(e, device)}
              style={{
                left: `${device.x}px`,
                top: `${device.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute select-none pointer-events-auto cursor-pointer group flex flex-col items-center ${
                isSelected ? 'z-30' : 'z-20'
              }`}
            >
              {/* Device Icon Card */}
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-150 shadow-xl backdrop-blur-md ${
                  isSelected
                    ? 'ring-4 ring-blue-500/50 scale-110 shadow-blue-500/30'
                    : 'hover:scale-105'
                } ${
                  isConnectingSource
                    ? 'ring-4 ring-amber-400 animate-pulse'
                    : ''
                }`}
                style={{
                  backgroundColor: '#0f172aee',
                  borderColor: isSelected ? '#38bdf8' : `${device.color}80`,
                  boxShadow: `0 10px 25px -5px ${device.color}30`,
                }}
              >
                {/* Glowing LED status dot */}
                <div
                  className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                    device.status === 'online'
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : device.status === 'warning'
                      ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                      : 'bg-rose-500'
                  }`}
                  title={`Estado: ${device.status}`}
                />

                {/* Device Icon */}
                <div style={{ color: device.color }}>
                  <DeviceIcon name={device.icon} size={28} />
                </div>

                {/* Quick Port Connect Pin on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (connectingFromId && connectingFromId !== device.id) {
                      onConnectDevices(connectingFromId, device.id);
                    } else {
                      onStartConnecting(device.id);
                    }
                  }}
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer border border-blue-400"
                  title="Conectar cable"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Device Label & IP Pill below node */}
              <div className="mt-1.5 flex flex-col items-center pointer-events-none text-center">
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-white font-medium text-[11px] whitespace-nowrap shadow-md max-w-[140px] truncate">
                  {device.name}
                </span>

                {device.ip && (
                  <span className="mt-0.5 px-1.5 py-0.2 rounded bg-blue-950/90 border border-blue-800/80 text-blue-300 font-mono text-[9px] whitespace-nowrap shadow-xs">
                    {device.ip}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
