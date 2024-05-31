import { NextApiRequest, NextApiResponse } from 'next/types'
import unsplash from 'src/lib/unsplash'
import { HTTP } from 'src/types/enums'

interface RequestBody {
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

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/unsplash/search:
 *   post:
 *     summary: Retrieve media from Unsplash API
 *     description: Retrieve media from Unsplash API
 *     responses:
 *       200:
 *         description: Successfully retrieved media from Unsplash API
 *       400:
 *         description: Failed to retrieve media from Unsplash API
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
      const args = req.body
      const photosReq = await unsplash.search.getPhotos(args)
      if (photosReq.status === HTTP.OK) return res.status(HTTP.OK).json({ args, response: photosReq.response })
      else throw new Error('Failed to retrieve media from Unsplash API')
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
