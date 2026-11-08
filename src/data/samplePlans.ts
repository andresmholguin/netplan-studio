// High quality architectural SVG floor plans encoded as data URLs

const createSvgDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// 1. Corporate Office Blueprint
const officeSvg = `
<svg width="1400" height="900" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1400" height="900" fill="#0f172a" />
  <rect width="1400" height="900" fill="url(#grid)" />
  
  <!-- Outer Walls -->
  <rect x="50" y="50" width="1300" height="800" rx="4" fill="#131c31" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.8"/>
  
  <!-- Interior Room: Server Room / MDF (Top-Left) -->
  <rect x="50" y="50" width="300" height="240" fill="#1e1b4b" stroke="#818cf8" stroke-width="3" />
  <text x="70" y="90" fill="#a5b4fc" font-family="sans-serif" font-size="16" font-weight="bold">SALA MDF / SERVIDORES</text>
  <text x="70" y="115" fill="#6366f1" font-family="sans-serif" font-size="12">Climatizado 18°C - Acceso Restringido</text>
  <!-- Server rack spots in MDF -->
  <rect x="75" y="140" width="60" height="110" rx="2" fill="#312e81" stroke="#a5b4fc" stroke-dasharray="3,3" />
  <text x="85" y="200" fill="#c7d2fe" font-size="11" font-family="sans-serif">RACK A</text>
  <rect x="150" y="140" width="60" height="110" rx="2" fill="#312e81" stroke="#a5b4fc" stroke-dasharray="3,3" />
  <text x="160" y="200" fill="#c7d2fe" font-size="11" font-family="sans-serif">RACK B</text>
  <!-- Door MDF -->
  <path d="M 350 210 A 50 50 0 0 0 350 260" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,2"/>
  
  <!-- Interior Room: Sala de Conferencias / Boardroom (Top-Center) -->
  <rect x="350" y="50" width="460" height="240" fill="#172554" stroke="#60a5fa" stroke-width="3"/>
  <text x="375" y="90" fill="#93c5fd" font-family="sans-serif" font-size="16" font-weight="bold">SALA DE JUNTAS PRINCIPAL</text>
  <!-- Conference Table -->
  <rect x="440" y="125" width="280" height="90" rx="35" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
  <text x="530" y="175" fill="#bfdbfe" font-size="13" font-family="sans-serif">Mesa de Conferencias</text>
  <!-- Chairs -->
  <circle cx="480" cy="105" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="540" cy="105" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="600" cy="105" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="660" cy="105" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="480" cy="235" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="540" cy="235" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="600" cy="235" r="10" fill="#3b82f6" opacity="0.6"/>
  <circle cx="660" cy="235" r="10" fill="#3b82f6" opacity="0.6"/>

  <!-- Interior Room: Gerencia / Dirección (Top-Right) -->
  <rect x="810" y="50" width="540" height="240" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
  <text x="835" y="90" fill="#e2e8f0" font-family="sans-serif" font-size="16" font-weight="bold">OFICINA GERENCIA / DIRECCIÓN</text>
  <!-- Executive Desk -->
  <rect x="980" y="125" width="200" height="80" rx="4" fill="#334155" stroke="#64748b" stroke-width="1.5"/>

  <!-- Open Office / Área Operativa (Middle/Center) -->
  <rect x="50" y="290" width="950" height="360" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <text x="80" y="330" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="bold">ÁREA OPERATIVA / OPEN SPACE</text>
  
  <!-- Desk clusters -->
  <!-- Cluster 1 -->
  <g transform="translate(100, 360)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 1</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 2</text>
  </g>
  <!-- Cluster 2 -->
  <g transform="translate(360, 360)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 3</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 4</text>
  </g>
  <!-- Cluster 3 -->
  <g transform="translate(620, 360)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 5</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 6</text>
  </g>
  <!-- Cluster 4 -->
  <g transform="translate(100, 500)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 7</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 8</text>
  </g>
  <!-- Cluster 5 -->
  <g transform="translate(360, 500)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 9</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 10</text>
  </g>
  <!-- Cluster 6 -->
  <g transform="translate(620, 500)">
    <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#475569"/>
    <line x1="90" y1="0" x2="90" y2="100" stroke="#334155"/>
    <text x="25" y="55" fill="#94a3b8" font-size="11">Puesto 11</text>
    <text x="115" y="55" fill="#94a3b8" font-size="11">Puesto 12</text>
  </g>

  <!-- Recepción y Acceso Principal (Bottom-Right) -->
  <rect x="1000" y="290" width="350" height="360" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
  <text x="1030" y="330" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">RECEPCIÓN Y ACCESO</text>
  <!-- Reception desk curved -->
  <path d="M 1060 420 Q 1160 380 1260 420 L 1260 450 Q 1160 410 1060 450 Z" fill="#0284c7" opacity="0.6"/>
  <text x="1120" y="440" fill="#ffffff" font-size="12">Mostrador</text>
  <!-- Main Entrance Doors -->
  <rect x="1335" y="440" width="15" height="100" fill="#38bdf8"/>
  <text x="1270" y="500" fill="#38bdf8" font-size="12" font-weight="bold">ACCESO &gt;&gt;</text>

  <!-- Cafetería / Breakroom (Bottom-Left) -->
  <rect x="50" y="650" width="460" height="200" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <text x="75" y="685" fill="#cbd5e1" font-family="sans-serif" font-size="16" font-weight="bold">CAFETERÍA / DESCANSO</text>
  
  <!-- Sala de Capacitación / Soporte (Bottom-Center) -->
  <rect x="510" y="650" width="490" height="200" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <text x="535" y="685" fill="#cbd5e1" font-family="sans-serif" font-size="16" font-weight="bold">SOPORTE TI / LAB</text>

  <!-- Pasillo & Servicios (Bottom-Right corner) -->
  <rect x="1000" y="650" width="350" height="200" fill="#0f172a" stroke="#475569" stroke-width="2"/>
  <text x="1025" y="685" fill="#94a3b8" font-family="sans-serif" font-size="14">SERVICIOS / SANITARIOS</text>
</svg>
`;

