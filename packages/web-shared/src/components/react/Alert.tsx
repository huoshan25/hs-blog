import React from 'react';
import { Icon } from './Icon';

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

/**
 * React警告提示组件
 */
export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  showIcon = true,
  closable = false,
  onClose,
  className = '',
  style,
}) => {
  // 基础类名
  const baseClass = 'hs-alert';
  
  // 类型类名
  const typeClass = `${baseClass}--${type}`;
  
  // 计算最终类名
  const alertClass = `${baseClass} ${typeClass} ${className}`.trim();
  
  // 图标映射
  const iconMap: Record<AlertType, string> = {
    info: 'info',
    success: 'check',
    warning: 'warning',
    error: 'close',
  };
  
  // 选择对应的图标
  const iconName = iconMap[type];
  
  return (
    <div className={alertClass} style={style} role="alert">
      {showIcon && (
        <div className={`${baseClass}__icon`}>
          <Icon name={iconName} size={16} />
        </div>
      )}
      <div className={`${baseClass}__content`}>
        {title && <div className={`${baseClass}__title`}>{title}</div>}
        <div className={`${baseClass}__message`}>{message}</div>
      </div>
      {closable && (
        <button 
          className={`${baseClass}__close`}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}; 