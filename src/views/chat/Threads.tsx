import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useSettings } from 'src/@core/hooks/useSettings'
import { removeHttp } from 'src/@core/utils'
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AppDispatch } from 'src/store'
import { createNewThread, getAssistantMessages, setShowSettings, setThread } from 'src/store/apps/chat'
import ThreadsLeft from 'src/views/chat/ThreadsLeft'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

interface ThreadsProps {
  hidden: boolean
  smAbove: boolean
  mdAbove: boolean
  sidebarWidth: number
}

const Threads = (props: ThreadsProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { threads, thread, loading, locked } = useSelector((state: any) => state.chat)
  const { t } = useTranslation()
  const { settings } = useSettings()
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`

  const handleOpenSettings = () => dispatch(setShowSettings(true))

  const handleCreateThread = async () => {
    try {
      const newThreadOp = await dispatch(createNewThread())
      if (newThreadOp.meta.requestStatus === 'fulfilled') {
        const newThread = newThreadOp.payload
        await dispatch(getAssistantMessages({ thread: newThread }))
        dispatch(setThread(newThread))
      } else throw new Error(newThreadOp.payload as string)
    } catch (err) {
      console.error(err)
      toast.error(t('something_went_wrong'))
    }
  }

  const handleSetThread = async (thread: any) => {
    await dispatch(getAssistantMessages({ thread }))
    dispatch(setThread(thread))
  }

  const renderThreads = () =>
    threads.map((tead: any, index: number) => {
      const isActive = tead.id === thread.id

      return (
        <ListItem
          key={index}
          disablePadding
          sx={{ '&:not(:last-child)': { mb: 1 } }}
          onClick={() => {
            if (!tead.url && !isActive) handleSetThread(tead)
          }}
        >
          <ListItemButton
            LinkComponent={tead.url ? Link : 'button'}
            href={tead.url}
            target='_blank'
            disableRipple
            sx={{
              py: 2,
              px: 3,
              width: '100%',
              borderRadius: 1,
              alignItems: 'flex-start',
              background: theme =>
                tead.url
                  ? `linear-gradient(72.47deg, ${
                      isDark ? theme.palette.customColors.trackBg : theme.palette.green[50]
                    } 22.16%, ${hexToRGBA(
                      isDark ? theme.palette.customColors.trackBg : theme.palette.green[50],
                      0.7
                    )} 76.47%) !important`
                  : `linear-gradient(72.47deg, ${
                      isDark ? theme.palette.customColors.trackBg : theme.palette.orange[50]
                    } 22.16%, ${hexToRGBA(
                      isDark ? theme.palette.customColors.trackBg : theme.palette.orange[50],
                      0.7
                    )} 76.47%) !important`,
              '&.MuiListItemButton-root:hover': theme => ({
                background: tead.url
                  ? `linear-gradient(72.47deg, ${
                      isDark
                        ? theme.palette.customColors.darkPaperBg
                        : isActive
                        ? theme.palette.green[50]
                        : theme.palette.green[100]
                    } 22.16%, ${hexToRGBA(
                      isDark
                        ? theme.palette.customColors.darkPaperBg
                        : isActive
                        ? theme.palette.green[50]
                        : theme.palette.green[100],
                      0.7
                    )} 76.47%) !important`
                  : `linear-gradient(72.47deg, ${
                      isDark
                        ? isActive
                          ? theme.palette.customColors.trackBg
                          : theme.palette.customColors.avatarBg
                        : isActive
                        ? theme.palette.orange[50]
                        : theme.palette.orange[100]
                    } 22.16%, ${hexToRGBA(
                      isDark
                        ? isActive
                          ? theme.palette.customColors.trackBg
                          : theme.palette.customColors.avatarBg
                        : isActive
                        ? theme.palette.orange[50]
                        : theme.palette.orange[100],
                      0.7
                    )} 76.47%) !important`
              }),
              cursor: isActive && !tead.url ? 'default' : 'pointer'
            }}
          >
            <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
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
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      color: 'success.main',
                      backgroundColor: tead.url ? 'success.main' : 'warning.main',
                      boxShadow: theme =>
                        `0 0 0 2px ${tead.url ? theme.palette.background.paper : theme.palette.common.white}`
                    }}
                  />
                }
              >
                <CustomAvatar
                  color={tead.url ? 'success' : 'warning'}
                  skin={tead.url ? 'light-static' : 'light'}
                  sx={{
                    width: 38,
                    height: 38,
                    fontSize: theme => theme.typography.body1.fontSize,
                    outline: theme => `2px solid ${tead.url ? theme.palette.common.white : 'transparent'}`
                  }}
                >
                  {getInitials('Safha GPT')}
                </CustomAvatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              sx={{
                my: 0,
                ml: 3,
                mr: 1.5,
                '& .MuiTypography-root': { ...(tead.url && { color: isDark ? 'common.white' : 'text.secondary' }) }
              }}
              primary={
                <Typography noWrap variant='caption' sx={{ fontWeight: 'bold' }}>
                  {tead.url
                    ? removeHttp(tead.url)
                    : tead.status === 'generating'
                    ? t('website_is_being_generated')
                    : tead.status === 'requirements'
                    ? t('collecting_website_requirements')
                    : t('unknown_status')}
                </Typography>
              }
              secondary={
                <Typography noWrap variant='body2' sx={{ ...(tead.url && { color: 'text.secondary' }) }}>
                  {tead.id}
                </Typography>
              }
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <Typography
                variant='caption'
                sx={{ whiteSpace: 'nowrap', color: tead.url ? 'common.white' : 'text.disabled' }}
              >
                {moment.unix(tead.createdAt).format('MMMM Do')}
              </Typography>
              <Chip
                className={isActive ? 'visible' : 'invisible'}
                color='primary'
                label={t('active')}
                sx={{
                  mt: 0.5,
                  height: 18,
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { py: 0.25, px: 1.655 }
                }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      )
    })

  return (
    <div>
      <Drawer
        variant={props.mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: props.mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: props.sidebarWidth,
            position: props.mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            height: 64,
            py: 3,
            px: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Link href='/'>
            <Image src={logo} alt='Safha Logo' width={68} height={34} style={{ opacity: 0.7 }} />
          </Link>
          <IconButton disabled={loading || locked} onClick={handleOpenSettings} sx={{ color: 'text.disabled' }}>
            <Icon icon='material-symbols:expand-content-rounded' />
          </IconButton>
        </Box>

        <Box sx={{ height: `calc(100% - 4.0625rem)` }}>
          <ScrollWrapper hidden={props.hidden}>
            <Box sx={{ p: theme => theme.spacing(5, 5, 3) }}>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='h5' sx={{ ml: 0, mb: 0, color: 'secondary.main' }}>
                  {t('threads')}
                </Typography>
                <IconButton color='secondary' disabled={loading} onClick={handleCreateThread}>
                  <Icon icon='material-symbols:add' />
                </IconButton>
              </Box>
              <List sx={{ mb: 5, p: 0 }}>{renderThreads()}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

      <ThreadsLeft {...props} />
    </div>
  )
}

export default Threads
