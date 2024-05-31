import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import TestWrapper from 'src/@core/components/test-wrapper'
import SignUpPage from 'src/pages/signup'

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
  register: jest.fn().mockResolvedValue({ status: 201 })
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

let container: HTMLElement
let firstnameInput: HTMLInputElement
let lastnameInput: HTMLInputElement
let emailInput: HTMLInputElement
let passwordInput: HTMLInputElement
let submitButton: HTMLButtonElement
let togglePasswordButton: HTMLButtonElement
let logoImage: HTMLImageElement
const random = Math.random().toString(36).substring(2, 15)
const user = {
  firstname: 'Test',
  lastname: 'User',
  email: `${random}@safha.com`,
  password: 'Safha123..'
}

const redirectParams = '/dash'

beforeEach(() => {
  jest.useFakeTimers()

  const rendered = render(
    <TestWrapper mode='light'>
      <SignUpPage apiUrl='https://sapi.safha.com' />
    </TestWrapper>
  )
  container = rendered.container
  firstnameInput = document.getElementById('firstname') as HTMLInputElement
  lastnameInput = document.getElementById('lastname') as HTMLInputElement
  emailInput = document.getElementById('email') as HTMLInputElement
  passwordInput = document.getElementById('password') as HTMLInputElement
  submitButton = document.getElementById('signup-button') as HTMLButtonElement
  togglePasswordButton = document.getElementById('toggle-password') as HTMLButtonElement
  logoImage = document.getElementById('safha-logo') as HTMLImageElement
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  cleanup()
})

describe('SignUp Page', () => {
  it('renders SignUp page unchanged', () => {
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
      fireEvent.change(firstnameInput, { target: { value: user.firstname } })
      fireEvent.change(lastnameInput, { target: { value: user.lastname } })
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
    })

    expect(firstnameInput).toHaveValue(user.firstname)
    expect(lastnameInput).toHaveValue(user.lastname)
    expect(emailInput).toHaveValue(user.email)
    expect(passwordInput).toHaveValue(user.password)
  })

  it('registers a user successfully', async () => {
    await act(async () => {
      fireEvent.change(firstnameInput, { target: { value: user.firstname } })
      fireEvent.change(lastnameInput, { target: { value: user.lastname } })
      fireEvent.change(emailInput, { target: { value: user.email } })
      fireEvent.change(passwordInput, { target: { value: user.password } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith(redirectParams))
  })

  it('toggles password visibility', async () => {
    fireEvent.click(togglePasswordButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(togglePasswordButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
