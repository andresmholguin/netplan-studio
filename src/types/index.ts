export type DeviceCategory = 
  | 'computers'
  | 'network'
  | 'servers'
  | 'cctv'
  | 'iot'
  | 'wireless'
  | 'power';

export interface DeviceDefinition {
  type: string;
  name: string;
  category: DeviceCategory;
  icon: string;
  defaultPorts?: number;
  isPoE?: boolean;
  hasCoverage?: boolean;
  defaultCoverageRadius?: number; // in meters
  hasCameraFOV?: boolean;
  defaultFOVAngle?: number; // in degrees
  defaultFOVDistance?: number; // in meters
  description: string;
  color: string;
}

export interface DeviceNode {
  id: string;
  type: string;
  name: string;
  category: DeviceCategory;
  icon: string;
  x: number;
  y: number;
  ip?: string;
  mac?: string;
  vlan?: string;
  model?: string;
  notes?: string;
  status: 'online' | 'warning' | 'offline';
  color: string;
  // Wireless / Camera specific
  coverageRadius?: number; // in pixels
  cameraAngle?: number; // rotation in degrees
  cameraFOV?: number; // cone angle in degrees (e.g. 70)
  cameraDistance?: number; // cone distance in pixels
}

export type CableType = 
  | 'cat6'
  | 'fiber'
  | 'poe'
  | 'wifi'
  | 'serial'
  | 'power';

export interface CableStyle {
  id: CableType;
  label: string;
  color: string;
  strokeWidth: number;
  dashArray?: string;
  speed: string;
  description: string;
}

export interface CableConnection {
  id: string;
  fromId: string;
  toId: string;
  type: CableType;
  label?: string;
  fromPort?: string;
  toPort?: string;
  curvature?: number; // 0 for straight, positive/negative for bend
}

export interface FloorPlanBackground {
  imageSrc: string | null;
  name: string;
  opacity: number; // 0 to 1
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
  locked: boolean;
}

export interface ScaleConfig {
  pixelsPerMeter: number; // default: 20px = 1m
  unit: 'm' | 'ft';
}

export interface ProjectState {
  version: string;
  projectName: string;
  devices: DeviceNode[];
  cables: CableConnection[];
  background: FloorPlanBackground;
  scale: ScaleConfig;
}
