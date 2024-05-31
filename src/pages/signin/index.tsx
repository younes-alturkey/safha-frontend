import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import { Form, Formik, FormikHelpers } from 'formik'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FireworksContainer from 'src/@core/components/fireworks-container'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { getUniqueId, handleCreateEvent, modeToggle, switchLocale } from 'src/@core/utils'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { bucketUrl } from 'src/types/constants'
import { Events, HTTP } from 'src/types/enums'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import * as yup from 'yup'

interface FormData {
  email: string
  password: string
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const SignInPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [playFireworks, setPlayFireworks] = useState(false)
  const callbackUrlQParam = searchParams.get('callbackUrl')
  const [callbackUrl] = useState(callbackUrlQParam || '/dash')
  const emailQParam = searchParams.get('email')
  const [email] = useState(emailQParam)
  const passwordQParam = searchParams.get('password')
  const [password] = useState(passwordQParam)
  const welcome = searchParams.get('welcome')
  const isDark = settings.mode === 'dark'
  const logo = isDark
    ? `${bucketUrl}/safha-logo-transparent-white.png`
    : `${bucketUrl}/safha-logo-transparent-black.png`

  const FormSchema = yup.object().shape({
    email: yup
      .string()
      .email(`${t('invalid_email')}`)
      .required(`${t('field_required')}`),
    password: yup.string().required(`${t('field_required')}`)
  })

  const initialValues = {
    email: email || '',
    password: password || ''
  }

  const handleSwitchLocale = async () => {
    const currentLocale = i18n.language
    await switchLocale(settings, saveSettings, i18n)
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
    await handleCreateEvent(Events.SWITCHED_LOCALE, email, [`user_email: ${email}`, `current_locale: ${currentLocale}`])
  }

  const handleModeToggle = async () => {
    const mode = settings.mode
    modeToggle(settings, saveSettings)
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
    await handleCreateEvent(Events.SWITCHED_MODE, email, [`user_email: ${email}`, `current_mode: ${mode}`])
  }

  const onSubmit = async (values: FormData, formik: FormikHelpers<FormData>) => {
    setSubmitting(true)
    const temp_email = getUniqueId()
    let signinReq
    try {
      signinReq = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl
      })
    } catch (error) {
      Sentry.captureException(error)
      console.error(error)
      toast.error(t('something_went_wrong'))
      setSubmitting(false)

      return
    }

    const status = signinReq?.status
    switch (status) {
      case HTTP.OK:
        await handleCreateEvent(Events.SIGNED_IN, values.email, [
          'signin_type: direct',
          'signin_method: email',
          `user_email: ${values.email}`
        ])
        await router.push(callbackUrl)
        formik.resetForm()
        toast.success(t('welcome_back'))
        break
      case HTTP.UNAUTHORIZED:
        Sentry.captureMessage(`Unauthorized signin request: ${values.email} (${temp_email})`, { level: 'warning' })
        toast.error(t('unauthorized_request'))
        break
      case HTTP.NOT_FOUND:
        Sentry.captureMessage(`User not found signin request: ${values.email} (${temp_email})`, { level: 'warning' })
        toast.error(t('user_not_found'))
        break
      default:
        Sentry.captureMessage(`Something went wrong for signin request: ${values.email} (${temp_email})`, {
          level: 'warning'
        })
        toast.error(t('something_went_wrong'))
    }
    setSubmitting(false)
  }

  const stopFireworks = () => setPlayFireworks(false)

  const playWelcomeCelebration = () => {
    toast.success(t('you_joined_the_future_of_the_web'), {
      duration: 7500
    })
    setPlayFireworks(true)
  }

  useEffect(() => {
    if (welcome) playWelcomeCelebration()
  }, [welcome, emailQParam, passwordQParam, callbackUrlQParam])

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_sign_in')}</title>
      </Head>
      <Box className='content-center'>
        <AuthIllustrationV1Wrapper>
          <Card>
            <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
              <Box
                sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  id='safha-logo'
                  data-testid='safha-logo'
                  style={{ opacity: 0.5 }}
                  src={logo}
                  alt='Safha Logo'
                  width={150}
                  height={75}
                />
              </Box>

              <Formik initialValues={initialValues} validationSchema={FormSchema} onSubmit={onSubmit}>
                {formik => (
                  <Form noValidate className='w-full' autoComplete='off'>
                    <Box sx={{ position: 'relative' }}>
                      <CustomTextField
                        disabled={submitting}
                        fullWidth
                        id='email'
                        data-testid='email'
                        label={t('email')}
                        error={formik.touched.email && formik.errors.email ? true : false}
                        sx={{ mb: 3 }}
                        placeholder='younes@safha.com'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      <Typography
                        sx={{ position: 'absolute', top: 2, right: 8, color: 'error.main', fontSize: '0.625rem' }}
                      >
                        {formik.touched.email && formik.errors.email}
                      </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <CustomTextField
                        disabled={submitting}
                        fullWidth
                        sx={{ mb: 1.5 }}
                        label={t('password')}
                        error={formik.touched.password && formik.errors.password ? true : false}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        id='password'
                        data-testid='password'
                        placeholder='············'
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                id='toggle-password'
                                data-testid='toggle-password'
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Typography
                        sx={{ position: 'absolute', top: 2, right: 8, color: 'error.main', fontSize: '0.625rem' }}
                      >
                        {formik.touched.password && formik.errors.password}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        my: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography component={LinkStyled} href='/reset-password'>
                        {t('forgot_password')}
                      </Typography>
                    </Box>
                    <LoadingButton
                      id='signin-button'
                      data-testid='signin-button'
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mb: 4 }}
                      loading={submitting}
                      disabled={
                        !formik.values.email ||
                        !formik.values.password ||
                        Boolean(formik.errors.password) ||
                        Boolean(formik.errors.email)
                      }
                    >
                      {t('sign_in')}
                    </LoadingButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Typography component={LinkStyled} href='/signup'>
                        {t('create_account')}
                      </Typography>
                    </Box>
                  </Form>
                )}
              </Formik>
            </CardContent>

            <IconButton
              id='locale-switch-button'
              data-testid='locale-switch-button'
              sx={{ position: 'absolute', top: 0, right: 0, m: 2 }}
              onClick={handleSwitchLocale}
              onMouseDown={e => e.preventDefault()}
              aria-label='switch app locale'
            >
              <Icon fontSize='1.25rem' icon={'fa6-solid:language'} />
            </IconButton>
            <IconButton
              id='theme-toggle-button'
              data-testid='theme-toggle-button'
              sx={{ position: 'absolute', top: 0, right: 36, m: 2 }}
              onClick={handleModeToggle}
              onMouseDown={e => e.preventDefault()}
              aria-label='switch mode theme'
            >
              <Icon fontSize='1.25rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
            </IconButton>
          </Card>
        </AuthIllustrationV1Wrapper>
      </Box>
      <FireworksContainer play={playFireworks} onDone={stopFireworks} dur={7000} />
    </BlankLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/dash', permanent: false } }
  }

  return {
    props: {}
  }
}

export default SignInPage
