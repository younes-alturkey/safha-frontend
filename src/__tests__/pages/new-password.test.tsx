import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import TestWrapper from 'src/@core/components/test-wrapper'
import NewPasswordPage from 'src/pages/new-password'

const pushMock = jest.fn()
const replaceMock = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
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
    get: jest.fn().mockReturnValue('email@safha.com')
  })
}))

jest.mock('src/api/auth', () => ({
  reset: jest.fn().mockResolvedValue({ status: 200 })
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
let passwordInput: HTMLInputElement
let confirmPasswordInput: HTMLInputElement
const user = {
  password: 'Safha123..',
  confirmPassword: 'Safha123..'
}
const redirectParams = { pathname: '/signin', query: { email: 'email@safha.com' } }

beforeEach(() => {
  jest.useFakeTimers()

  const rendered = render(
    <TestWrapper mode='light'>
      <NewPasswordPage apiUrl='https://sapi.safha.com' />
    </TestWrapper>
  )
  container = rendered.container
  submitButton = document.getElementById('submit-button') as HTMLButtonElement
  logoImage = document.getElementById('safha-logo') as HTMLImageElement
  passwordInput = document.getElementById('password') as HTMLInputElement
  confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  cleanup()
})

describe('New Password Page', () => {
  it('renders new-password page unchanged', () => {
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

  it('allows user to input password and confirm password', async () => {
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.change(confirmPasswordInput, { target: { value: user.confirmPassword } })
    })

    expect(passwordInput).toHaveValue(user.password)
    expect(confirmPasswordInput).toHaveValue(user.confirmPassword)
  })

  it('resets password successfully', async () => {
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.change(confirmPasswordInput, { target: { value: user.confirmPassword } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(redirectParams)
    })
  })

  it('handles form is reset after submission', async () => {
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.change(confirmPasswordInput, { target: { value: user.confirmPassword } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(passwordInput).toHaveValue('')
      expect(confirmPasswordInput).toHaveValue('')
    })
  })
})
