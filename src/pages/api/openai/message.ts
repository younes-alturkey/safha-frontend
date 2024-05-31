import { NextApiRequest, NextApiResponse } from 'next/types'
import openai from 'src/lib/openai'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  threadId: string
  msg: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/openai/message:
 *   post:
 *     summary: Creates a new message in an existing OpenAI's Assistant API thread
 *     description: Creates a new message in an existing OpenAI's Assistant API thread
 *     responses:
 *       201:
 *         description: Successfully created a new message in OpenAI's Assistant API thread
 *       400:
 *         description: Failed to create a new message in OpenAI's Assistant API thread
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
      const { threadId, msg } = req.body
      const newMsg = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: msg
      })

      return res.status(HTTP.CREATED).json(newMsg)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
