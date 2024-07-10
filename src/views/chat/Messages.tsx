import MuiAvatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { modeToggle, switchLocale } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { setShowInfo } from 'src/store/apps/chat'
import { bucketUrl } from 'src/types/constants'
import InfoRight from 'src/views/chat/InfoRight'
import MessagesLog from 'src/views/chat/MessagesLog'
import SendMessageForm from 'src/views/chat/SendMessageForm'

interface MessagesProps {
  hidden: boolean
  smAbove: boolean
  mdAbove: boolean
  sidebarWidth: number
  apiUrl: string
}

const Messages = (props: MessagesProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const logo = `${bucketUrl}/safha-logo-512x512.png`

  const handleOpenInfo = () => dispatch(setShowInfo(true))

  const handleSwitchLocale = async () => {
    await switchLocale(settings, saveSettings, i18n)
  }

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  return (
    <Box
      sx={{
        width: 0,
        flexGrow: 1,
        height: '100%',
        backgroundColor: 'action.hover'
      }}
    >
      <Box
        sx={{
          px: 5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleOpenInfo}>
          {props.mdAbove ? null : (
            <IconButton sx={{ mr: 2 }}>
              <Icon icon='tabler:menu-2' />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Badge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              sx={{ mr: 3 }}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: 'success.main',
                    boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                    backgroundColor: 'success.main'
                  }}
                />
              }
            >
              <MuiAvatar sx={{ width: 38, height: 38 }} src={logo} alt={'Safha logo'} />
            </Badge>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6'>{t('safha_gpt')}</Typography>
              <Typography sx={{ color: 'text.disabled' }}>{t('create_in_minutes')}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            id='locale-switch-button'
            data-testid='locale-switch-button'
            onClick={handleSwitchLocale}
            onMouseDown={e => e.preventDefault()}
            aria-label='switch app locale'
          >
            <Icon fontSize='1.25rem' icon={'fa6-solid:language'} />
          </IconButton>
          <IconButton
            id='theme-toggle-button'
            data-testid='theme-toggle-button'
            onClick={handleModeToggle}
            onMouseDown={e => e.preventDefault()}
            aria-label='switch mode theme'
          >
            <Icon fontSize='1.25rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
          </IconButton>
        </Box>
      </Box>

      <MessagesLog {...props} />

      <SendMessageForm {...props} />

      <InfoRight {...props} />
    </Box>
  )
}

export default Messages
