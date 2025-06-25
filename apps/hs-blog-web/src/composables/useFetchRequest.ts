import type { SearchParameters } from 'ofetch'
import { useStorage } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import { ErrorStatus } from '~/enums/ErrorStatus'
import type { HttpRes } from '~/api/type'
import { getRefreshToken } from '~/api/user'

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

const { message } = createDiscreteApi(['message'])

/*参数序列化*/
const paramsSerializer = (params?: SearchParameters): SearchParameters | undefined => {
  if (!params) return undefined

  const query = { ...params }
  Object.entries(query).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      query[`${key}[]`] = val.map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

/*API请求*/
class FetchApi {
  private readonly fetch
  private token = useStorage('token', '')
  private refreshToken = useStorage('refreshToken', '')
  private refreshPromise: Promise<void> | null = null
  private isRefreshing = false

  constructor() {
    this.fetch = $fetch.create({
      onRequest: this.onRequest.bind(this),
      onResponse: this.onResponse.bind(this),
      onResponseError: this.onResponseError.bind(this)
    })
  }

  private async onRequest({ options, request }: { options: any; request: any }) {
    options.params = paramsSerializer(options.params)
    const { apiBaseUrl } = useRuntimeConfig().public
    options.baseURL = apiBaseUrl as string

    // 刷新token请求使用refreshToken
    const isRefreshTokenRequest = request === '/auth/refresh-token'

    if (isRefreshTokenRequest && this.refreshToken.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${this.refreshToken.value}`)
    } else if (this.token.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${this.token.value}`)
    }
  }

  /*返回响应结果*/
  private async onResponse({ request, response, options }: { request: any; response: any; options: any }) {
    const data = response._data

    // 处理token过期情况
    if (data.code === ErrorStatus.EXPIRE_TOKEN) {
      // 避免重复刷新token
      if (request === '/auth/refresh-token') {
        this.token.value = ''
        this.refreshToken.value = ''
        navigateTo('/blog')
        throw new Error('刷新token失败')
      }

      await this.refreshTokenIfNeeded()

      // 使用新token重试原始请求
      const newResponse: any = await this.fetch(request, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${this.token.value}` }
      })
      return newResponse._data
    }

    return data
  }

  private async refreshTokenIfNeeded() {
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefreshToken()
    }
    await this.refreshPromise
  }

  private async doRefreshToken() {
    try {
      if (!this.refreshToken.value) {
        throw new Error('没有刷新令牌')
      }

      const result = await getRefreshToken({ refreshToken: this.refreshToken.value })
      
      // 更新存储的token
      this.token.value = result.data.accessToken
      this.refreshToken.value = result.data.refreshToken
    } catch (error) {
      this.token.value = ''
      this.refreshToken.value = ''
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  private onResponseError({ response }: { response: any }) {
    const data = response._data

    // 如果是401错误，尝试刷新token
    if (response.status === 401 && data?.message === 'Unauthorized') {
      // 这里不处理，让onResponse处理
      return
    }

    if (data && typeof data.code === 'number' && typeof data.message === 'string') {
      message.error(`${data.code} - ${data.message}`)
    } else {
      message.error(`${response.status} - ${response.statusText || '未知错误'}`)
    }
    throw new Error(data?.message || response.statusText || '未知错误')
  }

  async get<T>(url: string, params?: SearchParameters, options?: any) {
    return this.fetch<HttpRes<T>>(url, { method: 'get', params, ...options })
  }

  async post<T>(url: string, body?: SearchParameters) {
    return this.fetch<HttpRes<T>>(url, { method: 'post', body })
  }

  async put<T>(url: string, body?: SearchParameters) {
    return this.fetch<HttpRes<T>>(url, { method: 'put', body })
  }

  async delete<T>(url: string, body?: SearchParameters) {
    return this.fetch<HttpRes<T>>(url, { method: 'delete', body })
  }
}

/*创建并导出 API 客户端实例*/
export const fetchRequest = new FetchApi()
