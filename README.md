# NetPlan Studio 🌐📐

**NetPlan Studio** es una aplicación web interactiva diseñada para la creación de planos arquitectónicos y diagramas de topología de redes, telecomunicaciones, videovigilancia (CCTV) e Internet de las Cosas (IoT).

---

## 🚀 Características Principales

### 1. 🖼️ Montaje de Planos Arquitectónicos de Fondo
- **Carga de imágenes:** Sube tus propios planos en formato PNG, JPG, WebP o SVG vectorial.
- **Plantillas prediseñadas:** Incluye 3 planos arquitectónicos de alta fidelidad:
  - *Oficinas Corporativas* (Recepción, Sala de Servidores MDF, Salas de Juntas, Puestos Operativos).
  - *Datacenter Tier III* (Pasillos fríos/calientes, filas de racks, sala NOC y área UPS).
  - *Residencia Inteligente* (Plano domótico para proyectos residenciales).
- **Controles de plano:** Slider de opacidad (0 a 100%), bloqueo de capa de fondo para evitar movimientos accidentales, y calibrador de escala métrica (píxeles por metro).

### 2. 🖱️ Iconos Arrastrar y Soltar (Drag & Drop)
Arrastra cualquier dispositivo directamente desde la barra lateral izquierda hacia la posición exacta del plano. Soporta alineación magnética a la cuadrícula (*Snap to Grid*).

#### Biblioteca de Dispositivos Incluida:
- **Computadoras y Puestos:** PC de escritorio, Laptop, Workstation CAD/Dev, Impresora de Red, Terminal Punto de Venta (POS).
- **Redes y Conectividad:** Router Core/Gateway, Switch Administrable 24p, Switch PoE+, Firewall UTM, Módem/ONT de Fibra, Patch Panel.
- **Servidores y Racks:** Gabinete Rack 42U, Servidor Físico/Blade, Almacenamiento NAS/SAN.
- **Cámaras y Seguridad:** Cámara IP Domo, Cámara Bala exterior, Cámara PTZ 360°, Grabador NVR/DVR, Control de Acceso biométrico.
- **Internet de las Cosas (IoT):** Gateway Zigbee/Matter, Sensores de movimiento PIR, Sensores de temperatura/humedad, Cerradura inteligente, Enchufe inteligente, Iluminación domótica.
- **Inalámbrico (Wi-Fi):** Access Points interiores/exteriores y repetidores Mesh con visualización en tiempo real del radio de cobertura (*Heatmap*).
- **Energía:** UPS/SAI On-Line y regletas PDU administrables.

### 3. 🔌 Simulación de Cables y Enlaces
- Conexión intuitiva de dispositivo a dispositivo con vista previa elástica (*rubber-band*).
- Código de color y tipos de cable normalizados:
  - 🔵 **Ethernet Cat6 (RJ45)**: Línea azul continua de 1Gbps / 10Gbps.
  - 🟠 **Fibra Óptica (OM3/OS2)**: Línea ámbar discontinua troncal de alta velocidad.
  - 🟣 **Power over Ethernet (PoE+)**: Línea violeta con halo luminoso para cámaras y APs.
  - 🩵 **Enlace Inalámbrico (Wi-Fi)**: Onda cian punteada.
  - 🟢 **Cable de Consola / Serial**: Para configuración de routers y switches.
  - 🔴 **Alimentación Eléctrica AC**: Respaldo y acometida.
- **Métricas reales:** Cálculo automático de la longitud en metros y pies de cada tramo de cable.
- **Curvatura:** Curva ajustable para esquivar paredes o representar bandejas portacables.

### 4. 🎛️ Inspector de Propiedades
Al hacer clic en cualquier equipo o cable, puedes personalizar:
- Hostname / Nombre de equipo.
- Dirección IP, Máscara/VLAN y Dirección MAC.
- Modelo/Marca del fabricante (Cisco, Ubiquiti, Mikrotik, Hikvision, etc.).
- Estado operativo en vivo con indicador LED (En línea, Alerta, Desconectado).
- Para cámaras: Cono de visión (FOV), alcance en metros y ángulo de rotación.
- Para Wi-Fi: Slider de alcance y cobertura.

### 5. 📊 Lista de Materiales (BOM) y Auditoría
- Conteo automático de todos los equipos del proyecto.
- Metros acumulados de cada tipo de cable para compra y cotización de obra.
- Tabla consolidada de direccionamiento IP y VLANs con exportación a formato **CSV**.

### 6. 💾 Guardado y Exportación
- **Exportar en Imagen PNG:** Descarga del plano con leyenda y marcas técnicas.
- **Guardar Proyecto (`.netplan`):** Formato JSON para reabrir y continuar el diseño en cualquier momento.
- **Persistencia Local:** Guardado automático en el navegador para evitar pérdida de datos.

---

## 🛠️ Ejecución Local

```bash
cd netplan-studio
npm install
npm run dev
```

Abre en tu navegador: [http://localhost:5173/](http://localhost:5173/)
