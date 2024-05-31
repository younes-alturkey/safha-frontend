import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import TestWrapper from 'src/@core/components/test-wrapper'
import RestPasswordPage from 'src/pages/reset-password'

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

jest.mock('src/api/auth', () => ({
  forgot: jest.fn().mockResolvedValue({ status: 200 })
}))

jest.mock('src/api/analytics', () => ({
  createEvent: jest.fn().mockResolvedValue({ status: 200, data: {} }),
  getIPInfo: jest.fn().mockResolvedValue({ status: 200, data: {} })
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        email: 'admin@safha.com'
      }
    }
  })
}))

let container: HTMLElement
let submitButton: HTMLButtonElement
let logoImage: HTMLImageElement
let emailInput: HTMLInputElement
const user = {
  email: 'testuser@example.com'
}
const redirectUrl = '/signin'

beforeEach(() => {
  jest.useFakeTimers()

  const rendered = render(
    <TestWrapper mode='light'>
      <RestPasswordPage apiUrl='https://sapi.safha.com' />
    </TestWrapper>
  )
  container = rendered.container
  submitButton = document.getElementById('submit-button') as HTMLButtonElement
  logoImage = document.getElementById('safha-logo') as HTMLImageElement
  emailInput = document.getElementById('email') as HTMLInputElement
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  cleanup()
})

describe('Reset Password Page', () => {
  it('renders reset-password page unchanged', () => {
    expect(container).toMatchSnapshot()
  })

  it('displays the logo image', () => {
    expect(logoImage).toBeInTheDocument()
  })

  it('renders submit button correctly', () => {
    expect(submitButton).toBeInTheDocument()
  })

  it('renders submit button disabled', () => {
    expect(submitButton).toBeDisabled()
  })

  it('allows user to input email', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
    })

    expect(emailInput).toHaveValue(user.email)
  })

  it('sends forgot email successfully', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(redirectUrl)
    })
  })

  it('handles form is reset after submission', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(emailInput).toHaveValue('')
    })
  })
})
