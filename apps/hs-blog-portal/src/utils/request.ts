const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3005';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * 封装的 fetch 函数
 * @param {string} path - 请求的路径
 * @param {FetchOptions} options - fetch 选项
 * @returns {Promise<any>} - fetch 的 Promise
 */
export async function request(path: string, options: FetchOptions = {}): Promise<any> {
  // 构建完整的 URL
  const url = `${BASE_URL}${path}`;

  // 设置默认选项
  const defaultOptions: FetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // 下一行启用 Next.js 的自动请求去重
    cache: 'force-cache',
  };

  // 合并默认选项和传入的选项
  const mergedOptions: FetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // 如果有 token，添加到 header
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    mergedOptions.headers!['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, mergedOptions);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`);
    }

    // 解析 JSON 响应
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch 错误:', error);
    throw error;
  }
}

// GET 请求
export function get(path: string, params?: any, options: FetchOptions = {}): Promise<any> {
  if (params) {
    const searchParams = new URLSearchParams(params);
    path += '?' + searchParams.toString();
  }
  return request(path, { ...options, method: 'GET' });
}

// POST 请求
export function post(path: string, body: any, options: FetchOptions = {}): Promise<any> {
  return request(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PUT 请求
export function put(path: string, body: any, options: FetchOptions = {}): Promise<any> {
  return request(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// DELETE 请求
export function del(path: string, options: FetchOptions = {}): Promise<any> {
  return request(path, { ...options, method: 'DELETE' });
}