import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'

export interface ResOptions<T> {
  data: T
  code: number
  message: string
}

const { message } = createDiscreteApi(['message'])
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 10000,
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useUser()
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    if (response.data.code !== 200) {
      message.error(response.data.message)
    }
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      message.error('请求超时。请稍后再试!')
    } else {
      message.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  },
)

export const request = {
  get: async <T>(url: string, params?: any) => {
    const response = await axiosInstance.get<ResOptions<T>>(url, { params })
    return response.data
  },

  post: async <T>(url: string, body?: any, params?: any) => {
    const response = await axiosInstance.post<ResOptions<T>>(url, body, { params })
    return response.data
  },

  put: async <T>(url: string, body?: any, params?: any) => {
    const response = await axiosInstance.put<ResOptions<T>>(url, body, { params })
    return response.data
  },

  delete: async <T>(url: string, params?: any) => {
    const response = await axiosInstance.delete<ResOptions<T>>(url, { params })
    return response.data
  },
}
