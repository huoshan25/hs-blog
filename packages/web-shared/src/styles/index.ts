import { colors } from '../components/common/styles';

// 导出按钮样式
export const buttonStyles = `
.hs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  outline: none;
}

/* 尺寸变体 */
.hs-button--sm {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}
.hs-button--md {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
}
.hs-button--lg {
  height: 44px;
  padding: 0 20px;
  font-size: 16px;
}

/* 颜色变体 */
.hs-button--primary {
  background-color: ${colors.primary[500]};
  color: white;
}
.hs-button--primary:hover:not(:disabled) {
  background-color: ${colors.primary[400]};
}
.hs-button--primary:active:not(:disabled) {
  background-color: ${colors.primary[600]};
}

.hs-button--secondary {
  background-color: white;
  color: ${colors.neutral[800]};
  border-color: ${colors.neutral[300]};
}
.hs-button--secondary:hover:not(:disabled) {
  background-color: ${colors.neutral[50]};
  border-color: ${colors.neutral[400]};
}
.hs-button--secondary:active:not(:disabled) {
  background-color: ${colors.neutral[100]};
}

.hs-button--success {
  background-color: ${colors.success[500]};
  color: white;
}
.hs-button--success:hover:not(:disabled) {
  background-color: ${colors.success[400]};
}
.hs-button--success:active:not(:disabled) {
  background-color: ${colors.success[600]};
}

.hs-button--warning {
  background-color: ${colors.warning[500]};
  color: white;
}
.hs-button--warning:hover:not(:disabled) {
  background-color: ${colors.warning[400]};
}
.hs-button--warning:active:not(:disabled) {
  background-color: ${colors.warning[600]};
}

.hs-button--danger {
  background-color: ${colors.error[500]};
  color: white;
}
.hs-button--danger:hover:not(:disabled) {
  background-color: ${colors.error[400]};
}
.hs-button--danger:active:not(:disabled) {
  background-color: ${colors.error[600]};
}

.hs-button--link {
  background-color: transparent;
  color: ${colors.primary[500]};
  padding: 0;
  height: auto;
  border: none;
}
.hs-button--link:hover:not(:disabled) {
  color: ${colors.primary[400]};
  text-decoration: underline;
}
.hs-button--link:active:not(:disabled) {
  color: ${colors.primary[600]};
}

/* 禁用状态 */
.hs-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 块级按钮 */
.hs-button--block {
  display: flex;
  width: 100%;
}

/* 图标 */
.hs-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hs-button__icon--left {
  margin-right: 6px;
}
.hs-button__icon--right {
  margin-left: 6px;
}

/* 加载状态 */
.hs-button--loading {
  position: relative;
  pointer-events: none;
}
`;

// 导出提示框样式
export const alertStyles = `
.hs-alert {
  position: relative;
  display: flex;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

/* 类型变体 */
.hs-alert--info {
  background-color: ${colors.primary[50]};
  border: 1px solid ${colors.primary[200]};
}
.hs-alert--success {
  background-color: ${colors.success[50]};
  border: 1px solid ${colors.success[200]};
}
.hs-alert--warning {
  background-color: ${colors.warning[50]};
  border: 1px solid ${colors.warning[200]};
}
.hs-alert--error {
  background-color: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
}

/* 图标 */
.hs-alert__icon {
  margin-right: 12px;
  display: flex;
  align-items: flex-start;
}
.hs-alert--info .hs-alert__icon {
  color: ${colors.primary[500]};
}
.hs-alert--success .hs-alert__icon {
  color: ${colors.success[500]};
}
.hs-alert--warning .hs-alert__icon {
  color: ${colors.warning[500]};
}
.hs-alert--error .hs-alert__icon {
  color: ${colors.error[500]};
}

/* 内容 */
.hs-alert__content {
  flex: 1;
}
.hs-alert__title {
  font-weight: 600;
  margin-bottom: 4px;
}
.hs-alert--info .hs-alert__title {
  color: ${colors.primary[700]};
}
.hs-alert--success .hs-alert__title {
  color: ${colors.success[700]};
}
.hs-alert--warning .hs-alert__title {
  color: ${colors.warning[700]};
}
.hs-alert--error .hs-alert__title {
  color: ${colors.error[700]};
}

.hs-alert__message {
  color: ${colors.neutral[700]};
}

/* 关闭按钮 */
.hs-alert__close {
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${colors.neutral[500]};
  padding: 0;
}
.hs-alert__close:hover {
  color: ${colors.neutral[800]};
}
`;

// 导出通用动画样式
export const animationStyles = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
`;

// 组合所有样式
export const globalStyles = `
${buttonStyles}
${alertStyles}
${animationStyles}
`;

// 提供一个将样式注入到文档的辅助函数
export function injectStyles(styleString: string, id: string = 'web-shared-styles'): void {
  if (typeof document === 'undefined') return;
  
  // 检查是否已经存在
  let styleElement = document.getElementById(id) as HTMLStyleElement;
  
  if (!styleElement) {
    // 创建新的样式元素
    styleElement = document.createElement('style');
    styleElement.id = id;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = styleString;
} 