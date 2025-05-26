import type { SearchParameters } from 'ofetch'
import { useStorage } from '@vueuse/core'
import { createDiscreteApi } from 'naive-ui'
import { ErrorStatus } from '~/enums/ErrorStatus'
import type { HttpRes } from '~/api/type'

export interface RefreshTokenResponse {
  token: string
  refresh_token: string
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

    const isRefreshTokenRequest = request === '/admin/user/refresh-token'

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

    if (data.code === ErrorStatus.EXPIRE_TOKEN) {
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
      const refreshResult = await this.fetch<HttpRes<RefreshTokenResponse>>('/admin/user/refresh-token', {
        method: 'POST'
      })
      this.token.value = refreshResult.data.token
      this.refreshToken.value = refreshResult.data.refresh_token
    } catch (error) {
      this.token.value = ''
      this.refreshToken.value = ''
      navigateTo('/blog')
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  private onResponseError({ response }: { response: any }) {
    const data = response._data

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
