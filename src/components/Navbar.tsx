import React from 'react';
import { CableType } from '../types';
import { CABLE_STYLES } from '../data/deviceCatalog';
import {
  MousePointer,
  Link,
  Hand,
  Grid,
  Wifi,
  Eye,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  Trash2,
  FolderOpen,
} from 'lucide-react';

interface NavbarProps {
  activeTool: 'select' | 'cable' | 'pan';
  activeCableType: CableType;
  snapGrid: boolean;
  showWifiCoverage: boolean;
  showCameraFOV: boolean;
  deviceCount: number;
  cableCount: number;
  onSetTool: (tool: 'select' | 'cable' | 'pan') => void;
  onSetCableType: (type: CableType) => void;
  onToggleSnapGrid: () => void;
  onToggleWifiCoverage: () => void;
  onToggleCameraFOV: () => void;
  onOpenBackgroundModal: () => void;
  onOpenBOMModal: () => void;
  onOpenExportModal: () => void;
  onClearCanvas: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  activeCableType,
  snapGrid,
  showWifiCoverage,
  showCameraFOV,
  deviceCount,
  cableCount,
  onSetTool,
  onSetCableType,
  onToggleSnapGrid,
  onToggleWifiCoverage,
  onToggleCameraFOV,
  onOpenBackgroundModal,
  onOpenBOMModal,
  onOpenExportModal,
  onClearCanvas,
}) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 select-none shadow-md shrink-0">
      {/* Brand & Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
            <Link size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight">NetPlan Studio</h1>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono px-1.5 py-0.2 rounded border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Diseñador de Redes, CCTV & IoT</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 pl-4 border-l border-slate-800">
          <span className="font-mono text-slate-300">{deviceCount}</span> dispositivos
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-300">{cableCount}</span> enlaces
        </div>
      </div>

      {/* Main Interactive Mode Tools */}
      <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
        {/* Selector Tool */}
        <button
          onClick={() => onSetTool('select')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Seleccionar y mover dispositivos (V)"
        >
          <MousePointer size={14} />
          <span>Mover</span>
        </button>

        {/* Cable Connection Tool */}
        <button
          onClick={() => onSetTool('cable')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            activeTool === 'cable'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Trazar cables de conexión (C)"
        >
          <Link size={14} />
          <span>Cablear</span>
        </button>

        {/* Pan Canvas Tool */}
        <button
          onClick={() => onSetTool('pan')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            activeTool === 'pan'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Desplazar plano (H / Espacio)"
        >
          <Hand size={14} />
          <span>Mano</span>
        </button>

        {/* Cable Type Selector */}
        <div className="h-4 w-px bg-slate-800 mx-1" />
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: CABLE_STYLES[activeCableType]?.color }}
          />
          <select
            value={activeCableType}
            onChange={(e) => onSetCableType(e.target.value as CableType)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
          >
            {Object.values(CABLE_STYLES).map((st) => (
              <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layer Toggles & View Toggles */}
      <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800/80">
        {/* Grid Snap Toggle */}
        <button
          onClick={onToggleSnapGrid}
          className={`p-1.5 rounded text-xs transition cursor-pointer ${
            snapGrid
              ? 'bg-blue-950/60 text-blue-400 border border-blue-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Alinear automáticamente a la cuadrícula"
        >
          <Grid size={16} />
        </button>

        {/* Wi-Fi Coverage overlay toggle */}
        <button
          onClick={onToggleWifiCoverage}
          className={`p-1.5 rounded text-xs transition cursor-pointer ${
            showWifiCoverage
              ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Mostrar / Ocultar zonas de cobertura Wi-Fi"
        >
          <Wifi size={16} />
        </button>

        {/* Camera FOV overlay toggle */}
        <button
          onClick={onToggleCameraFOV}
          className={`p-1.5 rounded text-xs transition cursor-pointer ${
            showCameraFOV
              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Mostrar / Ocultar conos de visión CCTV"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Action Buttons: Background, BOM, Export */}
      <div className="flex items-center gap-2">
        {/* Cargar Plano de Fondo */}
        <button
          onClick={onOpenBackgroundModal}
          className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <ImageIcon size={14} className="text-blue-400" />
          <span>Fondo / Plano</span>
        </button>

        {/* Bill of Materials (BOM) */}
        <button
          onClick={onOpenBOMModal}
          className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <FileSpreadsheet size={14} className="text-emerald-400" />
          <span>Lista Materiales</span>
        </button>

        {/* Guardar / Exportar */}
        <button
          onClick={onOpenExportModal}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <Download size={14} />
          <span>Exportar</span>
        </button>

        {/* Limpiar */}
        <button
          onClick={onClearCanvas}
          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          title="Limpiar plano completo"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  );
};
