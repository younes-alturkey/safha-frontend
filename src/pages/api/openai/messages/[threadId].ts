import { NextApiRequest, NextApiResponse } from 'next/types'
import openai from 'src/lib/openai'
import { HTTP } from 'src/types/enums'

/**
 * @swagger
 * /api/openai/messages/{threadId}:
 *   get:
 *     summary: Gets list of thread messages for OpenAI's Assistant API
 *     description: Gets list of thread messages for OpenAI's Assistant API
 *     responses:
 *       200:
 *         description: Successfully got list of thread messages for OpenAI's Assistant API
 *       400:
 *         description: Failed to get list of thread messages for OpenAI's Assistant API
 *       401:
 *         description: Unauthorized request
 *       405:
 *         description: Requested method is not allowed
 *       500:
 *         description: Internal server error occured
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const threadId = req.query.threadId
      const messages = await openai.beta.threads.messages.list(threadId)

      return res.status(HTTP.OK).json(messages)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
