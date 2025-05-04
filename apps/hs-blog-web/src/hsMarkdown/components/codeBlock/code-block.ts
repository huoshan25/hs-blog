export const codeBlockStyles = `
  .hljs {
    margin: 0px
  }
  
  .code-card {
    margin: 16px 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .language-tag {
    font-size: 14px;
    color: #666;
  }
  
  .toggle-btn {
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #666;
    transition: color 0.3s;
  }
  
  .toggle-btn:hover {
    color: #2080f0;
  }
  
  .arrow-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
    display: inline-block;
  }
  
  .code-actions {
    display: flex;
    gap: 8px;
  }
  
  .copy-btn {
    padding: 4px 8px;
    font-size: 12px;
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .copy-btn:hover {
    color: #2080f0;
  }
  
  .analyze-btn {
    background: radial-gradient(495.98% 195.09% at 144.79% 10.71%, #ff8a01 0, #b051b9 22.37%, #672bff 45.54%, #06f 99.99%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  
   .copy-analyze-btn:hover {
    color: #2080f0;
  }
  
  .screenshot-btn {
    padding: 4px 8px;
    font-size: 12px;
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
}

  .screenshot-btn:hover {
    color: #2080f0;
  }
`