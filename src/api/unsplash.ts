import { Axios } from 'src/api/axios'

type SearchUnsplashType = {
  query: string
  page?: number
  perPage?: number
  orientation?: string
  contentFilter?: string
  color?: string
  orderBy?: string
  collectionIds?: string[]
  lang?: string
}

export const unsplashSearch = async (data: SearchUnsplashType) => {
  const request = {
    method: 'POST',
    url: '/api/unsplash/search',
    data
  }

  return await Axios(request)
}
