import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import TestWrapper from 'src/@core/components/test-wrapper'
import SignInPage from 'src/pages/signin'

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
  signIn: jest.fn().mockResolvedValue({ status: 200 }),
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        email: 'admin@safha.com'
      }
    }
  })
}))

jest.mock('src/api/analytics', () => ({
  createEvent: jest.fn().mockResolvedValue({ status: 200, data: {} }),
  getIPInfo: jest.fn().mockResolvedValue({ status: 200, data: {} })
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

let container: HTMLElement
let submitButton: HTMLButtonElement
let logoImage: HTMLImageElement
let emailInput: HTMLInputElement
let passwordInput: HTMLInputElement
let togglePasswordButton: HTMLButtonElement

const user = {
  email: 'admin@safha.com',
  password: 'Safha123..'
}
const redirectUrl = '/dash'

beforeEach(() => {
  jest.useFakeTimers()

  const rendered = render(
    <TestWrapper mode='light'>
      <SignInPage />
    </TestWrapper>
  )
  container = rendered.container
  submitButton = document.getElementById('signin-button') as HTMLButtonElement
  logoImage = document.getElementById('safha-logo') as HTMLImageElement
  emailInput = document.getElementById('email') as HTMLInputElement
  passwordInput = document.getElementById('password') as HTMLInputElement
  togglePasswordButton = document.getElementById('toggle-password') as HTMLButtonElement
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  cleanup()
})

describe('SignIn Page', () => {
  it('renders SignIn page unchanged', () => {
    expect(container).toMatchSnapshot()
  })

  it('renders submit button correctly', () => {
    expect(submitButton).toBeInTheDocument()
  })

  it('renders submit button disabled', () => {
    expect(submitButton).toBeDisabled()
  })

  it('displays the logo image', () => {
    expect(logoImage).toBeInTheDocument()
  })

  it('allows user to input email and password', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
    })

    expect(emailInput).toHaveValue(user.email)
    expect(passwordInput).toHaveValue(user.password)
  })

  it('signin the user successfully', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith(redirectUrl))
  })

  it('handles form is reset after submission', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    })
  })

  it('toggles password visibility', async () => {
    fireEvent.click(togglePasswordButton)

    await waitFor(() => expect(passwordInput).toHaveAttribute('type', 'text'))
    fireEvent.click(togglePasswordButton)
    await waitFor(() => expect(passwordInput).toHaveAttribute('type', 'password'))
  })
})
