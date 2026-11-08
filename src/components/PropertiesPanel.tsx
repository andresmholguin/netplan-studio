import React from 'react';
import { DeviceNode, CableConnection, CableType, ScaleConfig } from '../types';
import { CABLE_STYLES, DEVICE_CATEGORIES } from '../data/deviceCatalog';
import { DeviceIcon } from './DeviceIcon';
import { X, Trash2, ArrowRight, Activity, Eye, Wifi, Link, Shield, Sliders } from 'lucide-react';
import { pixelsToMeters } from '../utils/canvasMath';

interface PropertiesPanelProps {
  selectedDevice: DeviceNode | null;
  selectedCable: CableConnection | null;
  devices: DeviceNode[];
  scale: ScaleConfig;
  onUpdateDevice: (id: string, updates: Partial<DeviceNode>) => void;
  onDeleteDevice: (id: string) => void;
  onUpdateCable: (id: string, updates: Partial<CableConnection>) => void;
  onDeleteCable: (id: string) => void;
  onStartConnecting: (deviceId: string) => void;
  onClose: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedDevice,
  selectedCable,
  devices,
  scale,
  onUpdateDevice,
  onDeleteDevice,
  onUpdateCable,
  onDeleteCable,
  onStartConnecting,
  onClose,
}) => {
  if (!selectedDevice && !selectedCable) return null;

  // Render Device Inspector
  if (selectedDevice) {
    const categoryInfo = DEVICE_CATEGORIES.find((c) => c.id === selectedDevice.category);

    return (
      <aside className="w-80 h-full bg-slate-900/95 border-l border-slate-800 flex flex-col select-none z-20 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${selectedDevice.color}20`,
                borderColor: `${selectedDevice.color}50`,
                color: selectedDevice.color,
              }}
            >
              <DeviceIcon name={selectedDevice.icon} size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{selectedDevice.name}</h3>
              <p className="text-[11px] text-slate-400">{categoryInfo?.label || selectedDevice.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Status selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Estado de Operación
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['online', 'warning', 'offline'] as const).map((st) => {
                const isCurrent = selectedDevice.status === st;
                const colors = {
                  online: 'border-emerald-500 bg-emerald-950/40 text-emerald-400',
                  warning: 'border-amber-500 bg-amber-950/40 text-amber-400',
                  offline: 'border-rose-500 bg-rose-950/40 text-rose-400',
                };
                const labels = { online: 'En Línea', warning: 'Alerta', offline: 'Apagado' };
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateDevice(selectedDevice.id, { status: st })}
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? colors[st]
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st === 'online'
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : st === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <span>{labels[st]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre / Etiqueta */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Nombre / Etiqueta de Host
            </label>
            <input
              type="text"
              value={selectedDevice.name}
              onChange={(e) => onUpdateDevice(selectedDevice.id, { name: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* IP Address & VLAN */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Dirección IP
              </label>
              <input
                type="text"
                placeholder="192.168.1.50"
                value={selectedDevice.ip || ''}
                onChange={(e) => onUpdateDevice(selectedDevice.id, { ip: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                VLAN / Subred
              </label>
              <input
                type="text"
                placeholder="VLAN 10"
                value={selectedDevice.vlan || ''}
                onChange={(e) => onUpdateDevice(selectedDevice.id, { vlan: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* MAC Address & Modelo */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Dirección MAC
              </label>
              <input
                type="text"
                placeholder="00:1A:2B:3C:4D:5E"
                value={selectedDevice.mac || ''}
                onChange={(e) => onUpdateDevice(selectedDevice.id, { mac: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Marca / Modelo
              </label>
              <input
                type="text"
                placeholder="UniFi, Cisco, etc."
                value={selectedDevice.model || ''}
                onChange={(e) => onUpdateDevice(selectedDevice.id, { model: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Controles para Wi-Fi (Radio de cobertura) */}
          {selectedDevice.coverageRadius !== undefined && (
            <div className="bg-slate-950/40 p-3 rounded-lg border border-cyan-900/40 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Wifi size={14} /> Radio de Cobertura Wi-Fi
                </span>
                <span className="font-mono text-xs">
                  {pixelsToMeters(selectedDevice.coverageRadius, scale.pixelsPerMeter)} m
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="600"
                step="10"
                value={selectedDevice.coverageRadius}
                onChange={(e) =>
                  onUpdateDevice(selectedDevice.id, { coverageRadius: parseInt(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Controles para Cámaras CCTV (Ángulo de visión y rotación) */}
          {selectedDevice.cameraFOV !== undefined && (
            <div className="bg-slate-950/40 p-3 rounded-lg border border-amber-900/40 space-y-3">
              <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                <Eye size={14} /> Ajustes de Cono de Visión (CCTV)
              </div>
              
              {/* Dirección / Rotación */}
              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Dirección / Orientación</span>
                  <span className="font-mono text-amber-300">
                    {Math.round(selectedDevice.cameraAngle || 0)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={selectedDevice.cameraAngle || 0}
                  onChange={(e) =>
                    onUpdateDevice(selectedDevice.id, { cameraAngle: parseInt(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Ángulo FOV */}
              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Apertura del Lente (FOV)</span>
                  <span className="font-mono text-amber-300">{selectedDevice.cameraFOV}°</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="160"
                  step="5"
                  value={selectedDevice.cameraFOV}
                  onChange={(e) =>
                    onUpdateDevice(selectedDevice.id, { cameraFOV: parseInt(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Alcance de visión */}
              <div>
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Distancia de Alcance</span>
                  <span className="font-mono text-amber-300">
                    {pixelsToMeters(selectedDevice.cameraDistance || 150, scale.pixelsPerMeter)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="500"
                  step="10"
                  value={selectedDevice.cameraDistance || 150}
                  onChange={(e) =>
                    onUpdateDevice(selectedDevice.id, { cameraDistance: parseInt(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Notas y Ubicación Física
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Rack A, Puerto 12, Puesto Gerente..."
              value={selectedDevice.notes || ''}
              onChange={(e) => onUpdateDevice(selectedDevice.id, { notes: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none text-xs"
            />
          </div>

          {/* Conectar Cable rápido */}
          <button
            onClick={() => onStartConnecting(selectedDevice.id)}
            className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 text-blue-300 hover:text-white rounded-lg transition flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <Link size={14} />
            <span>Trazar Cable desde este Dispositivo</span>
          </button>
        </div>

        {/* Footer / Eliminar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 font-mono">ID: {selectedDevice.id.slice(0, 8)}</span>
          <button
            onClick={() => onDeleteDevice(selectedDevice.id)}
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Eliminar Dispositivo</span>
          </button>
        </div>
      </aside>
    );
  }

  // Render Cable Inspector
  if (selectedCable) {
    const fromDev = devices.find((d) => d.id === selectedCable.fromId);
    const toDev = devices.find((d) => d.id === selectedCable.toId);
    const cableStyle = CABLE_STYLES[selectedCable.type] || CABLE_STYLES.cat6;

    let distanceMeters = 0;
    if (fromDev && toDev) {
      const dx = toDev.x - fromDev.x;
      const dy = toDev.y - fromDev.y;
      const px = Math.sqrt(dx * dx + dy * dy);
      distanceMeters = pixelsToMeters(px, scale.pixelsPerMeter);
    }

    return (
      <aside className="w-80 h-full bg-slate-900/95 border-l border-slate-800 flex flex-col select-none z-20 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${cableStyle.color}20`,
                borderColor: `${cableStyle.color}50`,
                color: cableStyle.color,
              }}
            >
              <Link size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Conexión de Cable</h3>
              <p className="text-[11px] text-slate-400">{cableStyle.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cable details */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Dispositivos conectados */}
          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Extremos Conectados
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white truncate max-w-[100px]">
                {fromDev?.name || 'Origen'}
              </span>
              <ArrowRight size={14} className="text-slate-500" />
              <span className="font-semibold text-white truncate max-w-[100px]">
                {toDev?.name || 'Destino'}
              </span>
            </div>
          </div>

          {/* Tipo de Cable */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Tipo de Cable y Medio
            </label>
            <div className="space-y-1.5">
              {Object.values(CABLE_STYLES).map((st) => {
                const isSelected = selectedCable.type === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onUpdateCable(selectedCable.id, { type: st.id as CableType })}
                    className={`w-full p-2 rounded-lg border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: st.color }}
                      />
                      <div>
                        <div className="font-medium text-xs text-white">{st.label}</div>
                        <div className="text-[10px] text-slate-400">{st.speed}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Longitud calculada */}
          <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Longitud Estimada</span>
              <span className="text-lg font-bold text-blue-400 font-mono">
                {distanceMeters} metros
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              ({Math.round(distanceMeters * 3.28084)} ft)
            </span>
          </div>

          {/* Curvatura del cable */}
          <div>
            <div className="flex justify-between text-slate-400 text-[11px] mb-1">
              <span>Curvatura del Cable</span>
              <span className="font-mono text-blue-400">
                {selectedCable.curvature || 0}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.2"
              value={selectedCable.curvature || 0}
              onChange={(e) =>
                onUpdateCable(selectedCable.id, { curvature: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Arriba / Izq</span>
              <span>Recto (0)</span>
              <span>Abajo / Der</span>
            </div>
          </div>

          {/* Etiqueta opcional */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Etiqueta de Cable (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Troncal MDF-IDF, CABLE-01..."
              value={selectedCable.label || ''}
              onChange={(e) => onUpdateCable(selectedCable.id, { label: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer / Eliminar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 font-mono">ID: {selectedCable.id.slice(0, 8)}</span>
          <button
            onClick={() => onDeleteCable(selectedCable.id)}
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Eliminar Cable</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
