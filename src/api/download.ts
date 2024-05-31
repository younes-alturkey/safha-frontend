import { Axios } from 'src/api/axios'

type DownloadImageType = {
  imageUrl: string
  imageName: string
  imageExtension: string
}

export const downloadImage = async (data: DownloadImageType) => {
  const request = {
    method: 'POST',
    url: '/api/download/image',
    responseType: 'arraybuffer',
    data
  }

  return await Axios(request)
}
