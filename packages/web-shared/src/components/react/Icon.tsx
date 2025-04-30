import React from 'react';
import { IconProps, iconPaths, spinnerConfig } from '../common/icons';

interface ReactIconProps extends IconProps {
  name: keyof typeof iconPaths | string;
  spin?: boolean;
}

/**
 * React图标组件
 * 基于SVG路径渲染图标
 */
export const Icon: React.FC<ReactIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  spin = false,
}) => {
  // 处理加载状态
  if (name === 'spinner' || spin) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        className={`animate-spin ${className}`}
        style={style}
      >
        <path d={spinnerConfig.path} />
      </svg>
    );
  }

  // 确定图标路径
  const path = (iconPaths as Record<string, string>)[name] || '';
  
  if (!path) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={path} />
    </svg>
  );
}; 