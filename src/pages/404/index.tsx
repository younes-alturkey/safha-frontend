import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { modeToggle, switchLocale } from 'src/@core/utils'
import { bucketUrl } from 'src/types/constants'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

const NotFound = () => {
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`
  const illustration = `${bucketUrl}/under-work-illustration.png`

  const handleSwitchLocale = async () => {
    await switchLocale(settings, saveSettings, i18n)
  }

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_notfound')}</title>
      </Head>
      <Box className='content-center'>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            <Typography variant='h2' sx={{ mb: 4 }}>
              {t('oops_page_not_found')}
            </Typography>
            <Button href='/' component={Link} variant='contained'>
              {t('back_home')}
            </Button>
          </BoxWrapper>
          <Img height='500' alt='error-illustration' src={illustration} />
        </Box>
        <FooterIllustrations />
      </Box>
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
    </BlankLayout>
  )
}

export default NotFound
