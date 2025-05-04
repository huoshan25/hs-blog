export const copyCode = `
  function copyCode(button) {
    const pre = button.closest('.code-card').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => {
          button.textContent = '复制成功';
          if (window.showCopySuccess) {
            window.showCopySuccess('已经复制到剪贴板');
          }
          setTimeout(() => {
            button.textContent = '复制代码';
          }, 2000);
        })
        .catch(() => {
          console.log('备选');
          fallbackCopy(code, button);
        });
    } else {
      fallbackCopy(code, button);
    }
  }

  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      button.textContent = '复制成功';
      if (window.showCopySuccess) {
        window.showCopySuccess('已经复制到剪贴板');
      }
      setTimeout(() => {
        button.textContent = '复制代码';
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }

    document.body.removeChild(textArea);
  }
`

export const toggleCode = `
  function toggleCode(button) {
    const card = button.closest('.code-card');
    const pre = card.querySelector('pre');
    const arrow = button.querySelector('.arrow-icon');
    const isCollapsed = pre.style.display === 'none';
    
    pre.style.display = isCollapsed ? 'block' : 'none';
    arrow.style.transform = isCollapsed ? '' : 'rotate(180deg)';
    
    // 同时更新 aria-expanded 状态，提高可访问性
    button.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
  }
`

export const analyzeCode = `
  function analyzeCode(button) {
    const pre = button.closest('.code-card').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    const language = button.closest('.code-card').querySelector('.language-tag').textContent;
    
    // 触发全局事件
    const event = new CustomEvent('analyze-code', {
      detail: {
        code,
        language
      }
    });
    window.dispatchEvent(event);
  }
`

/**
 * 代码块截图
 */
export const screenshotCode = `
async function screenshotCode(button) {
  if (!window.html2canvas) {
    console.error('html2canvas not loaded');
    return;
  }
  
  const codeCard = button.closest('.code-card');
  
  button.disabled = true;
  const originalText = button.innerHTML;
  button.innerHTML = '正在生成...';
  
  try {
    const clonedCard = codeCard.cloneNode(true);
    clonedCard.style.position = 'absolute';
    clonedCard.style.left = '-9999px';
    clonedCard.style.padding = '16px';
    clonedCard.style.margin = '0';
    
    // 获取原始代码块的宽度
    const originalCode = codeCard.querySelector('pre, code');
    const computedStyle = window.getComputedStyle(originalCode);
    const codeWidth = originalCode.scrollWidth;
    
    // 设置克隆节点的宽度为代码内容的实际宽度
    clonedCard.style.width = 'auto';
    clonedCard.style.display = 'inline-block';
    
    const clonedHeader = clonedCard.querySelector('.code-header');
    if (clonedHeader) {
      clonedHeader.remove();
    }
    
    // 设置代码块样式
    const clonedCode = clonedCard.querySelector('pre, code');
    if (clonedCode) {
      clonedCode.style.whiteSpace = 'pre';  // 保持原始格式
      clonedCode.style.width = 'auto';
      clonedCode.style.display = 'inline-block';
      // 继承原始代码块的字体大小和行高
      clonedCode.style.fontSize = computedStyle.fontSize;
      clonedCode.style.lineHeight = computedStyle.lineHeight;
    }
    
    document.body.appendChild(clonedCard);
    
    const canvas = await window.html2canvas(clonedCard, {
      backgroundColor: '#1e1e1e',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      // 设置画布宽度
      width: clonedCard.offsetWidth,
      height: clonedCard.offsetHeight
    });
    
    document.body.removeChild(clonedCard);
    
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      if (window.showCopySuccess) {
        window.showCopySuccess('已复制截图到剪贴板');
      }
    } catch (clipboardErr) {
      // 降级方案...
    }
  } catch (err) {
    console.error('截图失败:', err);
    if (window.showCopySuccess) {
      window.showCopySuccess('截图失败，请重试');
    }
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}
`