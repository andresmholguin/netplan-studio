import React, { useRef } from 'react';
import { ProjectState } from '../types';
import { Download, Upload, Image, FileCode, Check, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectState: ProjectState;
  onLoadProject: (state: ProjectState) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectState,
  onLoadProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Export as JSON (.netplan)
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${projectState.projectName.toLowerCase().replace(/\s+/g, '_')}.netplan`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. Import JSON (.netplan)
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.devices) && Array.isArray(parsed.cables)) {
            onLoadProject(parsed);
            onClose();
          } else {
            alert('El archivo no tiene el formato válido de NetPlan Studio.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // 3. Export as PNG image using Canvas API
  const handleExportPNG = () => {
    const canvas = document.createElement('canvas');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Function to draw devices & cables after image loads (if any)
    const drawElements = () => {
      // Draw cables
      projectState.cables.forEach((c) => {
        const from = projectState.devices.find((d) => d.id === c.fromId);
        const to = projectState.devices.find((d) => d.id === c.toId);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = c.type === 'fiber' ? '#f59e0b' : c.type === 'poe' ? '#a855f7' : '#3b82f6';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      // Draw devices
      projectState.devices.forEach((d) => {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = d.color || '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(d.x - 25, d.y - 25, 50, 50, 10);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.name, d.x, d.y + 40);

        if (d.ip) {
          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px monospace';
          ctx.fillText(d.ip, d.x, d.y + 54);
        }
      });

      // Header watermark & Title
      ctx.fillStyle = '#0f172aee';
      ctx.fillRect(20, 20, 360, 70);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, 360, 70);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(projectState.projectName, 35, 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(
        `Dispositivos: ${projectState.devices.length} | Conexiones: ${projectState.cables.length}`,
        35,
        68
      );

      // Download
      const link = document.createElement('a');
      link.download = `${projectState.projectName.toLowerCase().replace(/\s+/g, '_')}_plano.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    if (projectState.background.imageSrc) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.globalAlpha = projectState.background.opacity;
        ctx.drawImage(
          img,
          projectState.background.x,
          projectState.background.y,
          projectState.background.width * projectState.background.scale,
          projectState.background.height * projectState.background.scale
        );
        ctx.globalAlpha = 1;
        drawElements();
      };
      img.onerror = () => drawElements();
      img.src = projectState.background.imageSrc;
    } else {
      drawElements();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Guardar y Exportar Plano</h2>
              <p className="text-xs text-slate-400">Descarga tu proyecto o exporta planos en imagen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Card 1: PNG Image */}
          <div
            onClick={handleExportPNG}
            className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-blue-500 transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <Image size={22} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Exportar Plano en Imagen PNG</h4>
                <p className="text-xs text-slate-400">
                  Descarga una imagen de alta resolución con plano y conexiones
                </p>
              </div>
            </div>
            <Download size={18} className="text-slate-500 group-hover:text-blue-400" />
          </div>

          {/* Card 2: JSON .netplan File */}
          <div
            onClick={handleExportJSON}
            className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                <FileCode size={22} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Guardar Proyecto (.netplan)</h4>
                <p className="text-xs text-slate-400">
                  Guarda todo el diseño y coordenadas para editarlo después
                </p>
              </div>
            </div>
            <Download size={18} className="text-slate-500 group-hover:text-emerald-400" />
          </div>

          {/* Card 3: Import Project */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".netplan,.json"
            className="hidden"
            onChange={handleImportJSON}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-purple-500 transition cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                <Upload size={22} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Cargar Proyecto Existente</h4>
                <p className="text-xs text-slate-400">
                  Abre un archivo .netplan guardado previamente
                </p>
              </div>
            </div>
            <Upload size={18} className="text-slate-500 group-hover:text-purple-400" />
          </div>
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
