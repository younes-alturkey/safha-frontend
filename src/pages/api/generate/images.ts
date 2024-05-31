import { faker } from '@faker-js/faker'
import { Storage } from '@google-cloud/storage'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { base64ToJson, sleep } from 'src/@core/utils'
import { cropImage, mjFetch, mjImagine } from 'src/api/generate'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  prompt: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/generate/images:
 *   post:
 *     summary: Generates 4 images based on the provided prompt using Midjourney
 *     description: Generates 4 images based on the provided prompt using Midjourney
 *     responses:
 *       201:
 *         description: Successfully generated 4 images based on the provided prompt using Midjourney
 *       400:
 *         description: Failed to generate 4 images based on the provided prompt
 *       401:
 *         description: Unauthorized request
 *       405:
 *         description: Requested method is not allowed
 *       500:
 *         description: Internal server error occured
 */

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      if (!req.headers.origin) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'Access denied' })
      }

      const gcpCredentialsBase64 = process.env.GCP_CREDENTIALS_BASE64
      const gcpProjectId = process.env.GCP_PROJECT_ID

      if (!gcpCredentialsBase64) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP credentials was not provided.' })
      }

      if (!gcpProjectId) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP project id was not provided.' })
      }

      const { prompt } = req.body

      if (!prompt) return res.status(HTTP.BAD_REQUEST).json({ error: 'No prompt was provided.' })

      const mjImagineRes = await mjImagine({ prompt, process_mode: 'fast' })
      if (mjImagineRes.status !== HTTP.OK) throw new Error('Mijourney imagine API failed.')

      const task_id = mjImagineRes.data.task_id
      if (!task_id) throw new Error('Failed to get task ID from Midjourney imagine API response.')

      let mjFetchRes = await mjFetch({ task_id })
      if (mjFetchRes.status !== HTTP.OK) throw new Error('Mijourney fetch API failed.')
      while (mjFetchRes.data.status !== 'finished') {
        await sleep(3000)
        mjFetchRes = await mjFetch({ task_id })
        if (mjFetchRes.status !== HTTP.OK) throw new Error('Mijourney fetch API failed.')
      }

      const image_url = mjFetchRes.data?.task_result?.image_url
      if (!image_url) throw new Error('Failed to get image URL from Midjourney fetch API response.')

      const response = await fetch(image_url)
      if (!response.ok) return res.status(HTTP.NOT_FOUND).json({ error: 'Image not found.' })
      const arrayBuffer = await response.arrayBuffer()
      const imagesData = Buffer.from(arrayBuffer)

      const gcpCredentials = base64ToJson(gcpCredentialsBase64)

      const storage = new Storage({
        projectId: gcpProjectId,
        credentials: gcpCredentials
      })

      const bucketName = 'gen-ass'
      const folderName = 'images'
      const imageFileName = faker.internet.userName().toLowerCase().replaceAll('_', '').replaceAll(/\d+/g, '')

      const [exists] = await storage.bucket(bucketName).exists()

      if (!exists) {
        await storage.createBucket(bucketName)
        await storage.bucket(bucketName).makePublic()
      }

      const file = storage.bucket(bucketName).file(`${folderName}/${imageFileName}.jpg`)
      await file.save(imagesData, {
        metadata: {
          contentType: 'image/jpg'
        }
      })

      const imagesUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${imageFileName}.jpg`

      const width = 1024
      const height = 1024

      let imageFile = null
      const firstImageRes = await cropImage({ width, height, x: 0, y: 0, imageType: 'png', imageUrl: imagesUrl })
      if (firstImageRes.status !== HTTP.OK) throw new Error('Failed to crop the first image.')
      const firstLogoData = firstImageRes.data
      const firstLogoName = `${imageFileName}-1`
      imageFile = storage.bucket(bucketName).file(`${folderName}/${firstLogoName}.jpg`)
      await imageFile.save(firstLogoData, {
        metadata: {
          contentType: 'image/jpg'
        }
      })
      const firstImageUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${firstLogoName}.jpg`

      const secondImageRes = await cropImage({ width, height, x: 1024, y: 0, imageType: 'png', imageUrl: imagesUrl })
      if (secondImageRes.status !== HTTP.OK) throw new Error('Failed to crop the second image.')
      const secondLogoData = secondImageRes.data
      const secondLogoName = `${imageFileName}-2`
      imageFile = storage.bucket(bucketName).file(`${folderName}/${secondLogoName}.jpg`)
      await imageFile.save(secondLogoData, {
        metadata: {
          contentType: 'image/jpg'
        }
      })
      const secondImageUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${secondLogoName}.jpg`

      const thirdImageRes = await cropImage({ width, height, x: 0, y: 1024, imageType: 'png', imageUrl: imagesUrl })
      if (thirdImageRes.status !== HTTP.OK) throw new Error('Failed to crop the third image.')
      const thirdLogoData = thirdImageRes.data
      const thirdLogoName = `${imageFileName}-3`
      imageFile = storage.bucket(bucketName).file(`${folderName}/${thirdLogoName}.jpg`)
      await imageFile.save(thirdLogoData, {
        metadata: {
          contentType: 'image/jpg'
        }
      })
      const thirdImageUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${thirdLogoName}.jpg`

      const fourthImageRes = await cropImage({ width, height, x: 1024, y: 1024, imageType: 'png', imageUrl: imagesUrl })
      if (fourthImageRes.status !== HTTP.OK) throw new Error('Failed to crop the fourth image.')
      const fourthLogoData = fourthImageRes.data
      const fourthLogoName = `${imageFileName}-4`
      imageFile = storage.bucket(bucketName).file(`${folderName}/${fourthLogoName}.jpg`)
      await imageFile.save(fourthLogoData, {
        metadata: {
          contentType: 'image/jpg'
        }
      })
      const fourthImageUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${fourthLogoName}.jpg`

      return res.status(HTTP.OK).json({ images: [firstImageUrl, secondImageUrl, thirdImageUrl, fourthImageUrl] })
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
