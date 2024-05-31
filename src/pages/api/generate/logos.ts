import { faker } from '@faker-js/faker'
import { Storage } from '@google-cloud/storage'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { base64ToJson, sleep } from 'src/@core/utils'
import { cropImage, mjFetch, mjImagine, removeBg } from 'src/api/generate'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  prompt: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/generate/logos:
 *   post:
 *     summary: Generates 4 logos based on the provided prompt using Midjourney
 *     description: Generates 4 logos based on the provided prompt using Midjourney
 *     responses:
 *       201:
 *         description: Successfully generated 4 logos based on the provided prompt using Midjourney
 *       400:
 *         description: Failed to generate 4 logos based on the provided prompt
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

      const removeBgRes = await removeBg({ size: 'full', format: 'png', image_url })
      if (removeBgRes.status !== HTTP.OK) throw new Error('Remove.bg API failed.')

      const logosData = removeBgRes.data
      if (!logosData) throw new Error('Failed to get transparent logos file from Remove.bg API response.')

      const gcpCredentials = base64ToJson(gcpCredentialsBase64)

      const storage = new Storage({
        projectId: gcpProjectId,
        credentials: gcpCredentials
      })

      const bucketName = 'gen-ass'
      const folderName = 'logos'
      const logoFileName = faker.internet.userName().toLowerCase().replaceAll('_', '').replaceAll(/\d+/g, '')

      const [exists] = await storage.bucket(bucketName).exists()

      if (!exists) {
        await storage.createBucket(bucketName)
        await storage.bucket(bucketName).makePublic()
      }

      const file = storage.bucket(bucketName).file(`${folderName}/${logoFileName}.png`)
      await file.save(logosData, {
        metadata: {
          contentType: 'image/png'
        }
      })

      const logosUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${logoFileName}.png`

      const width = 1024
      const height = 1024

      let logoFile = null
      const firstLogoRes = await cropImage({ width, height, x: 0, y: 0, imageType: 'png', imageUrl: logosUrl })
      if (firstLogoRes.status !== HTTP.OK) throw new Error('Failed to crop the first logo.')
      const firstLogoData = firstLogoRes.data
      const firstLogoName = `${logoFileName}-1`
      logoFile = storage.bucket(bucketName).file(`${folderName}/${firstLogoName}.png`)
      await logoFile.save(firstLogoData, {
        metadata: {
          contentType: 'image/png'
        }
      })
      const firstLogoUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${firstLogoName}.png`

      const secondLogoRes = await cropImage({ width, height, x: 1024, y: 0, imageType: 'png', imageUrl: logosUrl })
      if (secondLogoRes.status !== HTTP.OK) throw new Error('Failed to crop the second logo.')
      const secondLogoData = secondLogoRes.data
      const secondLogoName = `${logoFileName}-2`
      logoFile = storage.bucket(bucketName).file(`${folderName}/${secondLogoName}.png`)
      await logoFile.save(secondLogoData, {
        metadata: {
          contentType: 'image/png'
        }
      })
      const secondLogoUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${secondLogoName}.png`

      const thirdLogoRes = await cropImage({ width, height, x: 0, y: 1024, imageType: 'png', imageUrl: logosUrl })
      if (thirdLogoRes.status !== HTTP.OK) throw new Error('Failed to crop the third logo.')
      const thirdLogoData = thirdLogoRes.data
      const thirdLogoName = `${logoFileName}-3`
      logoFile = storage.bucket(bucketName).file(`${folderName}/${thirdLogoName}.png`)
      await logoFile.save(thirdLogoData, {
        metadata: {
          contentType: 'image/png'
        }
      })
      const thirdLogoUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${thirdLogoName}.png`

      const fourthLogoRes = await cropImage({ width, height, x: 1024, y: 1024, imageType: 'png', imageUrl: logosUrl })
      if (fourthLogoRes.status !== HTTP.OK) throw new Error('Failed to crop the fourth logo.')
      const fourthLogoData = fourthLogoRes.data
      const fourthLogoName = `${logoFileName}-4`
      logoFile = storage.bucket(bucketName).file(`${folderName}/${fourthLogoName}.png`)
      await logoFile.save(fourthLogoData, {
        metadata: {
          contentType: 'image/png'
        }
      })
      const fourthLogoUrl = `https://storage.googleapis.com/${bucketName}/${folderName}/${fourthLogoName}.png`

      return res.status(HTTP.OK).json({ logos: [firstLogoUrl, secondLogoUrl, thirdLogoUrl, fourthLogoUrl] })
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
