import { Storage } from '@google-cloud/storage'
import formidable from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { base64ToJson, toMb } from 'src/@core/utils'
import { HTTP } from 'src/types/enums'

export const config = {
  api: {
    bodyParser: false
  }
}

interface FormidableConfig {
  keepExtensions: boolean
  maxFileSize: number
  maxFieldsSize: number
  maxFields: number
  maxFiles: number
  allowEmptyFiles: boolean
  multiples: boolean
}

const formidableConfig: FormidableConfig = {
  keepExtensions: true,
  maxFileSize: toMb(50),
  maxFieldsSize: toMb(50),
  maxFiles: 1,
  maxFields: 2,
  allowEmptyFiles: false,
  multiples: false
}

/**
 * @swagger
 * /api/gcp/upload:
 *   post:
 *     summary: Uploads a file to GCP object storage
 *     description: Uploads a file to GCP object storage
 *     responses:
 *       201:
 *         description: Successfully uploaded a file to GCP object storage
 *       400:
 *         description: Failed to upload a file to GCP object storage
 *       401:
 *         description: Unauthorized request
 *       405:
 *         description: Requested method is not allowed
 *       500:
 *         description: Internal server error occured
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

      const form = formidable(formidableConfig)
      const [fields, files] = await form.parse(req)

      if (!files.file) return res.status(HTTP.BAD_REQUEST).json({ error: 'a file was not provided.' })
      const file = files.file[0]

      if (!fields['bucketName'])
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP bucket name was not provided.' })
      const bucketName = fields['bucketName'][0]

      if (!fields['folderName'])
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP folder name was not provided.' })
      const folderName = fields['folderName'][0]

      const gcpCredentials = base64ToJson(gcpCredentialsBase64)

      const storage = new Storage({
        projectId: gcpProjectId,
        credentials: gcpCredentials
      })

      const [exists] = await storage.bucket(bucketName).exists()

      if (!exists) {
        await storage.createBucket(bucketName)
        await storage.bucket(bucketName).makePublic()
      }

      if (!file) return res.status(HTTP.BAD_REQUEST).json({ error: 'a file was not provided.' })

      const fileUploadRes = await storage.bucket(bucketName).upload(file.filepath, {
        destination: folderName + file.originalFilename
      })

      const apiEndpoint = fileUploadRes[0].storage.apiEndpoint
      const bucket = fileUploadRes[0].metadata.bucket
      const name = fileUploadRes[0].metadata.name
      const url = `${apiEndpoint}/${bucket}/${name}`

      return res.status(HTTP.OK).json({
        status: 'success',
        operation: 'upload',
        message: `Successfully uploaded ${
          folderName + file.originalFilename
        } to GCP object storage bucket ${bucketName}.`,
        url
      })
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
