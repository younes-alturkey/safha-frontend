import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Form, Formik } from 'formik'
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
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { getUniqueId, modeToggle, switchLocale } from 'src/@core/utils'
import { RegisterType } from 'src/api/auth'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { HTTP } from 'src/types/enums'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import * as yup from 'yup'

interface FormData {
  firstname: string
  lastname: string
  email: string
  password: string
}

interface Props {
  apiUrl: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const SignUpPage = (props: Props) => {
  const { data: session } = useSession()
  const apiUrl = props.apiUrl
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showWebsiteAlert, setShowWebsiteAlert] = useState(false)
  const websiteIdQParam = searchParams.get('websiteId')
  const [websiteId] = useState(websiteIdQParam)
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`

  const FormSchema = yup.object().shape({
    firstname: yup.string().required(`${t('field_required')}`),
    lastname: yup.string().required(`${t('field_required')}`),
    email: yup
      .string()
      .email(`${t('invalid_email')}`)
      .required(`${t('field_required')}`),
    password: yup
      .string()
      .min(8, `${t('must_be_at_least_8_characters')}`)
      .required(`${t('field_required')}`)
  })

  const initialValues = {
    firstname: 'Younes',
    lastname: 'Alturkey',
    email: 'younes@safha.com',
    password: 'safha1325'
  }

  const handleSwitchLocale = async () => {
    const currentLocale = i18n.language
    await switchLocale(settings, saveSettings, i18n)
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
  }

  const handleModeToggle = async () => {
    const mode = settings.mode
    modeToggle(settings, saveSettings)
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
  }

  const onSubmit = async (values: FormData) => {
    setSubmitting(true)
    try {
      const payload: RegisterType = {
        roles: ['admin'],
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password
      }

      const signinReq = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: '/dash'
      })

      const status = signinReq?.status

      switch (status) {
        case HTTP.OK:
          await router.push('/dash')
          toast.success(t('Welcome to Safha'))
          break
        default:
          await router.push('/signin')
          toast.error(t('account_created_but_failed_to_signin'))
      }
    } catch (error: any) {
      const err =
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors[0].message
          : error
      const errMsg = typeof err === 'string' ? err : 'something_went_wrong'
      console.error(err)
      toast.error(t(errMsg))
      setSubmitting(false)
    }
  }

  const handleCloseWebsiteAlert = () => setShowWebsiteAlert(false)

  useEffect(() => {
    if (websiteId) setShowWebsiteAlert(true)
  }, [websiteId])

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_sign_up')}</title>
      </Head>
      {websiteId && showWebsiteAlert && (
        <Alert sx={{ position: 'fixed', width: '100%', top: 0, left: 0 }} onClose={handleCloseWebsiteAlert}>
          {t('the_website_you_created_will_be_linked_to_your_account')}
        </Alert>
      )}
      <Box className='content-center' height={500}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ position: 'relative' }}>
                        <CustomTextField
                          disabled={submitting}
                          fullWidth
                          id='firstname'
                          data-testid='firstname'
                          label={t('firstname')}
                          error={formik.touched.firstname && formik.errors.firstname ? true : false}
                          sx={{ mb: 3 }}
                          placeholder={t('firstname_placeholder') as string}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.firstname}
                        />
                        <Typography
                          sx={{ position: 'absolute', top: 2, right: 8, color: 'error.main', fontSize: '0.625rem' }}
                        >
                          {formik.touched.firstname && formik.errors.firstname}
                        </Typography>
                      </Box>

                      <Box sx={{ position: 'relative' }}>
                        <CustomTextField
                          disabled={submitting}
                          fullWidth
                          id='lastname'
                          data-testid='lastname'
                          label={t('lastname')}
                          error={formik.touched.lastname && formik.errors.lastname ? true : false}
                          sx={{ mb: 3 }}
                          placeholder={t('lastname_placeholder') as string}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.lastname}
                        />
                        <Typography
                          sx={{ position: 'absolute', top: 2, right: 8, color: 'error.main', fontSize: '0.625rem' }}
                        >
                          {formik.touched.lastname && formik.errors.lastname}
                        </Typography>
                      </Box>
                    </Box>

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
                                id='toggle-password'
                                data-testid='toggle-password'
                                edge='end'
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

                    <LoadingButton
                      id='signup-button'
                      data-testid='signup-button'
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mb: 4, mt: 4 }}
                      loading={submitting}
                      disabled={!formik.values.email || !formik.values.password}
                    >
                      {t('create_account')}
                    </LoadingButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Typography component={LinkStyled} href='/signin'>
                        {t('sign_in')}
                      </Typography>
                    </Box>
                  </Form>
                )}
              </Formik>
            </CardContent>

            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0, m: 2 }}
              onClick={handleSwitchLocale}
              onMouseDown={e => e.preventDefault()}
              aria-label='switch app locale'
            >
              <Icon fontSize='1.25rem' icon={'fa6-solid:language'} />
            </IconButton>
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 36, m: 2 }}
              onClick={handleModeToggle}
              onMouseDown={e => e.preventDefault()}
              aria-label='switch app locale'
            >
              <Icon fontSize='1.25rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
            </IconButton>
          </Card>
        </AuthIllustrationV1Wrapper>
      </Box>
    </BlankLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const apiUrl = process.env.API_URL
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/dash', permanent: false } }
  }

  return {
    props: { apiUrl }
  }
}

export default SignUpPage
