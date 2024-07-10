import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { Fragment, SyntheticEvent, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  user: any
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = (props: Props) => {
  const { settings, user } = props
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const router = useRouter()
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string, newWindow = false) => {
    if (url) {
      if (newWindow) window.open(url, '_blank')
      else router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleSignOut = async () => {
    await router.push('/signout')
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge overlap='circular' onClick={handleDropdownOpen} sx={{ ml: 2, cursor: 'pointer' }}>
        <IconButton sx={{ width: 38, height: 38, color: 'inherit' }} aria-label='Person icon'>
          <Icon icon='akar-icons:person' fontSize='2.5rem' />
        </IconButton>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Icon style={{ color: 'inherit' }} icon='akar-icons:person' fontSize='2rem' />
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
              <Typography variant='body2'>{t(user.role)}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/user/profile')}>
          <Box sx={styles}>
            <Icon icon='tabler:user-check' />
            {t('profile')}
          </Box>
        </MenuItemStyled>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('https://github.com/younes-alturkey', true)}>
          <Box sx={styles}>
            <Icon icon='tabler:info-circle' />
            {t('faq')}
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('https://github.com/younes-alturkey', true)}>
          <Box sx={styles}>
            <Icon icon='tabler:currency-dollar' />
            {t('pricing')}
          </Box>
        </MenuItemStyled>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={handleSignOut}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            {t('sign_out')}
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
