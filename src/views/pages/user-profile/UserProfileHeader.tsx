import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { shortenUuid } from 'src/@core/utils'
import { ProfileHeaderType } from 'src/@fake-db/types'

interface UserProfileHeaderProps {
  user: any
}

const UserProfileHeader = (props: UserProfileHeaderProps) => {
  const [data, setData] = useState<ProfileHeaderType | null>(null)
  const bannerImg = '/grad.jpeg'
  const theme = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    axios.get('/pages/profile-header').then(response => {
      setData(response.data)
    })
  }, [])

  return data !== null ? (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={bannerImg}
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 108,
            height: 108,
            borderRadius: 1,
            backgroundColor: theme.palette.customColors.tableHeaderBg,
            [theme.breakpoints.down('md')]: {
              marginBottom: theme.spacing(4)
            },
            color: 'text.secondary'
          }}
        >
          <Icon icon='akar-icons:person' fontSize={80} />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {props.user.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='mdi:robot-love-outline' />
                <Typography sx={{ color: 'text.secondary' }}>{t(props.user.role)}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='mdi:identifier' />
                <Typography sx={{ color: 'text.secondary' }}>{shortenUuid(props.user.id)}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon={'mdi:email'} />
                <Typography sx={{ color: 'text.secondary' }}>{props.user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='material-symbols:security' />
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('expires')} {moment.unix(props.user.tokenExp).fromNow()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default UserProfileHeader