// 2. Datacenter Blueprint
const datacenterSvg = `
<svg width="1400" height="900" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dc_grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1400" height="900" fill="#090d16" />
  <rect width="1400" height="900" fill="url(#dc_grid)" />

  <rect x="40" y="40" width="1320" height="820" fill="none" stroke="#6366f1" stroke-width="4"/>
  <text x="70" y="80" fill="#818cf8" font-family="sans-serif" font-size="22" font-weight="bold">DATACENTER TIER III - SALA BLANCA</text>

  <!-- Row 1 Racks (Cold Aisle) -->
  <g transform="translate(100, 160)">
    <text x="0" y="-15" fill="#38bdf8" font-size="14" font-weight="bold">FILA A - RACKS DE CÓMPUTO Y VIRTUALIZACIÓN</text>
    <rect x="0" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="15" y="75" fill="#a5b4fc" font-size="12">RACK A1</text>
    <rect x="100" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="115" y="75" fill="#a5b4fc" font-size="12">RACK A2</text>
    <rect x="200" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="215" y="75" fill="#a5b4fc" font-size="12">RACK A3</text>
    <rect x="300" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="315" y="75" fill="#a5b4fc" font-size="12">RACK A4</text>
    <rect x="400" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="415" y="75" fill="#a5b4fc" font-size="12">RACK A5</text>
  </g>

  <!-- Row 2 Racks (Hot Aisle Middle) -->
  <g transform="translate(100, 360)">
    <text x="0" y="-15" fill="#f43f5e" font-size="14" font-weight="bold">FILA B - RACKS DE ALMACENAMIENTO SAN / NAS</text>
    <rect x="0" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="15" y="75" fill="#a5b4fc" font-size="12">RACK B1</text>
    <rect x="100" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="115" y="75" fill="#a5b4fc" font-size="12">RACK B2</text>
    <rect x="200" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="215" y="75" fill="#a5b4fc" font-size="12">RACK B3</text>
    <rect x="300" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="315" y="75" fill="#a5b4fc" font-size="12">RACK B4</text>
    <rect x="400" y="0" width="80" height="140" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
    <text x="415" y="75" fill="#a5b4fc" font-size="12">RACK B5</text>
  </g>

  <!-- Row 3 Racks (Core Network) -->
  <g transform="translate(100, 560)">
    <text x="0" y="-15" fill="#10b981" font-size="14" font-weight="bold">FILA C - CORE NETWORKING & FIREWALLS</text>
    <rect x="0" y="0" width="80" height="140" fill="#042f2e" stroke="#14b8a6" stroke-width="2"/>
    <text x="15" y="75" fill="#5eead4" font-size="12">CORE 1</text>
    <rect x="100" y="0" width="80" height="140" fill="#042f2e" stroke="#14b8a6" stroke-width="2"/>
    <text x="115" y="75" fill="#5eead4" font-size="12">CORE 2</text>
    <rect x="200" y="0" width="80" height="140" fill="#042f2e" stroke="#14b8a6" stroke-width="2"/>
    <text x="215" y="75" fill="#5eead4" font-size="12">ISP BORDER</text>
    <rect x="300" y="0" width="80" height="140" fill="#042f2e" stroke="#14b8a6" stroke-width="2"/>
    <text x="315" y="75" fill="#5eead4" font-size="12">DIST-SW</text>
  </g>

  <!-- NOC Room / Control Room (Right Side) -->
  <rect x="750" y="100" width="570" height="400" fill="#111827" stroke="#374151" stroke-width="3"/>
  <text x="780" y="140" fill="#f9fafb" font-size="18" font-weight="bold">CENTRO DE OPERACIONES DE RED (NOC)</text>
  <rect x="800" y="180" width="480" height="70" rx="6" fill="#1f2937" stroke="#4b5563"/>
  <text x="960" y="220" fill="#9ca3af" font-size="13">Consola Monitoreo NOC 24/7</text>

  <!-- Power & UPS Room (Right Bottom) -->
  <rect x="750" y="540" width="570" height="280" fill="#451a03" stroke="#d97706" stroke-width="3"/>
  <text x="780" y="580" fill="#fbbf24" font-size="18" font-weight="bold">SALA DE ENERGÍA / UPS & GENERADOR</text>
  <rect x="780" y="610" width="140" height="160" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
  <text x="800" y="695" fill="#fde68a" font-size="13">UPS BANCO 1</text>
  <rect x="950" y="610" width="140" height="160" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
  <text x="970" y="695" fill="#fde68a" font-size="13">UPS BANCO 2</text>
  <rect x="1120" y="610" width="140" height="160" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
  <text x="1145" y="695" fill="#fde68a" font-size="13">TRANSFER</text>
</svg>
`;

