import { Axios } from 'src/api/axios'

export const createThread = async () => {
  const request = {
    method: 'GET',
    url: `/api/openai/thread`
  }

  return await Axios(request)
}

type CreateMessageDTO = {
  threadId: string
  msg: string
}

export const createMessage = async (data: CreateMessageDTO) => {
  const request = {
    method: 'POST',
    url: `/api/openai/message`,
    data
  }

  return await Axios(request)
}
export const createRun = async (threadId: string) => {
  const request = {
    method: 'POST',
    url: `/api/openai/run/${threadId}`
  }

  return await Axios(request)
}

type RetrieveRunDTO = {
  threadId: string
  runId: string
}

export const retrieveRun = async (data: RetrieveRunDTO) => {
  const request = {
    method: 'POST',
    url: `/api/openai/retrieve`,
    data
  }

  return await Axios(request)
}

export const getMessages = async (threadId: string) => {
  const request = {
    method: 'GET',
    url: `/api/openai/messages/${threadId}`
  }

  return await Axios(request)
}
