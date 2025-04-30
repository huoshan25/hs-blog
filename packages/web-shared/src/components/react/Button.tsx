import React, { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

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

/**
 * React按钮组件
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  block = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  // 基础类名
  const baseClass = 'hs-button';
  
  // 变体类名
  const variantClass = `${baseClass}--${variant}`;
  
  // 尺寸类名
  const sizeClass = `${baseClass}--${size}`;
  
  // 块级类名
  const blockClass = block ? `${baseClass}--block` : '';
  
  // 加载类名
  const loadingClass = loading ? `${baseClass}--loading` : '';
  
  // 禁用状态
  const isDisabled = disabled || loading;
  
  // 计算最终类名
  const buttonClass = `${baseClass} ${variantClass} ${sizeClass} ${blockClass} ${loadingClass} ${className}`.trim();
  
  // 图标元素
  const iconElement = (loading || icon) ? (
    <span className={`${baseClass}__icon ${baseClass}__icon--${iconPosition}`}>
      <Icon name={loading ? 'spinner' : icon || ''} spin={loading} size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} />
    </span>
  ) : null;
  
  return (
    <button
      className={buttonClass}
      disabled={isDisabled}
      {...rest}
    >
      {iconPosition === 'left' && iconElement}
      {children && <span className={`${baseClass}__text`}>{children}</span>}
      {iconPosition === 'right' && iconElement}
    </button>
  );
}; 