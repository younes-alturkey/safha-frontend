import { NextApiRequest, NextApiResponse } from 'next/types'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  imageUrl: string
  imageName: string
  imageExtension: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/download/image:
 *   post:
 *     summary: Downloads an image from a given URL
 *     description: Downloads an image from a given URL
 *     responses:
 *       200:
 *         description: Successfully downloaded an image from a given URL
 *       400:
 *         description: Failed to download an image from a given URL
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
      const { imageUrl, imageName, imageExtension } = req.body
      if (typeof imageUrl !== 'string') return res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid URL.' })
      const response = await fetch(imageUrl)
      if (!response.ok) return res.status(HTTP.NOT_FOUND).json({ error: 'Image not found.' })
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      res.setHeader('Content-Disposition', `attachment; filename="${imageName}"`)
      res.setHeader('Content-Type', `image/${imageExtension}`)
      res.status(HTTP.OK).send(buffer)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
