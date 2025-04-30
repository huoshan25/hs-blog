import { colors, fontSizes, shadows, borderRadius } from '../styles';

/**
 * 浅色主题（默认）
 */
export const lightTheme = {
  id: 'light',
  name: '浅色模式',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[500],
      disabled: colors.neutral[400],
      inverse: '#ffffff',
    },
    border: {
      light: colors.neutral[200],
      normal: colors.neutral[300],
      dark: colors.neutral[400],
    },
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    neutral: colors.neutral,
  },
  fontSizes,
  shadows,
  borderRadius,
};

/**
 * 深色主题
 */
export const darkTheme = {
  id: 'dark',
  name: '深色模式',
  colors: {
    background: {
      primary: colors.neutral[900],
      secondary: colors.neutral[800],
      tertiary: colors.neutral[700],
    },
    text: {
      primary: '#ffffff',
      secondary: colors.neutral[300],
      tertiary: colors.neutral[400],
      disabled: colors.neutral[500],
      inverse: colors.neutral[900],
    },
    border: {
      light: colors.neutral[700],
      normal: colors.neutral[600],
      dark: colors.neutral[500],
    },
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    neutral: colors.neutral,
  },
  fontSizes,
  shadows,
  borderRadius,
};

/**
 * 主题类型
 */
export type Theme = typeof lightTheme;

/**
 * 主题常量
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
}; 