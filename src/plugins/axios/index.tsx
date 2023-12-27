import { getStorage } from '@/@common'
import { TOKEN_KEY } from '@/@common/constants'
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 6000,
  headers: {
    'Accept': 'Application/json'
  }
})

instance.interceptors.request.use(
  (config: any) => {

    const token = getStorage(TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: any) => {
    // return {
    //   status: true,
    //   data: response.data.result,
    //   message: response.data.message
    // }
    response.data.status = true
    return response
  },
  (error: any) => {
    console.log(error);
    if (error?.response?.status === 401) {
      window.location.href = '/login'
    }
    return {
      status: false,
      data: error.response.data.result,
      message: error.response.data.message
    }

    return Promise.reject(error)
  },
)

export default instance
