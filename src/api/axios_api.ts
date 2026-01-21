import axios from 'axios'

const url = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: url,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"]
    }
    else {
        config.headers["Content-Type"] = "application/json"
    }
    return config
})