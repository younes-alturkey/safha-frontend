import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import { getServerSession } from 'next-auth'
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
import { modeToggle, switchLocale } from 'src/@core/utils'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import * as yup from 'yup'

interface FormData {
  password: string
  confirmPassword: string
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const NewPasswordPage = () => {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const searchParams = useSearchParams()
  const { settings, saveSettings } = useSettings()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const emailQParam = searchParams.get('userEmail')
  const tokenQParam = searchParams.get('token')
  const [email] = useState(emailQParam)
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`

  const FormSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, `${t('must_be_at_least_8_characters')}`)
      .required(`${t('field_required')}`),
    confirmPassword: yup
      .string()
      .required(`${t('field_required')}`)
      .oneOf([yup.ref('password')], `${t('password_match_error')}`)
  })

  const initialValues = {
    password: '',
    confirmPassword: ''
  }

  const handleSwitchLocale = async () => {
    await switchLocale(settings, saveSettings, i18n)
  }

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  const onSubmit = async (values: FormData, formik: FormikHelpers<FormData>) => {
    setSubmitting(true)
    try {
      toast.success(t('password_reset_successful'))
      await router.push({
        pathname: '/signin',
        query: {
          email: email
        }
      })
      formik.resetForm()
    } catch (error) {
      console.error(error)
      toast.error(t('something_went_wrong'))
      setSubmitting(false)
    }
  }

  const notifyUser = async () => {
    toast(t('set_your_new_password'), { duration: 7500 })
  }

  useEffect(() => {
    if (emailQParam || tokenQParam) notifyUser()
  }, [])

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_new')}</title>
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
                        sx={{ mb: 3 }}
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

                    <Box sx={{ position: 'relative' }}>
                      <CustomTextField
                        disabled={submitting}
                        fullWidth
                        sx={{ mb: 1.5 }}
                        label={t('confirm_password')}
                        error={formik.touched.confirmPassword && formik.errors.confirmPassword ? true : false}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        id='confirmPassword'
                        data-testid='confirmPassword'
                        placeholder='············'
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Typography
                        sx={{ position: 'absolute', top: 2, right: 8, color: 'error.main', fontSize: '0.625rem' }}
                      >
                        {formik.touched.confirmPassword && formik.errors.confirmPassword}
                      </Typography>
                    </Box>

                    <LoadingButton
                      id='submit-button'
                      data-testid='submit-button'
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mb: 4, mt: 4 }}
                      loading={submitting}
                      disabled={
                        !formik.values.password ||
                        !formik.values.confirmPassword ||
                        Boolean(formik.errors.password) ||
                        Boolean(formik.errors.confirmPassword)
                      }
                    >
                      {t('apply')}
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
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return {
    props: {}
  }
}

export default NewPasswordPage
