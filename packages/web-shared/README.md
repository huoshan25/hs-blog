# web-shared 前端共享库

这个包提供了可以在React和Vue项目中共用的常量、类型、工具函数、钩子和组件。

## 特点

- 提供框架无关的常量和类型定义
- 提供通用的工具函数
- 为React和Vue提供各自版本的钩子函数和组件
- 支持主题定制和样式共享

## 安装

在monorepo中，已经通过workspace引用配置好了依赖关系。如果需要在外部使用：

```bash
# 使用npm
npm install web-shared

# 使用yarn
yarn add web-shared

# 使用pnpm
pnpm add web-shared
```

## 使用方法

### 引入常量和类型

```typescript
// 引入常量
import { StatusEnum, ArticleTypeEnum, REGEX } from 'web-shared';

// 使用示例
const status = StatusEnum.ACTIVE;
const emailRegex = REGEX.EMAIL;

// 引入类型
import { Article, PaginationParams } from 'web-shared';

// 使用示例
const article: Article = {
  id: '1',
  title: '标题',
  content: '内容',
  type: ArticleTypeEnum.BLOG,
  status: StatusEnum.PUBLISHED,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01'
};
```

### 使用工具函数

```typescript
import { formatDate, truncateText, deepClone } from 'web-shared';

// 使用示例
const date = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
const text = truncateText('这是一段很长的文本...', 10);
const clonedObject = deepClone(originalObject);
```

### 在React中使用

```tsx
import React, { useEffect } from 'react';
import { ReactHooks, ReactComponents, injectStyles, globalStyles } from 'web-shared';

// 注入样式
useEffect(() => {
  injectStyles(globalStyles);
}, []);

// 使用React钩子
const MyComponent = () => {
  const [value, setValue] = ReactHooks.useLocalStorage('key', 'default');
  const isMobile = ReactHooks.useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      <ReactComponents.Icon name="home" size={24} color="#1890ff" />
      <p>Local Storage Value: {value}</p>
      <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
      <ReactComponents.Button 
        onClick={() => setValue('new value')}
        variant="primary"
      >
        Update Value
      </ReactComponents.Button>
    </div>
  );
};
```

### 在Vue中使用

```vue
<template>
  <div>
    <component :is="VueComponents.Icon" name="home" :size="24" color="#1890ff" />
    <p>Local Storage Value: {{ storedValue }}</p>
    <p>Is Mobile: {{ isMobile ? 'Yes' : 'No' }}</p>
    <component 
      :is="VueComponents.Button"
      variant="primary"
      @click="setValue('new value')"
    >
      Update Value
    </component>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { VueHooks, VueComponents, injectStyles, globalStyles } from 'web-shared';

// 注入样式
onMounted(() => {
  injectStyles(globalStyles);
});

// 使用Vue组合式API
const [storedValue, setValue] = VueHooks.useLocalStorage('key', 'default');
const isMobile = VueHooks.useMediaQuery('(max-width: 768px)');
</script>
```

### 使用主题

```typescript
// 在React或Vue中都可以使用
import { lightTheme, darkTheme } from 'web-shared';

// 获取颜色值
const primaryColor = lightTheme.colors.primary[500];
const textColor = darkTheme.colors.text.primary;
```

## 框架集成指南

### React项目集成

1. 创建一个高阶组件来注入样式和主题：

```tsx
// src/providers/WebSharedProvider.tsx
import React, { useEffect } from 'react';
import { injectStyles, globalStyles } from 'web-shared';

export const WebSharedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 注入样式
    injectStyles(globalStyles);
  }, []);

  return <>{children}</>;
};
```

2. 在应用入口处使用该Provider：

```tsx
// src/App.tsx
import { WebSharedProvider } from './providers/WebSharedProvider';

function App() {
  return (
    <WebSharedProvider>
      {/* 应用内容 */}
    </WebSharedProvider>
  );
}
```

### Vue项目集成

1. 创建一个全局插件来注入样式和组件：

```typescript
// src/plugins/webShared.ts
import { App } from 'vue';
import { injectStyles, globalStyles, VueComponents } from 'web-shared';

export default {
  install(app: App) {
    // 注入样式
    injectStyles(globalStyles);
    
    // 全局注册组件
    app.component('HsIcon', VueComponents.Icon);
    app.component('HsButton', VueComponents.Button);
    app.component('HsAlert', VueComponents.Alert);
  }
}
```

2. 在应用入口处使用插件：

```typescript
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import webSharedPlugin from './plugins/webShared';

const app = createApp(App);
app.use(webSharedPlugin);
app.mount('#app');
```

## 自定义主题

要自定义主题，你可以创建自己的主题对象并使用它：

```typescript
import { lightTheme } from 'web-shared';

// 创建自定义主题，扩展自默认浅色主题
const customTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: {
      ...lightTheme.colors.primary,
      500: '#f59e0b', // 自定义主色调
    }
  }
};

// 使用自定义主题创建的样式
const customStyles = `
.custom-button {
  background-color: ${customTheme.colors.primary[500]};
  color: white;
  padding: 10px 20px;
  border-radius: ${customTheme.borderRadius.md};
}
`;

// 注入自定义样式
injectStyles(customStyles, 'custom-theme-styles');
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发模式
pnpm dev:web-shared

# 构建
pnpm build:web-shared
```

## 更多信息

查看`examples`目录中的示例代码，了解如何在React和Vue项目中使用此共享库。