import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import env from '~/configs/env'
import Storage from '~/utils/Storage'

// const UNKNOWN_ERROR = 'Unknown error, please try again'
const SECOND = 1000 // 1s

const axiosClient = axios.create({
  baseURL: env.VITE_BASE_URL_API,
  timeout: 3 * 60 * SECOND, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // const token = Storage?.get(ACCESS_TOKEN_KEY)
    // if (token) config.headers['Authorization'] = `Bearer ${token}`

    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.code && +response.data.code !== 200) {
      if (response.data.code === 401) {
        Storage?.clear()
        return Promise.reject(response.data.message)
      }

      return Promise.reject(response.data.message)
    }
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.status === 401) {
      Storage?.clear()
      return
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axiosClient
