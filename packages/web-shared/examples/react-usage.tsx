import React from 'react';
import { 
  // 常量
  StatusEnum,
  ArticleTypeEnum,
  
  // 工具函数
  formatDate,
  truncateText,
  
  // React特定的钩子和组件
  ReactHooks,
  ReactComponents
} from 'web-shared';

/**
 * React示例组件，展示如何使用web-shared包
 */
const WebSharedReactExample: React.FC = () => {
  // 使用React钩子
  const [storedValue, setStoredValue] = ReactHooks.useLocalStorage('example-key', 'Hello Web Shared!');
  const isMobile = ReactHooks.useMediaQuery('(max-width: 768px)');
  
  // 异步请求示例
  const fetchData = async () => {
    return { message: 'Data fetched successfully', success: true };
  };
  
  const [fetchDataFn, loading, data, error] = ReactHooks.useAsync(fetchData);
  
  return (
    <div className="example-container">
      <h1>Web Shared React Example</h1>
      
      <section>
        <h2>Constants</h2>
        <div>Active Status: {StatusEnum.ACTIVE}</div>
        <div>Blog Type: {ArticleTypeEnum.BLOG}</div>
      </section>
      
      <section>
        <h2>Utility Functions</h2>
        <div>Formatted Date: {formatDate(new Date(), 'YYYY-MM-DD HH:mm')}</div>
        <div>Truncated Text: {truncateText('This is a very long text that should be truncated', 20)}</div>
      </section>
      
      <section>
        <h2>Hooks</h2>
        <div>
          <div>Local Storage Value: {storedValue}</div>
          <ReactComponents.Button 
            onClick={() => setStoredValue('Updated Value ' + new Date().toISOString())}
          >
            Update Storage Value
          </ReactComponents.Button>
        </div>
        <div>Is Mobile: {isMobile ? 'Yes' : 'No'}</div>
        <div>
          <ReactComponents.Button 
            onClick={() => fetchDataFn()}
            loading={loading}
          >
            Fetch Data
          </ReactComponents.Button>
          {data && <div>Result: {data.message}</div>}
          {error && <ReactComponents.Alert type="error" message={error.message} />}
        </div>
      </section>
      
      <section>
        <h2>Components</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <ReactComponents.Icon name="home" size={24} />
          <ReactComponents.Icon name="search" size={24} />
          <ReactComponents.Icon name="user" size={24} />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <ReactComponents.Button>Default</ReactComponents.Button>
          <ReactComponents.Button variant="success">Success</ReactComponents.Button>
          <ReactComponents.Button variant="warning">Warning</ReactComponents.Button>
          <ReactComponents.Button variant="danger">Danger</ReactComponents.Button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ReactComponents.Alert
            type="info"
            title="Information"
            message="This is an information message."
            showIcon
          />
          <ReactComponents.Alert
            type="success"
            message="Operation completed successfully!"
            showIcon
          />
          <ReactComponents.Alert
            type="warning"
            message="Warning: This action cannot be undone."
            showIcon
          />
          <ReactComponents.Alert
            type="error"
            message="Error: Something went wrong."
            showIcon
            closable
            onClose={() => console.log('Alert closed')}
          />
        </div>
      </section>
    </div>
  );
};

export default WebSharedReactExample; 