import React, { useState, useMemo } from 'react';
import { DEVICE_CATEGORIES, DEVICE_DEFINITIONS } from '../data/deviceCatalog';
import { DeviceCategory, DeviceDefinition } from '../types';
import { DeviceIcon } from './DeviceIcon';
import { Search, ChevronDown, ChevronRight, Plus, GripVertical, Info } from 'lucide-react';

interface SidebarProps {
  onAddDevice: (deviceDef: DeviceDefinition) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddDevice }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredDevices = useMemo(() => {
    return DEVICE_DEFINITIONS.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.description.toLowerCase().includes(search.toLowerCase()) ||
        device.type.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Group devices by category
  const groupedDevices = useMemo(() => {
    const groups: Record<DeviceCategory, DeviceDefinition[]> = {
      network: [],
      computers: [],
      servers: [],
      wireless: [],
      cctv: [],
      iot: [],
      power: [],
    };

    filteredDevices.forEach((device) => {
      if (groups[device.category]) {
        groups[device.category].push(device);
      }
    });

    return groups;
  }, [filteredDevices]);

  const handleDragStart = (e: React.DragEvent, device: DeviceDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(device));
    e.dataTransfer.setData('device-type', device.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-80 h-full bg-slate-900/95 border-r border-slate-800 flex flex-col select-none shrink-0 z-20">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Biblioteca de Dispositivos
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {filteredDevices.length} items
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar PC, Switch, Router, IoT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Category Pills (horizontal scroll) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition cursor-pointer font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Todos
          </button>
          {DEVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition cursor-pointer font-medium flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Helper Banner */}
      <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-900/30 flex items-center gap-2 text-[11px] text-blue-300">
        <Info size={14} className="shrink-0 text-blue-400" />
        <span>Arrastra los iconos directamente al plano arquitectónico.</span>
      </div>

      {/* Device List Accordion */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {DEVICE_CATEGORIES.map((cat) => {
          const devicesInCat = groupedDevices[cat.id] || [];
          if (devicesInCat.length === 0) return null;

          const isCollapsed = collapsedCategories[cat.id];

          return (
            <div key={cat.id} className="space-y-1.5">
              <button
                onClick={() => toggleCategoryCollapse(cat.id)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 px-1 rounded transition"
              >
                <div className="flex items-center gap-1.5">
                  <DeviceIcon name={cat.icon} size={14} className="text-blue-400" />
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({devicesInCat.length})
                  </span>
                </div>
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {devicesInCat.map((device) => (
                    <div
                      key={device.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, device)}
                      onClick={() => onAddDevice(device)}
                      className="group flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-grab active:cursor-grabbing hover:shadow-md"
                      title={device.description}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GripVertical
                          size={14}
                          className="text-slate-600 group-hover:text-slate-400 shrink-0"
                        />
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-xs"
                          style={{
                            backgroundColor: `${device.color}18`,
                            borderColor: `${device.color}40`,
                            color: device.color,
                          }}
                        >
                          <DeviceIcon name={device.icon} size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                            {device.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            {device.isPoE && (
                              <span className="text-[9px] px-1 py-0.2 bg-purple-900/60 text-purple-300 rounded font-mono">
                                PoE
                              </span>
                            )}
                            {device.hasCoverage && (
                              <span className="text-[9px] px-1 py-0.2 bg-cyan-900/60 text-cyan-300 rounded font-mono">
                                Wi-Fi {device.defaultCoverageRadius}m
                              </span>
                            )}
                            {device.hasCameraFOV && (
                              <span className="text-[9px] px-1 py-0.2 bg-amber-900/60 text-amber-300 rounded font-mono">
                                FOV {device.defaultFOVAngle}°
                              </span>
                            )}
                            {device.defaultPorts && (
                              <span className="text-[9px] px-1 py-0.2 bg-slate-700/60 text-slate-300 rounded font-mono">
                                {device.defaultPorts}p
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddDevice(device);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded transition shrink-0 ml-1"
                        title="Añadir al centro del plano"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredDevices.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No se encontraron dispositivos para "{search}"
          </div>
        )}
      </div>
    </aside>
  );
};
