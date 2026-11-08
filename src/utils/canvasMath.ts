export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculates Euclidean distance between two points in pixels
 */
export const getDistance = (p1: Point2D, p2: Point2D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Converts pixel distance to real-world meters or feet
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number = 20): number => {
  return Math.round((pixels / pixelsPerMeter) * 10) / 10;
};

/**
 * Snaps coordinate to grid
 */
export const snapToGrid = (val: number, gridSize: number = 20): number => {
  return Math.round(val / gridSize) * gridSize;
};

/**
 * Generates an SVG path string for a cable between two devices
 * with subtle natural curve or orthogonal styling
 */
export const getCablePath = (
  from: Point2D,
  to: Point2D,
  curvature: number = 0
): { path: string; midPoint: Point2D } => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (curvature === 0 || dist < 30) {
    // Subtle natural slight curve based on orientation
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    return {
      path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      midPoint: { x: midX, y: midY },
    };
  }

  // Curved quadratic or cubic Bezier
  // Normal vector
  const nx = -dy / dist;
  const ny = dx / dist;

  const bend = curvature * 40;
  const ctrlX = (from.x + to.x) / 2 + nx * bend;
  const ctrlY = (from.y + to.y) / 2 + ny * bend;

  // Midpoint on quadratic bezier at t = 0.5
  // B(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2
  const midX = 0.25 * from.x + 0.5 * ctrlX + 0.25 * to.x;
  const midY = 0.25 * from.y + 0.5 * ctrlY + 0.25 * to.y;

  return {
    path: `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`,
    midPoint: { x: midX, y: midY },
  };
};

/**
 * Generates CCTV FOV arc path
 */
export const getFovConePath = (
  x: number,
  y: number,
  angleDeg: number,
  fovDeg: number,
  distancePx: number
): string => {
  const halfFov = (fovDeg / 2) * (Math.PI / 180);
  const centerRad = (angleDeg * Math.PI) / 180;

  const startRad = centerRad - halfFov;
  const endRad = centerRad + halfFov;

  const x1 = x + Math.cos(startRad) * distancePx;
  const y1 = y + Math.sin(startRad) * distancePx;
  const x2 = x + Math.cos(endRad) * distancePx;
  const y2 = y + Math.sin(endRad) * distancePx;

  const largeArc = fovDeg > 180 ? 1 : 0;

  return `M ${x} ${y} L ${x1} ${y1} A ${distancePx} ${distancePx} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};
