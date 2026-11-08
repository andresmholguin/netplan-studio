import React, { useRef } from 'react';
import { FloorPlanBackground, ScaleConfig } from '../types';
import { SAMPLE_PLANS } from '../data/samplePlans';
import { X, Upload, Sliders, CheckCircle2, Trash2 } from 'lucide-react';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  background: FloorPlanBackground;
  scale: ScaleConfig;
  onUpdateBackground: (updates: Partial<FloorPlanBackground>) => void;
  onUpdateScale: (updates: Partial<ScaleConfig>) => void;
}

export const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  background,
  scale,
  onUpdateBackground,
  onUpdateScale,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Create an image to get natural dimensions
        const img = new Image();
        img.onload = () => {
          onUpdateBackground({
            imageSrc: result,
            name: file.name,
            width: img.naturalWidth || 1200,
            height: img.naturalHeight || 800,
            scale: 1,
            x: 0,
            y: 0,
            opacity: 0.85,
            locked: true,
          });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSamplePlan = (planId: string) => {
    const sample = SAMPLE_PLANS.find((p) => p.id === planId);
    if (sample) {
      onUpdateBackground({
        imageSrc: sample.imageSrc,
        name: sample.name,
        width: 1400,
        height: 900,
        scale: 1,
        x: 0,
        y: 0,
        opacity: 0.85,
        locked: true,
      });
    }
  };

  const removeBackground = () => {
    onUpdateBackground({
      imageSrc: null,
      name: 'Sin plano (Cuadrícula limpia)',
      opacity: 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configuración del Plano de Fondo</h2>
              <p className="text-xs text-slate-400">
                Sube tu propio plano arquitectónico o utiliza una de las plantillas prediseñadas
              </p>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Subir archivo propio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Subir tu imagen de plano (PNG, JPG, SVG, WebP)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl p-6 transition group cursor-pointer text-center"
            >
              <div className="p-3 bg-blue-600/20 group-hover:bg-blue-600/30 text-blue-400 rounded-full mb-2 transition">
                <Upload size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
                Haz clic para explorar o arrastra aquí tu plano
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Formatos recomendados: PNG de alta resolución o SVG vectorial
              </span>
            </button>
          </div>

          {/* Plantillas de muestra integradas */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              O selecciona un plano de ejemplo incluido
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_PLANS.map((plan) => {
                const isSelected = background.name === plan.name;
                return (
                  <button
                    key={plan.id}
                    onClick={() => selectSamplePlan(plan.id)}
                    className={`relative p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-800/30 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-mono">
                          {plan.category}
                        </span>
                        {isSelected && <CheckCircle2 size={16} className="text-blue-400" />}
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">{plan.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{plan.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ajustes de imagen */}
          {background.imageSrc && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>Ajustes del Plano Actual ({background.name})</span>
                <button
                  onClick={removeBackground}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} /> Quitar plano
                </button>
              </h3>

              {/* Slider Opacidad */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Opacidad del plano</span>
                  <span className="font-mono text-blue-400">
                    {Math.round(background.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={background.opacity}
                  onChange={(e) => onUpdateBackground({ opacity: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Calibración de escala */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Escala de distancia (Píxeles por Metro)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={scale.pixelsPerMeter}
                      onChange={(e) =>
                        onUpdateScale({ pixelsPerMeter: Math.max(5, parseInt(e.target.value) || 20) })
                      }
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-white w-24 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <span className="text-xs text-slate-400">px = 1 metro</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Se utiliza para calcular con precisión la longitud de los cables.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Bloqueo de fondo</label>
                  <button
                    onClick={() => onUpdateBackground({ locked: !background.locked })}
                    className={`px-3 py-1.5 rounded text-xs font-medium border cursor-pointer transition ${
                      background.locked
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {background.locked
                      ? '🔒 Fondo Bloqueado (Recomendado)'
                      : '🔓 Fondo Desbloqueado (Permite mover el plano)'}
                  </button>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Evita mover el plano accidentalmente al arrastrar dispositivos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
          >
            Listo / Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
