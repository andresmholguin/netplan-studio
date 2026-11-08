import { DeviceCategory, DeviceDefinition, CableStyle } from '../types';

export const DEVICE_CATEGORIES: { id: DeviceCategory; label: string; icon: string }[] = [
  { id: 'network', label: 'Redes y Routing', icon: 'Network' },
  { id: 'computers', label: 'Computadoras y Puestos', icon: 'Monitor' },
  { id: 'servers', label: 'Servidores y Racks', icon: 'Server' },
  { id: 'wireless', label: 'Wi-Fi e Inalámbrico', icon: 'Wifi' },
  { id: 'cctv', label: 'Cámaras y Seguridad', icon: 'Camera' },
  { id: 'iot', label: 'Internet de las Cosas (IoT)', icon: 'Cpu' },
  { id: 'power', label: 'Energía y Respaldo', icon: 'Zap' },
];

export const DEVICE_DEFINITIONS: DeviceDefinition[] = [
  // REDES
  {
    type: 'router_core',
    name: 'Router Core / Gateway',
    category: 'network',
    icon: 'Router',
    color: '#0284c7', // Sky 600
    description: 'Enrutador de borde o gateway principal con WAN/LAN',
    defaultPorts: 8,
  },
  {
    type: 'switch_managed',
    name: 'Switch Administrable (24p)',
    category: 'network',
    icon: 'Network',
    color: '#2563eb', // Blue 600
    description: 'Switch Gigabit Capa 2/3 para distribución de red',
    defaultPorts: 24,
  },
  {
    type: 'switch_poe',
    name: 'Switch PoE+ (24p)',
    category: 'network',
    icon: 'Boxes',
    color: '#7c3aed', // Purple 600
    description: 'Switch con Power over Ethernet para cámaras y Access Points',
    isPoE: true,
    defaultPorts: 24,
  },
  {
    type: 'firewall',
    name: 'Firewall / UTM de Seguridad',
    category: 'network',
    icon: 'ShieldCheck',
    color: '#dc2626', // Red 600
    description: 'Dispositivo perimetral para inspección de paquetes y VPN',
    defaultPorts: 6,
  },
  {
    type: 'ont_modem',
    name: 'Módem / ONT de Fibra',
    category: 'network',
    icon: 'Radio',
    color: '#0891b2', // Cyan 600
    description: 'Terminación óptica del proveedor de internet (ISP)',
    defaultPorts: 4,
  },
  {
    type: 'patch_panel',
    name: 'Patch Panel (24 Puertos)',
    category: 'network',
    icon: 'Grid',
    color: '#475569', // Slate 600
    description: 'Panel de interconexión y parcheo de cableado estructurado',
    defaultPorts: 24,
  },

  // COMPUTADORAS
  {
    type: 'pc_desktop',
    name: 'PC de Escritorio',
    category: 'computers',
    icon: 'Monitor',
    color: '#0ea5e9',
    description: 'Computadora de escritorio con puerto Ethernet RJ45',
  },
  {
    type: 'laptop',
    name: 'Laptop / Portátil',
    category: 'computers',
    icon: 'Laptop',
    color: '#38bdf8',
    description: 'Computadora portátil conectada por Wi-Fi o Ethernet',
  },
  {
    type: 'workstation',
    name: 'Estación de Trabajo CAD/Dev',
    category: 'computers',
    icon: 'Cpu',
    color: '#6366f1',
    description: 'Equipo de alto rendimiento con doble tarjeta de red',
  },
  {
    type: 'printer_network',
    name: 'Impresora Multifuncional de Red',
    category: 'computers',
    icon: 'Printer',
    color: '#64748b',
    description: 'Impresora compartida por IP en red local',
  },
  {
    type: 'pos_terminal',
    name: 'Terminal Punto de Venta (POS)',
    category: 'computers',
    icon: 'CreditCard',
    color: '#10b981',
    description: 'Terminal de cobro y caja conectada a la red comercial',
  },

  // SERVIDORES
  {
    type: 'server_rack',
    name: 'Gabinete Rack de Servidores 42U',
    category: 'servers',
    icon: 'Server',
    color: '#1e293b',
    description: 'Gabinete principal para servidores, switches y patch panels',
  },
  {
    type: 'server_blade',
    name: 'Servidor Físico / Blade',
    category: 'servers',
    icon: 'HardDrive',
    color: '#3b82f6',
    description: 'Servidor dedicado para virtualización, bases de datos o AD',
  },
  {
    type: 'nas_storage',
    name: 'Almacenamiento NAS / SAN',
    category: 'servers',
    icon: 'Database',
    color: '#8b5cf6',
    description: 'Unidad de almacenamiento masivo y copias de seguridad',
  },

  // WI-FI E INALÁMBRICO
  {
    type: 'ap_indoor',
    name: 'Access Point Wi-Fi 6 Interior',
    category: 'wireless',
    icon: 'Wifi',
    color: '#06b6d4',
    description: 'Punto de acceso de techo con cobertura omnidireccional',
    hasCoverage: true,
    defaultCoverageRadius: 12, // metros
  },
  {
    type: 'ap_outdoor',
    name: 'Access Point Outdoor / Exterior',
    category: 'wireless',
    icon: 'Antenna',
    color: '#0284c7',
    description: 'Punto de acceso de largo alcance resistente a la intemperie',
    hasCoverage: true,
    defaultCoverageRadius: 25,
  },
  {
    type: 'wifi_mesh',
    name: 'Nodo Repetidor Mesh',
    category: 'wireless',
    icon: 'Maximize2',
    color: '#14b8a6',
    description: 'Nodo inalámbrico para extensión de cobertura de red',
    hasCoverage: true,
    defaultCoverageRadius: 10,
  },

  // CÁMARAS Y SEGURIDAD
  {
    type: 'cctv_dome',
    name: 'Cámara Domo IP Interior',
    category: 'cctv',
    icon: 'Camera',
    color: '#f59e0b',
    description: 'Cámara de seguridad PoE de alta definición',
    isPoE: true,
    hasCameraFOV: true,
    defaultFOVAngle: 85,
    defaultFOVDistance: 12,
  },
  {
    type: 'cctv_bullet',
    name: 'Cámara Tipo Bala Exterior',
    category: 'cctv',
    icon: 'Video',
    color: '#d97706',
    description: 'Cámara de videovigilancia infrarroja de largo alcance',
    isPoE: true,
    hasCameraFOV: true,
    defaultFOVAngle: 65,
    defaultFOVDistance: 20,
  },
  {
    type: 'cctv_ptz',
    name: 'Cámara PTZ 360° Motorizada',
    category: 'cctv',
    icon: 'Compass',
    color: '#ea580c',
    description: 'Cámara motorizada con paneo, inclinación y zoom óptico',
    isPoE: true,
    hasCameraFOV: true,
    defaultFOVAngle: 120,
    defaultFOVDistance: 30,
  },
  {
    type: 'nvr_recorder',
    name: 'Grabador NVR / DVR',
    category: 'cctv',
    icon: 'Film',
    color: '#78350f',
    description: 'Grabador digital de red para gestión y almacenamiento de video',
  },
  {
    type: 'access_control',
    name: 'Control de Acceso Biométrico / RFID',
    category: 'cctv',
    icon: 'KeyRound',
    color: '#e11d48',
    description: 'Lector de tarjetas y huella para apertura de puertas',
  },

  // INTERNET DE LAS COSAS (IoT)
  {
    type: 'iot_gateway',
    name: 'Gateway IoT (Zigbee / Matter)',
    category: 'iot',
    icon: 'Share2',
    color: '#10b981',
    description: 'Concentrador inalámbrico para sensores y actuadores inteligentes',
    hasCoverage: true,
    defaultCoverageRadius: 15,
  },
  {
    type: 'sensor_motion',
    name: 'Sensor de Movimiento PIR IoT',
    category: 'iot',
    icon: 'Activity',
    color: '#059669',
    description: 'Sensor infrarrojo para automatización y seguridad',
    hasCameraFOV: true,
    defaultFOVAngle: 90,
    defaultFOVDistance: 8,
  },
  {
    type: 'sensor_temp',
    name: 'Sensor Temperatura / Humedad',
    category: 'iot',
    icon: 'Thermometer',
    color: '#047857',
    description: 'Sensor ambiental para servidores o confort climático',
  },
  {
    type: 'smart_lock',
    name: 'Cerradura Inteligente Smart Lock',
    category: 'iot',
    icon: 'Lock',
    color: '#15803d',
    description: 'Cerradura motorizada con control remoto y bitácora',
  },
  {
    type: 'smart_light',
    name: 'Actuador / Iluminación Smart',
    category: 'iot',
    icon: 'Lightbulb',
    color: '#eab308',
    description: 'Módulo inteligente para control de luminarias',
  },
  {
    type: 'smart_plug',
    name: 'Enchufe Medidor de Energía Smart',
    category: 'iot',
    icon: 'Power',
    color: '#16a34a',
    description: 'Toma eléctrica con telemetría de consumo eléctrico y corte remoto',
  },

  // ENERGÍA
  {
    type: 'ups_rack',
    name: 'UPS / SAI On-Line (3kVA)',
    category: 'power',
    icon: 'Zap',
    color: '#f97316',
    description: 'Sistema de alimentación ininterrumpida para protección de cortes',
  },
  {
    type: 'pdu_rack',
    name: 'PDU Administrable',
    category: 'power',
    icon: 'BatteryCharging',
    color: '#c2410c',
    description: 'Regleta de distribución de energía con medición por puerto',
  },
];

