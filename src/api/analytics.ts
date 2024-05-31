import { Axios } from 'src/api/axios'

type MixpanelEventType = {
  name: string
  id: string
  fields: string[]
}

export const createEvent = async (data: MixpanelEventType) => {
  const request = {
    method: 'POST',
    url: `/api/analytics/event`,
    data
  }

  return await Axios(request)
}

export const getIPInfo = async () => {
  const request = {
    method: 'GET',
    url: `https://ipinfo.io/json?token=1ef0aadd263d33`
  }

  return await Axios(request)
}
