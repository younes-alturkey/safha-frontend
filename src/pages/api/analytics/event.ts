import { NextApiRequest, NextApiResponse } from 'next/types'
import { arrToKeyValueObject } from 'src/@core/utils'
import mixpanel from 'src/lib/mixpanel'
import { HTTP } from 'src/types/enums'
import useragent from 'useragent'

interface RequestBody {
  name: string
  id: string
  fields: string[]
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/analytics/event:
 *   post:
 *     summary: Creates an analytical tracking event
 *     description: Creates an analytical tracking event
 *     responses:
 *       201:
 *         description: Successfully created an analytical tracking event
 *       400:
 *         description: Failed to create an analytical tracking event
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

      const userAgent = useragent.parse(req.headers['user-agent'])
      const properties = {
        $browser: userAgent.family,
        $device: userAgent.device.family,
        $os: userAgent.os.family
      }

      const event = req.body
      const fields = arrToKeyValueObject(event.fields)
      mixpanel.track(event.name, {
        distinct_id: event.id,
        ...properties,
        ...fields
      })

      const resp = {
        name: event.name,
        id: event.id,
        ...properties,
        ...fields
      }

      return res.status(HTTP.CREATED).json(resp)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
