import type { ButtonHTMLAttributes } from 'react';
import { iconPaths, IconProps } from '../common/icons';

// Icon组件类型
export interface ReactIconProps extends IconProps {
  name: keyof typeof iconPaths | string;
  spin?: boolean;
}

// Button组件类型
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  block?: boolean;
}

// Alert组件类型
export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// 为构建提供空实现
// 实际使用时应从实现文件导入
export const Icon = (props: ReactIconProps) => null;
export const Button = (props: ButtonProps) => null;
export const Alert = (props: AlertProps) => null; 