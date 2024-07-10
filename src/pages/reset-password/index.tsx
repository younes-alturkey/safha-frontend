import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import { getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { modeToggle, switchLocale } from 'src/@core/utils'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { HTTP } from 'src/types/enums'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import * as yup from 'yup'

interface FormData {
  email: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const RestPasswordPage = () => {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const [submitting, setSubmitting] = useState(false)
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`

  const FormSchema = yup.object().shape({
    email: yup
      .string()
      .email(`${t('invalid_email')}`)
      .required(`${t('field_required')}`)
  })

  const initialValues = {
    email: ''
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
      await router.push('/signin')
      toast.success(t('instructions_sent_to_email'))
      formik.resetForm()
      setSubmitting(false)
    } catch (error: any) {
      let errorMsg = t('something_went_wrong')
      const errRes = error.response
      if (errRes.status === HTTP.NOT_FOUND) errorMsg = t('email_not_found')
      toast.error(errorMsg)
      setSubmitting(false)
    }
  }

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_reset')}</title>
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

                    <LoadingButton
                      id='submit-button'
                      data-testid='submit-button'
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mb: 4 }}
                      loading={submitting}
                      disabled={!formik.values.email || Boolean(formik.errors.email)}
                    >
                      {t('reset')}
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
              id='switch_locale_button'
              data-testid='switch_locale_button'
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

export default RestPasswordPage
