import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react'
import TestWrapper from 'src/@core/components/test-wrapper'
import ChatPage from 'src/pages/chat'

const pushMock = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    isFallback: false
  })
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn()
  })
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn().mockResolvedValue({}),
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        email: 'admin@safha.com'
      }
    }
  })
}))

jest.mock('src/@core/layouts/utils', () => ({
  ...jest.requireActual('src/@core/layouts/utils'),
  handleURLQueries: jest.fn(() => true)
}))

jest.mock('react-markdown', () => ({ children }: any) => <div>{children}</div>)
jest.mock('rehype-raw', () => null)
jest.mock('remark-gfm', () => null)

jest.mock('src/api/openai', () => ({
  createMessage: jest.fn().mockResolvedValue({
    status: 201,
    data: { id: 'messageId', content: [{ text: { value: 'Test Message' } }] }
  }),
  createRun: jest.fn().mockResolvedValue({
    status: 201,
    data: { id: 'runId' }
  }),
  retrieveRun: jest.fn().mockResolvedValue({
    status: 200,
    data: { status: 'completed' }
  }),
  getMessages: jest.fn().mockResolvedValue({
    status: 200,
    data: {
      data: [
        {
          id: 'messageId',
          content: [
            {
              text: {
                value:
                  'Allah Is The Greatest of All. Website info: example.com, Confirmation: Task completed successfully.'
              }
            }
          ]
        }
      ]
    }
  }),
  createThread: jest.fn().mockResolvedValue({
    status: 201,
    data: { id: 'threadId', created_at: '2024-02-24T00:00:00Z' }
  })
}))

jest.mock('src/api/website', () => ({
  createWebsite: jest.fn().mockResolvedValue({
    status: 201,
    data: { id: 1000, created_at: '2024-02-24T00:00:00Z', resouceName: 'younesalturkey' }
  }),
  getSiteShot: jest.fn().mockResolvedValue({
    status: 200,
    data: { image: 'imagedata' }
  })
}))

jest.mock('src/@core/utils', () => ({
  handleCreateEvent: jest.fn().mockResolvedValue({
    status: 200,
    data: {}
  }),
  sortArr: jest.fn().mockReturnValue([])
}))

jest.mock('fireworks-js', () => {
  return {
    Fireworks: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      remove: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    }))
  }
})

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn().mockImplementation(selector =>
    selector({
      chat: {
        playFireworks: false,
        showSettings: false,
        showInfo: false,
        locked: false,
        loading: false,
        generating: false,
        threads: []
      }
    })
  )
}))

let submitButton: HTMLButtonElement

beforeEach(() => {
  jest.useFakeTimers()

  render(
    <TestWrapper mode='light'>
      <ChatPage apiUrl='https://sapi.safha.com' />
    </TestWrapper>
  )
  submitButton = document.getElementById('submit-button') as HTMLButtonElement
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  cleanup()
})

describe('Chat Page', () => {
  it('renders submit button correctly', () => {
    expect(submitButton).toBeInTheDocument()
  })

  it('renders submit button disabled', () => {
    expect(submitButton).toBeDisabled()
  })
})
