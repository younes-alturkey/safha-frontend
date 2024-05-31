import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const WebsiteWizardsHeader = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ mb: [10, 17.5], textAlign: 'center' }}>
      <Typography variant='h2'>{t('safha_gpt')}</Typography>
      <Box sx={{ mt: 2.5, mb: 10.75 }}>
        <Typography sx={{ color: 'text.secondary' }}>{t('safha_gpt_description')}</Typography>
      </Box>
    </Box>
  )
}

export default WebsiteWizardsHeader
