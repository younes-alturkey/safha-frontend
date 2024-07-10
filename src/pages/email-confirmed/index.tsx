import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next/types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import FireworksContainer from 'src/@core/components/fireworks-container'
import BlankLayout from 'src/@core/layouts/BlankLayout'
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

const EmailConfirmed = () => {
  const { t } = useTranslation()
  const [playFireworks, setPlayFireworks] = useState(false)
  const illustration = `/ohh.png`

  const stopFireworks = () => setPlayFireworks(false)

  const playConfirmedCelebration = async () => {
    toast.success(t('thanks_for_activating_email'), {
      duration: 7500
    })
    setPlayFireworks(true)
  }

  useEffect(() => {
    playConfirmedCelebration()
  }, [])

  return (
    <BlankLayout>
      <Head>
        <title>{t('page_title_email_confirmed')}</title>
      </Head>
      <Box className='content-center'>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            <Typography variant='h2' sx={{ mb: 4 }}>
              {t('nice_email_is_confirmed')}
            </Typography>
            <Button href='/' component={Link} variant='contained'>
              {t('access_safha')}
            </Button>
          </BoxWrapper>
          <Img height='500' alt='confirmed-illustration' src={illustration} />
        </Box>
        <FooterIllustrations />
      </Box>
      <FireworksContainer play={playFireworks} onDone={stopFireworks} dur={7000} />
    </BlankLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  }
}

export default EmailConfirmed
