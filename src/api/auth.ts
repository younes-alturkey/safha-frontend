import { Axios } from 'src/api/axios'

export const signin = async (apiUrl: string, data: { email: string; password: string }) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/auth/login`,
    data
  }

  return await Axios(request)
}

export type RefreshData = { token: string; refreshToken: string }
export const refresh = async (apiUrl: string, data: RefreshData) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/auth/refresh`,
    data
  }

  return await Axios(request)
}

export const forgot = async (apiUrl: string, email: string) => {
  const request = {
    method: 'GET',
    url: `${apiUrl}/api/auth/${email}/forgot`
  }

  return await Axios(request)
}

export type RestPasswordType = { email: string; password: string; token: string }
export const reset = async (apiUrl: string, data: RestPasswordType) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/auth/reset-password`,
    data
  }

  return await Axios(request)
}

export type RegisterType = {
  roles: string[]
  firstname: string
  lastname: string
  email: string
  password: string
  gender?: string
  phoneNumber?: string
  dob?: string
}

export const register = async (apiUrl: string, data: RegisterType) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/auth/register`,
    data
  }

  return await Axios(request)
}
