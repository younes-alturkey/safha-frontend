import { Axios } from 'src/api/axios'

export const getMyWebsites = async (apiUrl: string) => {
  const request = {
    method: 'GET',
    url: `${apiUrl}/api/website/me`
  }

  return await Axios(request)
}

export type GetWebsiteType = { id: string; token: string }
export const getWebsite = async (apiUrl: string, data: GetWebsiteType) => {
  const request = {
    method: 'GET',
    options: { token: data.token },
    url: `${apiUrl}/api/website/${data.id}`
  }

  return await Axios(request)
}

export const getWebsites = async (apiUrl: string) => {
  const request = {
    method: 'GET',

    url: `${apiUrl}/api/website`
  }

  return await Axios(request)
}

export const getSourceCodeDownload = async (apiUrl: string, id: string) => {
  const request = {
    method: 'GET',
    url: `${apiUrl}/api/website/${id}/download`
  }

  return await Axios(request)
}

export type CreateWebsiteType = { name: string; type: string; info: string }
export const createWebsite = async (apiUrl: string, data: CreateWebsiteType) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/website`,
    data
  }

  return await Axios(request)
}

export const registerWebsite = async (apiUrl: string, id: string) => {
  const request = {
    method: 'POST',
    url: `${apiUrl}/api/website/${id}/register`
  }

  return await Axios(request)
}

export const getSiteShot = async (url: string) => {
  const request = {
    method: 'GET',
    url: `https://api.site-shot.com/?url=${url}&response_type=json&format=jpeg&width=1024&height=768&userkey=IAAIEYKBJA4TC56IA5XGWW7BWN`
  }

  return await Axios(request)
}
