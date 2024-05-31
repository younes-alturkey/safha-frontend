import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { shortenUuid } from 'src/@core/utils'

interface Props {
  user: any
}

const AboutOverivew = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                {t('about')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  '&:not(:last-of-type)': { mb: 3 },
                  '& svg': { color: 'text.secondary' }
                }}
              >
                <Box sx={{ display: 'flex', mr: 2 }}>
                  <Icon fontSize='1.25rem' icon='mdi:robot-love-outline' />
                </Box>

                <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{t('role')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{t(props.user.role)}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  '&:not(:last-of-type)': { mb: 3 },
                  '& svg': { color: 'text.secondary' }
                }}
              >
                <Box sx={{ display: 'flex', mr: 2 }}>
                  <Icon fontSize='1.25rem' icon='akar-icons:person' />
                </Box>

                <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{t('name')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{props.user.name}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  '&:not(:last-of-type)': { mb: 3 },
                  '& svg': { color: 'text.secondary' }
                }}
              >
                <Box sx={{ display: 'flex', mr: 2 }}>
                  <Icon fontSize='1.25rem' icon='mdi:email-outline' />
                </Box>

                <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{t('email')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{props.user.email}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  '&:not(:last-of-type)': { mb: 3 },
                  '& svg': { color: 'text.secondary' }
                }}
              >
                <Box sx={{ display: 'flex', mr: 2 }}>
                  <Icon fontSize='1.25rem' icon='mdi:identifier' />
                </Box>

                <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{t('identifier')}:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{shortenUuid(props.user.id)}</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverivew
