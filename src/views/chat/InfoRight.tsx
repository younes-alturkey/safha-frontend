import MuiAvatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { Fragment, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import Sidebar from 'src/@core/components/sidebar'
import { AppDispatch } from 'src/store'
import { setShowInfo } from 'src/store/apps/chat'
import { bucketUrl } from 'src/types/constants'

interface InfoRightProps {
  hidden: boolean
  smAbove: boolean
  mdAbove: boolean
  sidebarWidth: number
}

const InfoRight = (props: InfoRightProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { showInfo } = useSelector((state: any) => state.chat)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const logo = `${bucketUrl}/safha-logo-512x512.png`

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (props.hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  const closeInfo = () => dispatch(setShowInfo(false))

  return (
    <Sidebar
      direction='right'
      show={showInfo}
      backDropClick={closeInfo}
      sx={{
        zIndex: 9,
        height: '100%',
        width: props.sidebarWidth,
        borderTopRightRadius: theme => theme.shape.borderRadius,
        borderBottomRightRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      <Fragment>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            size='small'
            onClick={closeInfo}
            sx={{ top: '0.5rem', right: '0.5rem', position: 'absolute', color: 'text.disabled' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: theme => theme.spacing(11.25, 6, 4.5) }}>
            <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'center' }}>
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      color: 'success.main',
                      boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                      backgroundColor: 'success.main'
                    }}
                  />
                }
              >
                <MuiAvatar sx={{ width: '5rem', height: '5rem' }} src={logo} alt={'Safha logo'} />
              </Badge>
            </Box>
            <Typography variant='h5' sx={{ textAlign: 'center' }}>
              {t('safha')}
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>{t('safha_gpt')}</Typography>
          </Box>
        </Box>

        <Box sx={{ height: 'calc(100% - 13.3125rem)' }}>
          <ScrollWrapper>
            <Box sx={{ p: 6 }}>
              <FormGroup sx={{ mb: 6.5 }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase', lineHeight: 'normal' }}
                >
                  {t('about')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{t('about_safha')}</Typography>
              </FormGroup>

              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase', lineHeight: 'normal' }}
                >
                  {t('contact_info')}
                </Typography>
                <List dense sx={{ p: 0 }}>
                  <ListItem sx={{ px: 2 }}>
                    <ListItemIcon sx={{ mr: 2 }}>
                      <Icon icon='tabler:mail' fontSize='1.5rem' />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ textTransform: 'lowercase' }}
                      primaryTypographyProps={{ variant: 'body1' }}
                      primary='info@safha.com'
                    />
                  </ListItem>
                </List>
              </Box>

              <div>
                <Typography
                  variant='body2'
                  sx={{ mb: 3.5, color: 'text.disabled', textTransform: 'uppercase', lineHeight: 'normal' }}
                >
                  {t('options')}
                </Typography>
                <List
                  dense
                  sx={{
                    p: 0,
                    '& .MuiListItemButton-root:hover': {
                      backgroundColor: 'action.hover',
                      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: 'inherit'
                      }
                    }
                  }}
                >
                  <ListItem
                    disablePadding
                    component={Link}
                    target='_blank'
                    href={`https://help.safha.com/${isAr ? 'ar' : 'en'}`}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemButton sx={{ p: 2, borderRadius: 1 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='mdi:help-outline' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText primary={t('help_center')} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    component={Link}
                    target='_blank'
                    href='https://feedback.safha.com/boards/issues'
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                    className='nav-link'
                  >
                    <ListItemButton sx={{ p: 2, borderRadius: 1 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='ph:bug-light' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText primary={t('report_issue')} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    component={Link}
                    target='_blank'
                    href='https://feedback.safha.com/boards/ideas'
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemButton sx={{ p: 2, borderRadius: 1 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='fluent:emoji-add-24-regular' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText primary={t('request_feature')} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    component={Link}
                    target='_blank'
                    href='https://discord.gg/JEcScVtXfp'
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItemButton sx={{ p: 2, borderRadius: 1 }}>
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Icon icon='radix-icons:discord-logo' fontSize='1.5rem' />
                      </ListItemIcon>
                      <ListItemText primary={t('safha_community')} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </div>
            </Box>
          </ScrollWrapper>
        </Box>
      </Fragment>
    </Sidebar>
  )
}

export default InfoRight