export const CABLE_STYLES: Record<string, CableStyle> = {
  cat6: {
    id: 'cat6',
    label: 'Ethernet Cat6 (RJ45)',
    color: '#3b82f6', // Bright Blue
    strokeWidth: 3,
    speed: '1 Gbps / 10 Gbps',
    description: 'Cable de cobre UTP/STP para estaciones y datos',
  },
  fiber: {
    id: 'fiber',
    label: 'Fibra Óptica (OM3/OS2)',
    color: '#f59e0b', // Amber / Orange
    strokeWidth: 3,
    dashArray: '8,4',
    speed: '10 Gbps / 40 Gbps / 100 Gbps',
    description: 'Enlace troncal de alta velocidad e inmunidad electromagnética',
  },
  poe: {
    id: 'poe',
    label: 'Ethernet PoE+ (Cámaras/APs)',
    color: '#a855f7', // Vivid Purple
    strokeWidth: 3.5,
    speed: '1 Gbps + 30W/60W Power',
    description: 'Alimentación eléctrica y datos en el mismo cable de red',
  },
  wifi: {
    id: 'wifi',
    label: 'Enlace Inalámbrico / Wi-Fi',
    color: '#06b6d4', // Cyan
    strokeWidth: 2.5,
    dashArray: '3,3',
    speed: 'Wi-Fi 6 / 5GHz',
    description: 'Conexión por radiofrecuencia sin cable físico',
  },
  serial: {
    id: 'serial',
    label: 'Cable Consola / Serial',
    color: '#10b981', // Emerald
    strokeWidth: 2,
    dashArray: '4,2',
    speed: 'RS232 / 115200 baud',
    description: 'Gestión local y configuración de equipamiento de red',
  },
  power: {
    id: 'power',
    label: 'Alimentación Eléctrica AC',
    color: '#ef4444', // Red
    strokeWidth: 2.5,
    speed: '110V - 220V',
    description: 'Línea de energía eléctrica o respaldo por UPS',
  },
};
