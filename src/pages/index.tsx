import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import moment from 'moment'
import { getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { modeToggle, removeQueryParams, switchLocale } from 'src/@core/utils'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import WebsiteWizards from 'src/views/pages/website-wizards/WebsiteWizards'
import WebsiteWizardsHeader from 'src/views/pages/website-wizards/WebsiteWizardsHeader'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(20)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(10, 5)} !important`
  }
}))

interface SafhaGPTProps {
  session: string
  apiUrl: string
}

const SafhaGPT = (props: SafhaGPTProps) => {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const searchParams = useSearchParams()
  const langQParam = searchParams.get('lang')
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`

  const handleSwitchLocale = async () => {
    await switchLocale(settings, saveSettings, i18n)
  }

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  const options = [
    {
      imgWidth: 140,
      imgHeight: 140,
      title: t('safha_gpt_chat'),
      popularPlan: false,
      currentPlan: false,
      subtitle: t('safha_gpt_chat_description'),
      imgSrc: `/happy.png`,
      urlText: t('safha_gpt_chat_to_website'),
      url: '/chat'
    },
    {
      imgWidth: 140,
      imgHeight: 140,
      title: t('safha_gpt_wizard'),
      currentPlan: true,
      popularPlan: true,
      subtitle: t('safha_gpt_wizard_description'),
      imgSrc: `/smile.png`,
      urlText: t('safha_gpt_wizard_to_website'),
      url: '/wizard'
    }
  ]

  const handleSetLocale = async (lang: string) => {
    const language = lang.toLowerCase() === 'en' ? 'en' : 'ar'
    const direction = language === 'ar' ? 'rtl' : 'ltr'
    i18n.changeLanguage(language)
    moment.locale(language)
    saveSettings({ ...settings, direction: direction, language: language })
    removeQueryParams(router)
  }

  useEffect(() => {
    if (langQParam) handleSetLocale(langQParam)
  }, [])

  return (
    <Card sx={{ minHeight: '100vh' }}>
      <Head>
        <title>{t('page_title_safha')}</title>
      </Head>
      <CardContent>
        <WebsiteWizardsHeader />
        <WebsiteWizards options={options} />
        {props.session ? (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 24 }}>
            <Typography component={LinkStyled} href='/dash'>
              {t('go_to_dashboard')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 24 }}>
            <Typography component={LinkStyled} href='/signup'>
              {t('create_account')}
            </Typography>
          </Box>
        )}
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
      <Box sx={{ position: 'absolute', top: 0, left: 0, m: 2, opacity: 0.7 }}>
        <Link href='/'>
          <Image src={logo} alt='Safha Logo' width={68} height={34} style={{ opacity: isDark ? '70%' : '100%' }} />
        </Link>
      </Box>
    </Card>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let session = null
  const sessionData = await getServerSession(context.req, context.res, authOptions)
  if (sessionData) session = JSON.stringify(sessionData)

  return {
    props: {
      session
    }
  }
}

export default SafhaGPT
