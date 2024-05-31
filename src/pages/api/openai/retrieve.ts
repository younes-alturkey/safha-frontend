import { NextApiRequest, NextApiResponse } from 'next/types'
import openai from 'src/lib/openai'
import { HTTP } from 'src/types/enums'

interface RequestBody {
  threadId: string
  runId: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: RequestBody
}

/**
 * @swagger
 * /api/openai/retrieve:
 *   post:
 *     summary: Retrieve a run for OpenAI's Assistant API thread
 *     description: Retrieve a run for OpenAI's Assistant API thread
 *     responses:
 *       200:
 *         description: Successfully retrieved run in OpenAI's Assistant API thread
 *       400:
 *         description: Failed to retrieve run in OpenAI's Assistant API thread
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
      const { threadId, runId } = req.body
      const run = await openai.beta.threads.runs.retrieve(threadId, runId)

      return res.status(HTTP.OK).json(run)
    } else {
      return res.status(HTTP.METHOD_NOT_ALLOWED).end()
    }
  } catch (error) {
    console.error(error)

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error occured.' })
  }
}
