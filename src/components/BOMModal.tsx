import React, { useState } from 'react';
import { DeviceNode, CableConnection, ScaleConfig } from '../types';
import { CABLE_STYLES, DEVICE_CATEGORIES } from '../data/deviceCatalog';
import { pixelsToMeters } from '../utils/canvasMath';
import { X, FileSpreadsheet, Download, Printer, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface BOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: DeviceNode[];
  cables: CableConnection[];
  scale: ScaleConfig;
  projectName: string;
}

export const BOMModal: React.FC<BOMModalProps> = ({
  isOpen,
  onClose,
  devices,
  cables,
  scale,
  projectName,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'cables' | 'ips'>('summary');

  if (!isOpen) return null;

  // 1. Group devices by type & category
  const deviceCounts: Record<string, { name: string; count: number; category: string }> = {};
  devices.forEach((d) => {
    if (!deviceCounts[d.type]) {
      const cat = DEVICE_CATEGORIES.find((c) => c.id === d.category)?.label || d.category;
      deviceCounts[d.type] = { name: d.name.replace(/ #\d+/, ''), count: 0, category: cat };
    }
    deviceCounts[d.type].count += 1;
  });

  // 2. Calculate cable lengths by type
  const cableMetrics: Record<string, { lengthMeters: number; count: number }> = {};
  cables.forEach((c) => {
    const from = devices.find((d) => d.id === c.fromId);
    const to = devices.find((d) => d.id === c.toId);
    if (from && to) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const px = Math.sqrt(dx * dx + dy * dy);
      const meters = pixelsToMeters(px, scale.pixelsPerMeter);

      if (!cableMetrics[c.type]) {
        cableMetrics[c.type] = { lengthMeters: 0, count: 0 };
      }
      cableMetrics[c.type].lengthMeters += meters;
      cableMetrics[c.type].count += 1;
    }
  });

  // Export to CSV
  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'INVENTARIO DE DISPOSITIVOS\n';
    csvContent += 'Nombre,Tipo,Categoria,IP,VLAN,MAC,Estado\n';
    devices.forEach((d) => {
      csvContent += `"${d.name}","${d.type}","${d.category}","${d.ip || ''}","${d.vlan || ''}","${d.mac || ''}","${d.status}"\n`;
    });

    csvContent += '\nCABLEADO Y ENLACES\n';
    csvContent += 'Tipo de Cable,Conexiones,Metros Totales\n';
    Object.entries(cableMetrics).forEach(([type, data]) => {
      const style = CABLE_STYLES[type];
      csvContent += `"${style?.label || type}",${data.count},${Math.round(data.lengthMeters * 10) / 10}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${projectName.toLowerCase().replace(/\s+/g, '_')}_bom.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Lista de Materiales y Auditoría (BOM)</h2>
              <p className="text-xs text-slate-400">
                Resumen de equipos, métricas de cableado y direccionamiento IP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download size={14} />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Subheader Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'summary'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Equipos y Dispositivos ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('cables')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'cables'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Métricas de Cableado ({cables.length})
          </button>
          <button
            onClick={() => setActiveTab('ips')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'ips'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Plan de Direccionamiento IP
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 block">Total Dispositivos</span>
                  <span className="text-2xl font-bold text-white font-mono">{devices.length}</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 block">Total Conexiones</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    {cables.length}
                  </span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
                  <span className="text-xs text-slate-400 block">Modelos Distintos</span>
                  <span className="text-2xl font-bold text-blue-400 font-mono">
                    {Object.keys(deviceCounts).length}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Equipo / Dispositivo</th>
                      <th className="py-2.5 px-4">Categoría</th>
                      <th className="py-2.5 px-4 text-right">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(deviceCounts).map(([type, item]) => (
                      <tr key={type} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-4 font-medium text-white">{item.name}</td>
                        <td className="py-2.5 px-4 text-slate-400">{item.category}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                    {devices.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500">
                          No hay dispositivos agregados todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cables' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Tipo de Cable</th>
                      <th className="py-2.5 px-4">Especificación</th>
                      <th className="py-2.5 px-4 text-center">Conexiones</th>
                      <th className="py-2.5 px-4 text-right">Metros Totales</th>
                      <th className="py-2.5 px-4 text-right">Pies (ft)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(cableMetrics).map(([type, data]) => {
                      const style = CABLE_STYLES[type];
                      const meters = Math.round(data.lengthMeters * 10) / 10;
                      const feet = Math.round(meters * 3.28084);
                      return (
                        <tr key={type} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-medium text-white flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: style?.color }}
                            />
                            {style?.label || type}
                          </td>
                          <td className="py-2.5 px-4 text-slate-400">{style?.speed || '-'}</td>
                          <td className="py-2.5 px-4 text-center font-mono text-slate-300">
                            {data.count}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-400">
                            {meters} m
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                            {feet} ft
                          </td>
                        </tr>
                      );
                    })}
                    {cables.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No hay cables trazados en el plano aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ips' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Dispositivo</th>
                      <th className="py-2.5 px-4">Dirección IP</th>
                      <th className="py-2.5 px-4">VLAN</th>
                      <th className="py-2.5 px-4">MAC</th>
                      <th className="py-2.5 px-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {devices.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-4 font-medium text-white">{d.name}</td>
                        <td className="py-2.5 px-4 font-mono text-blue-400">{d.ip || '-'}</td>
                        <td className="py-2.5 px-4 text-slate-300">{d.vlan || '-'}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">{d.mac || '-'}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                              d.status === 'online'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : d.status === 'warning'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {devices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No hay dispositivos en el plano.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
