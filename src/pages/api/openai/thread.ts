import { NextApiRequest, NextApiResponse } from 'next/types'
import openai from 'src/lib/openai'
import { HTTP } from 'src/types/enums'

/**
 * @swagger
 * /api/openai/thread:
 *   get:
 *     summary: Creates a new thread for OpenAI's Assistant API
 *     description: Creates a new thread for OpenAI's Assistant API
 *     responses:
 *       201:
 *         description: Successfully created a new thread for OpenAI's Assistant API
 *       400:
 *         description: Failed to create a new thread for OpenAI's Assistant API
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
      const newThread = await openai.beta.threads.create()

      return res.status(HTTP.CREATED).json(newThread)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
