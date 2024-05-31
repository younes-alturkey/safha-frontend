import { Storage } from '@google-cloud/storage'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { base64ToJson } from 'src/@core/utils'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  fileName: string
  bucketName: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/gcp/delete:
 *   delete:
 *     summary: Deletes a file from GCP object storage
 *     description: Deletes a file from GCP object storage
 *     responses:
 *       201:
 *         description: Successfully deleted a file from GCP object storage
 *       400:
 *         description: Failed to delete a file from GCP object storage
 *       401:
 *         description: Unauthorized request
 *       405:
 *         description: Requested method is not allowed
 *       500:
 *         description: Internal server error occured
 */

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'DELETE') {
      if (!req.headers.origin) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'Access denied' })
      }

      const data = req.body
      const bucketName = data.bucketName
      const fileName = data.fileName
      if (!bucketName) return res.status(HTTP.BAD_REQUEST).json({ error: 'Bucket name was not provided.' })
      if (!fileName) return res.status(HTTP.BAD_REQUEST).json({ error: 'File name was not provided.' })

      const gcpCredentialsBase64 = process.env.GCP_CREDENTIALS_BASE64
      const gcpProjectId = process.env.GCP_PROJECT_ID

      if (!gcpCredentialsBase64) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP credentials was not provided.' })
      }

      if (!gcpProjectId) {
        return res.status(HTTP.UNAUTHORIZED).json({ error: 'GCP project id was not provided.' })
      }

      const gcpCredentials = base64ToJson(gcpCredentialsBase64)

      const storage = new Storage({
        projectId: gcpProjectId,
        credentials: gcpCredentials
      })

      await storage.bucket(bucketName).file(fileName).delete()

      return res.status(HTTP.OK).json({
        status: 'success',
        operation: 'delete',
        message: `Successfully deleted ${fileName} to GCP object storage bucket ${bucketName}.`
      })
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
