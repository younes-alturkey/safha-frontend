import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { getUniqueId, modeToggle, switchLocale } from 'src/@core/utils'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
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

interface Props {
  session: string
}

const SignOutPage = (props: Props) => {
  const { t, i18n } = useTranslation()
  const session = JSON.parse(props.session)
  const user = session?.user
  const { settings, saveSettings } = useSettings()
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`
  const illustration = `/sofa.png`

  const handleSignOut = async () => {
    await signOut()
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

  useEffect(() => {
    if (user) handleSignOut()
    else toast.success(t('you_are_signed_out'))
  }, [])

  return (
    <BlankLayout>
      <Box className='content-center'>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            <Typography variant='h2' sx={{ mb: 4 }} className={user ? 'animate-pulse' : ''}>
              {user ? `${t('signing_out')}...` : `${t('you_are_signed_out')}!`}
            </Typography>
            {!user && (
              <Button href='/signin' component={Link} variant='contained'>
                {t('sign_in')}
              </Button>
            )}
          </BoxWrapper>
          <Img height='500' alt='illustration' src={illustration} />
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const sessionStr = await getServerSession(context.req, context.res, authOptions)
  const session = JSON.stringify(sessionStr)

  return {
    props: { session }
  }
}

export default SignOutPage
