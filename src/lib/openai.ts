import OpenAI from 'openai'

const globalForOpenAI: any = global

const openai =
  globalForOpenAI.openai ||
  new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY
  })

globalForOpenAI.openai = openai

export default openai
