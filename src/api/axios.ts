import axios, { AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create()

interface OptionsPropsType {
  token?: string
  contentType?: string
  xApiKey?: string
}

const createOptions = (props: OptionsPropsType): AxiosRequestConfig => {
  const headers: Record<string, string> = {}

  if (props.token) {
    headers.Authorization = `Bearer ${props.token}`
  }

  if (props.contentType) {
    headers['Content-Type'] = props.contentType
  }

  if (props.xApiKey) {
    headers['X-API-KEY'] = props.xApiKey
  }

  return { headers }
}

interface RequestType {
  method: string
  url: string
  options?: OptionsPropsType
  data?: any
  responseType?: any
}

const Axios = async ({ method, url, options = {}, data, responseType }: RequestType): Promise<any> => {
  const config: AxiosRequestConfig = {
    ...createOptions(options),
    method,
    url,
    responseType,
    data
  }

  return await axiosInstance(config)
}

export { Axios, createOptions }