// 3. Smart Home / Casa Inteligente Blueprint
const smartHomeSvg = `
<svg width="1400" height="900" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="home_grid" width="35" height="35" patternUnits="userSpaceOnUse">
      <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1400" height="900" fill="#0f172a" />
  <rect width="1400" height="900" fill="url(#home_grid)" />

  <rect x="60" y="60" width="1280" height="780" fill="#111827" stroke="#10b981" stroke-width="4"/>
  <text x="90" y="100" fill="#34d399" font-family="sans-serif" font-size="20" font-weight="bold">RESIDENCIA INTELIGENTE / PLANO DOMÓTICO</text>

  <!-- Living Room / Salón -->
  <rect x="60" y="120" width="580" height="420" fill="#132a24" stroke="#059669" stroke-width="2"/>
  <text x="90" y="160" fill="#6ee7b7" font-size="16" font-weight="bold">SALA DE ESTAR / HOME CINEMA</text>
  <rect x="160" y="240" width="280" height="120" rx="8" fill="#064e3b" stroke="#10b981"/>
  <text x="260" y="305" fill="#a7f3d0" font-size="14">Sofá Principal</text>

  <!-- Cocina / Kitchen -->
  <rect x="640" y="120" width="400" height="420" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <text x="665" y="160" fill="#cbd5e1" font-size="16" font-weight="bold">COCINA & COMEDOR</text>

  <!-- Garaje / Entrada -->
  <rect x="1040" y="120" width="300" height="420" fill="#18181b" stroke="#52525b" stroke-width="2"/>
  <text x="1070" y="160" fill="#a1a1aa" font-size="16" font-weight="bold">GARAJE & ENTRADA</text>

  <!-- Master Bedroom -->
  <rect x="60" y="540" width="480" height="300" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
  <text x="90" y="580" fill="#a5b4fc" font-size="16" font-weight="bold">HABITACIÓN PRINCIPAL</text>

  <!-- Bedroom 2 / Estudio -->
  <rect x="540" y="540" width="450" height="300" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
  <text x="565" y="580" fill="#93c5fd" font-size="16" font-weight="bold">ESTUDIO / HOME OFFICE</text>

  <!-- Terraza / Patio Exterior -->
  <rect x="990" y="540" width="350" height="300" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
  <text x="1020" y="580" fill="#86efac" font-size="16" font-weight="bold">PATIO & JARDÍN</text>
</svg>
`;

export interface SampleFloorPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  imageSrc: string;
}

export const SAMPLE_PLANS: SampleFloorPlan[] = [
  {
    id: 'office',
    name: 'Oficinas Corporativas',
    description: 'Plano empresarial con sala de servidores (MDF), salas de juntas, puestos operativos y recepción',
    category: 'Empresarial',
    imageSrc: createSvgDataUrl(officeSvg),
  },
  {
    id: 'datacenter',
    name: 'Datacenter / Sala Blanca',
    description: 'Distribución de racks de cómputo, storage, switches core, sala NOC y área de UPS',
    category: 'Infraestructura',
    imageSrc: createSvgDataUrl(datacenterSvg),
  },
  {
    id: 'smarthome',
    name: 'Casa Inteligente / Domótica',
    description: 'Residencia con sala de estar, cocina, estudio, garaje, habitaciones y patio para IoT',
    category: 'Residencial',
    imageSrc: createSvgDataUrl(smartHomeSvg),
  },
];
