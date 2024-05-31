import { NextApiRequest, NextApiResponse } from 'next/types'
import openai from 'src/lib/openai'
import { HTTP } from 'src/types/enums'

/**
 * @swagger
 * /api/openai/run/{threadId}:
 *   post:
 *     summary: Creates a new run for OpenAI's Assistant API thread
 *     description: Creates a new run for OpenAI's Assistant API thread
 *     responses:
 *       201:
 *         description: Successfully created a new run in OpenAI's Assistant API thread
 *       400:
 *         description: Failed to create a new run in OpenAI's Assistant API thread
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
      const threadId = req.query.threadId
      const newRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: process.env.OPENAI_SAFHAGPT_ASSISTANT_ID as string
      })

      return res.status(HTTP.CREATED).json(newRun)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
