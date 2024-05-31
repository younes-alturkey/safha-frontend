import Box from '@mui/material/Box'
import { styled, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { getAppRelease } from 'src/@core/utils'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.text.secondary} !important`,
  '&:hover': {
    color: `${theme.palette.primary.main} !important`
  }
}))

const FooterContent = () => {
  const { t } = useTranslation()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ opacity: '25%' }}>{`${t('release')} — ${getAppRelease()}`}</Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Typography target='_blank' component={LinkStyled} href='https://status.safha.com'>
            {t('system_status')}
          </Typography>
          <Typography target='_blank' component={LinkStyled} href={t('terms_of_service_url')}>
            {t('terms_of_service')}
          </Typography>
          <Typography target='_blank' component={LinkStyled} href={t('privacy_policy_url')}>
            {t('privacy_policy')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
