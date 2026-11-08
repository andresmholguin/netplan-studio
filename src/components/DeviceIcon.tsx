import React from 'react';
import * as Icons from 'lucide-react';

interface DeviceIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const DeviceIcon: React.FC<DeviceIconProps> = ({ name, size = 24, className = '', color }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name] || Icons.CircleDot;
  return <IconComponent size={size} className={className} color={color} />;
};
