import hljs from "highlight.js";
import type { MarkdownComponent } from "~/hsMarkdown/types";
import { codeBlockStyles } from "~/hsMarkdown/components/codeBlock/code-block";
import { copyCode, toggleCode, analyzeCode, screenshotCode } from "~/hsMarkdown/components/codeBlock/codeActions";
import { createDiscreteApi } from "naive-ui";
import html2canvas from 'html2canvas';

if (import.meta.client) {
  window.html2canvas = html2canvas;
}

declare global {
  interface Window {
    showCopySuccess: (text: string) => void;
    html2canvas: typeof html2canvas;
  }
}

export const languageAliases: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  py: "python",
  rb: "ruby",
  yml: "yaml",
  sh: "bash",
  rs: "rust"
};

const { message } = createDiscreteApi(["message"]);

if (import.meta.client) {
  window.showCopySuccess = (text: string): void => {
    message.success(text);
  };
}

export const codeBlock: MarkdownComponent = {
  name: "code-block",
  render: (str: string, lang: string): string => {
    // 处理语言字符串，移除前后空格
    const cleanLang: string = (lang || "").trim();
    const actualLang: string = languageAliases[cleanLang] || cleanLang;
    let languageDisplay: string = actualLang ? actualLang.charAt(0).toUpperCase() + actualLang.slice(1) : "Text";

    if (actualLang && hljs.getLanguage(actualLang)) {
      try {
        const highlighted: string = hljs.highlight(str, {
          language: actualLang,
          ignoreIllegals: true
        }).value;

        return `
          <div class="code-card n-card">
            <div class="code-header">
              <div class="header-left">
                <button onclick="toggleCode(this)" class="toggle-btn" aria-label="Toggle code">
                  <span class="arrow-icon">▼</span>
                </button>
                <span class="language-tag">${languageDisplay}</span>
              </div>
              <div class="code-actions">
                <button onclick="screenshotCode(this)" class="screenshot-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                <span>截图</span>
                <button id="ai-code-box" style="border: none;" onclick="analyzeCode(this)"><svg data-v-159ebe90="" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="icon"><path data-v-159ebe90="" fill-rule="evenodd" clip-rule="evenodd" d="M9.53955 4.17189C9.68118 4.20855 9.79179 4.31915 9.82844 4.46078L10.1056 5.53143C10.2094 5.93276 10.7788 5.93412 10.8846 5.53329L11.1678 4.46028C11.2049 4.31949 11.3152 4.20973 11.4562 4.17324L12.5321 3.89478C12.9334 3.7909 12.9348 3.22149 12.5339 3.11571L11.4557 2.83116C11.3156 2.79418 11.2061 2.68474 11.1692 2.54461L10.8846 1.46639C10.7788 1.06556 10.2094 1.06691 10.1056 1.46824L9.82709 2.54413C9.7906 2.6851 9.68084 2.79538 9.54005 2.83254L8.46704 3.11571C8.06621 3.22149 8.06756 3.7909 8.46889 3.89478L9.53955 4.17189ZM6.85443 2.33317C6.93497 2.33317 7.00026 2.39846 7.00026 2.479V3.354C7.00026 3.43455 6.93497 3.49984 6.85443 3.49984H2.10026V12.2498H10.5586C10.7197 12.2498 10.8503 12.1193 10.8503 11.9582V7.14567C10.8503 7.06513 10.9156 6.99984 10.9961 6.99984H11.8711C11.9516 6.99984 12.0169 7.06513 12.0169 7.14567V12.8332C12.0169 13.1553 11.7558 13.4165 11.4336 13.4165H1.51693C1.19476 13.4165 0.933594 13.1553 0.933594 12.8332V2.9165C0.933594 2.59434 1.19476 2.33317 1.51693 2.33317H6.85443ZM8.30344 6.27272L9.43036 6.57467L8.22254 11.0823L7.09562 10.7804L8.30344 6.27272ZM6.56676 6.89146L5.7418 6.0665L3.26693 8.54137L3.35968 8.63404L3.35235 8.64146L5.62099 10.9101L6.44595 10.0851L4.9093 8.54858L6.56676 6.89146Z" fill="url(#paint0_radial_370_13481)"></path><defs data-v-159ebe90=""><radialGradient data-v-159ebe90="" id="paint0_radial_370_13481" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.8336 1.1665) rotate(134.17) scale(17.0784 23.5605)"><stop data-v-159ebe90="" stop-color="#FF8A01"></stop><stop data-v-159ebe90="" offset="0.223725" stop-color="#B051B9"></stop><stop data-v-159ebe90="" offset="0.455423" stop-color="#672BFF"></stop><stop data-v-159ebe90="" offset="0.9999" stop-color="#0066FF"></stop></radialGradient></defs></svg><span class="analyze-btn">代码解读</span>  </button>
                <button onclick="copyCode(this)" class="copy-btn">复制代码</button>
              </div>
            </div>
            <pre class="hljs p-[15px] my-[0px] mx-[0px]"><code>${highlighted}</code></pre>
          </div>
          <style>
            ${codeBlockStyles}
          </style>
          <script>
            ${copyCode}
            ${toggleCode}
            ${analyzeCode}
            ${screenshotCode}
          </script>
        `;
      } catch (err) {
        console.error('Error highlighting code:', err);
      }
    }
    return `<pre class="hljs p-[15px]"><code>${str}</code></pre>`;
  }
};
