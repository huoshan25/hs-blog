// 注意：Vue SFC组件需要通过Vue特定构建系统处理
// 这里提供一个简单的接口，实际项目中需要根据使用环境配置适当的处理方式

// 由于Vue组件是.vue文件，在纯TypeScript编译中会有问题
// 此处仅导出类型定义和一些辅助函数，实际组件使用时需要正确配置

import { iconPaths, IconProps, spinnerConfig, iconPathToSvg } from '../common/icons';

// 导出图标相关内容以便在Vue项目中使用
export const Icon = {
  name: 'Icon',
  props: ['name', 'size', 'color', 'className', 'style', 'spin'],
  // 实际使用时，应该通过Vue SFC或JSX渲染
  // 这里提供一个辅助函数用于生成SVG字符串
  render: (props: IconProps & { name: string; spin?: boolean }) => {
    const { name, size, color, className, spin } = props;
    if (spin || name === 'spinner') {
      return iconPathToSvg(spinnerConfig.path, { 
        size, 
        color, 
        className: `${className || ''} animate-spin`.trim() 
      });
    }
    const path = (iconPaths as Record<string, string>)[name] || '';
    if (!path) return '';
    return iconPathToSvg(path, { size, color, className });
  }
};

// 按钮组件类型
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  block?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

// 警告提示组件类型
export type AlertType = 'info' | 'success' | 'warning' | 'error';

export type AlertProps = {
  type?: AlertType;
  title?: string;
  message: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  style?: Record<string, any>;
};

// 为了在构建时通过，提供空组件实现
export const Button = {
  name: 'Button',
  props: ['variant', 'size', 'icon', 'iconPosition', 'loading', 'block', 'disabled', 'className'],
  // 实际需要通过Vue SFC或JSX渲染
};

export const Alert = {
  name: 'Alert',
  props: ['type', 'title', 'message', 'showIcon', 'closable', 'className', 'style'],
  // 实际需要通过Vue SFC或JSX渲染
}; 