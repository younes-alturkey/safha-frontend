import { faker } from '@faker-js/faker'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as Sentry from '@sentry/nextjs'
import { extractConfirmationMessage, extractWebsiteInfo, sleep } from 'src/@core/utils'
import { createMessage, createRun, createThread, getMessages, retrieveRun } from 'src/api/openai'
import { createWebsite } from 'src/api/website'
import { HTTP } from 'src/types/enums'

export const createNewThread = createAsyncThunk('chat/createNewThread', async (_, { rejectWithValue }) => {
  try {
    const threadRes = await createThread()
    if (threadRes.status === HTTP.CREATED) {
      const threadData = threadRes.data
      const thread = {
        id: threadData.id,
        createdAt: threadData.created_at,
        status: 'requirements',
        url: ''
      }

      return thread
    } else {
      throw new Error('Failed to create new thread.')
    }
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)

    return rejectWithValue('An unexpected error occurred')
  }
})

export const getAssistantMessages = createAsyncThunk('chat/getAssistantMessages', async (args: any, thunkAPI) => {
  try {
    const { thread } = args as any
    const messagesRes = await getMessages(thread.id)
    if (messagesRes.status === HTTP.OK) {
      const messages = messagesRes.data.data

      return messages
    } else {
      throw new Error('Failed to fetch assistant messages.')
    }
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const messageAssistant = createAsyncThunk('chat/messageAssistant', async (args: any, thunkAPI) => {
  try {
    let modifiedThread: any = null
    let isReady = false
    let messages: any[] = []
    let websiteInfo = ''
    let confirmationMessage = ''
    let modifiedMessages: any[] = []

    const { thread, msg } = args as any
    const messageRes = await createMessage({ threadId: thread.id, msg })
    if (messageRes.status === HTTP.CREATED) {
      const runRes = await createRun(thread.id)
      if (runRes.status === HTTP.CREATED) {
        const runId = runRes.data.id
        let runRetrieved = await retrieveRun({ threadId: thread.id, runId })
        if (runRetrieved.status === HTTP.OK) {
          let status = runRetrieved.data.status
          while (status !== 'completed') {
            await sleep(3000)
            runRetrieved = await retrieveRun({ threadId: thread.id, runId })
            if (runRetrieved.status === HTTP.OK) status = runRetrieved.data.status
          }
          const messagesRes = await getMessages(thread.id)
          if (messagesRes.status === HTTP.OK) {
            messages = messagesRes.data.data
            const latestMessage = messages[0]
            isReady = latestMessage.content[0].text.value.includes('Allah Is The Greatest of All')
            if (isReady) {
              const msg = latestMessage.content[0].text.value

              websiteInfo = extractWebsiteInfo(msg)
              confirmationMessage = extractConfirmationMessage(msg)

              modifiedMessages = messages.map((msg: any) => {
                if (msg.id === latestMessage.id) {
                  return {
                    ...msg,
                    content: [{ ...msg.content[0], text: { value: confirmationMessage } }]
                  }
                }

                return msg
              })

              modifiedThread = {
                id: thread.id,
                createdAt: thread.createdAt,
                status: 'generating',
                url: ''
              }
            }
          }
        }
      }

      return { messages, modifiedThread, isReady, websiteInfo, confirmationMessage, modifiedMessages }
    } else {
      throw new Error('Failed to message assistant.')
    }
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const generateWebsite = createAsyncThunk('chat/generateWebsite', async (args: any, thunkAPI) => {
  try {
    let modifiedThread: any = null
    let live = null

    const { apiUrl, info, thread, type } = args as any
    const websiteRes = await createWebsite(apiUrl, {
      name: faker.person.firstName(),
      type,
      info
    })

    if (websiteRes.status === HTTP.CREATED) {
      if (websiteRes.data) {
        const url = `https://${websiteRes.data.resouceName}.safha.com`

        modifiedThread = {
          id: thread.id,
          createdAt: thread.createdAt,
          status: 'live',
          url
        }

        live = { title: websiteRes.data.resouceName, url, threadId: thread.id }

        return { modifiedThread, live }
      } else {
        throw new Error('Reading website creation response failed.')
      }
    } else {
      throw new Error('Website creation failed.')
    }
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const deleteWebsite = createAsyncThunk('chat/deleteWebsite', async (_, { rejectWithValue }) => {
  try {
    await sleep(5000)
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)

    return rejectWithValue('An unexpected error occurred')
  }
})

type ChatStateType = {
  showSettings: boolean
  showInfo: boolean
  locked: boolean
  loading: boolean
  generating: boolean
  thread: any
  threads: any[]
  messages: any[]
  prompt: string
  websiteInfo: string
  live: { title: string; url: string; threadId: string } | null
  playFireworks: boolean
  deleting: boolean
}

const initialState: ChatStateType = {
  showSettings: false,
  showInfo: false,
  locked: false,
  loading: false,
  generating: false,
  thread: null,
  threads: [],
  messages: [],
  prompt: '',
  websiteInfo: '',
  live: { title: 'title', url: 'url', threadId: 'threadId' },
  playFireworks: false,
  deleting: false
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setShowSettings(state, action: PayloadAction<boolean>) {
      state.showSettings = action.payload
    },
    setShowInfo(state, action: PayloadAction<boolean>) {
      state.showInfo = action.payload
    },
    setLocked(state, action: PayloadAction<boolean>) {
      state.locked = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setThreads(state, action: PayloadAction<any[]>) {
      state.threads = action.payload
    },
    setThread(state, action: PayloadAction<any>) {
      state.thread = action.payload
    },
    setMessages(state, action: PayloadAction<any[]>) {
      state.messages = action.payload
    },
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload
    },
    setLive(state, action: PayloadAction<{ title: string; url: string; threadId: string } | null>) {
      state.live = action.payload
    },
    setPlayFireworks(state, action: PayloadAction<boolean>) {
      state.playFireworks = action.payload
    },
    setDeleting(state, action: PayloadAction<boolean>) {
      state.deleting = action.payload
    },
    clearMessages(state) {
      state.messages = []
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewThread.fulfilled, (state, action) => {
      const thread = action.payload
      state.threads.push(thread)
      state.thread = thread
      state.loading = false
    })
    builder.addCase(createNewThread.pending, state => {
      state.loading = true
    })
    builder.addCase(createNewThread.rejected, state => {
      state.loading = false
    })

    builder.addCase(getAssistantMessages.fulfilled, (state, action) => {
      const messages = action.payload
      state.messages = messages
      state.loading = false
    })
    builder.addCase(getAssistantMessages.pending, state => {
      state.loading = true
    })
    builder.addCase(getAssistantMessages.rejected, state => {
      state.loading = false
    })

    builder.addCase(messageAssistant.fulfilled, (state, action) => {
      const payload = action.payload
      if (payload.isReady) {
        const modifiedThreads = state.threads.filter(t => t.id !== payload.modifiedThread.id)
        state.threads = [...modifiedThreads, payload.modifiedThread]
        state.messages = payload.modifiedMessages
        state.websiteInfo = payload.websiteInfo
      } else {
        state.messages = payload.messages
      }
      state.loading = false
    })
    builder.addCase(messageAssistant.pending, state => {
      state.loading = true
    })
    builder.addCase(messageAssistant.rejected, state => {
      state.loading = false
    })

    builder.addCase(generateWebsite.fulfilled, (state, action) => {
      const payload = action.payload
      const modifiedThreads = state.threads.filter(t => t.id !== payload.modifiedThread.id)
      state.threads = [...modifiedThreads, payload.modifiedThread]
      state.live = payload.live
      state.generating = false
    })
    builder.addCase(generateWebsite.pending, state => {
      state.generating = true
    })
    builder.addCase(generateWebsite.rejected, state => {
      state.generating = false
    })

    builder.addCase(deleteWebsite.fulfilled, state => {
      state.deleting = false
    })
    builder.addCase(deleteWebsite.pending, state => {
      state.deleting = true
    })
    builder.addCase(deleteWebsite.rejected, state => {
      state.deleting = false
    })
  }
})

export const {
  setShowSettings,
  setShowInfo,
  setLocked,
  setLoading,
  setThreads,
  setThread,
  setMessages,
  setPrompt,
  setLive,
  setPlayFireworks,
  setDeleting,
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
