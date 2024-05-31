import { createApi } from 'unsplash-js'

const globalForUnsplash: any = global

const unsplash =
  globalForUnsplash.unsplash ||
  createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY as string
  })

globalForUnsplash.unsplash = unsplash

export default unsplash
