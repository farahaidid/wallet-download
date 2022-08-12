import axios from 'axios'
import { store } from '../store'

const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT

const axiosInstance = axios.create({
  headers:{
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = store.getState().USER.token
    if(token) config.headers["Authorization"] = 'Bearer ' + token
    return config
  },
  (error: any) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default {
  reqApi: (url: string) => ({
    post: (data: any) => axiosInstance.post(baseUrl + url, data),
    postWithCustomHeader: (data: any, options: any) => axiosInstance.post(baseUrl + url, data, options),
    get: () => axiosInstance.get(baseUrl + url),
    getBuffer: () => axiosInstance.get(baseUrl + url, {responseType: 'blob'}),
    put: (data: any) => axiosInstance.put(baseUrl + url, data),
    patch: (data: any) => axiosInstance.patch(baseUrl + url, data),
    delete: (data: any) => axiosInstance.delete(baseUrl + url, data),
  }),
}