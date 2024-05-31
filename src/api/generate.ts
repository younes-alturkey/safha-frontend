import axios from 'axios'
import FormData from 'form-data'
import { Axios } from 'src/api/axios'

type GenerateLogosType = {
  prompt: string
}

export const generateLogos = async (data: GenerateLogosType) => {
  const request = {
    method: 'POST',
    url: '/api/generate/logos',
    data
  }

  return await Axios(request)
}

type GenerateImagesType = {
  prompt: string
}

export const generateImages = async (data: GenerateImagesType) => {
  const request = {
    method: 'POST',
    url: '/api/generate/images',
    data
  }

  return await Axios(request)
}

type MJImagineType = {
  prompt: string
  process_mode: string
}

export const mjImagine = async (data: MJImagineType) => {
  const request = {
    method: 'POST',
    url: `https://api.midjourneyapi.xyz/mj/v2/imagine`,
    options: { xApiKey: '1ad3523a5077df3db8a4245a8a21d07166e7b9925e3f0bd5a1ac8a025221f29f' },
    data
  }

  return await Axios(request)
}

type MJFetchType = {
  task_id: string
}

export const mjFetch = async (data: MJFetchType) => {
  const request = {
    method: 'POST',
    url: `https://api.midjourneyapi.xyz/mj/v2/fetch`,
    data
  }

  return await Axios(request)
}

type RemoveBgType = {
  size: string
  format: string
  image_url: string
}

export const removeBg = async (props: RemoveBgType) => {
  const data = new FormData()
  data.append('size', props.size)
  data.append('format', props.format)
  data.append('image_url', props.image_url)

  const config = {
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data,
    responseType: 'arraybuffer',
    headers: {
      ...data.getHeaders(),
      'X-Api-Key': 'xqvLrWqLyoAX71VwhHu8yuak'
    },
    encoding: null
  } as any

  return await axios(config)
}

type CropImageType = {
  width: number
  height: number
  x: number
  y: number
  imageUrl: string
  imageType: string
}

export const cropImage = async (props: CropImageType) => {
  const request = {
    method: 'GET',
    url: `https://studio.pixelixe.com/api/crop/v1?width=${props.width}&height=${props.height}&x=${props.x}&y=${props.y}&imageType=${props.imageType}&imageUrl=${props.imageUrl}`,
    options: { token: '125cq9ayNsVBfQlDaQqEeR1EIGM2' },
    responseType: 'arraybuffer'
  }

  return await Axios(request)
}
