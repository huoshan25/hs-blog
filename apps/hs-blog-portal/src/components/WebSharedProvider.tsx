'use client'

import React, { useEffect } from 'react';
import { injectStyles, globalStyles } from 'web-shared';

/**
 * WebSharedProvider - 注入web-shared样式和全局设置
 */
const WebSharedProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // 在客户端渲染后注入样式
  useEffect(() => {
    injectStyles(globalStyles);
  }, []);

  return <>{children}</>;
};

export default WebSharedProvider; 