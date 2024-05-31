import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import Sidebar from 'src/@core/components/sidebar'
import { AppDispatch } from 'src/store'
import { setPrompt, setShowSettings } from 'src/store/apps/chat'

const ScrollWrapper = ({ hidden, children }: { hidden: boolean; children: ReactNode }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }
}

interface ThreadsLeftProps {
  hidden: boolean
  smAbove: boolean
  mdAbove: boolean
  sidebarWidth: number
}

const ThreadsLeft = (props: ThreadsLeftProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { showSettings, prompt } = useSelector((state: any) => state.chat)
  const { t } = useTranslation()

  const closeSettings = () => dispatch(setShowSettings(false))

  return (
    <Sidebar
      show={showSettings}
      backDropClick={closeSettings}
      sx={{
        zIndex: 9,
        height: '100%',
        width: props.sidebarWidth,
        borderTopLeftRadius: theme => theme.shape.borderRadius,
        borderBottomLeftRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      <Box sx={{ height: '100%' }}>
        <ScrollWrapper hidden={props.hidden}>
          <Box sx={{ p: 4, height: '100%' }}>
            <Box sx={{ mb: 3.5, width: '100%' }} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography
                variant='body2'
                sx={{ color: 'text.disabled', textTransform: 'uppercase', lineHeight: 'normal' }}
              >
                {t('edit_instructions')}
              </Typography>
              <IconButton size='small' onClick={closeSettings} sx={{ color: 'text.disabled' }}>
                <Icon icon='tabler:x' />
              </IconButton>
            </Box>
            <TextField
              value={prompt}
              onChange={e => dispatch(setPrompt(e.target.value))}
              sx={{
                border: 0,
                outline: 0,
                overflow: 'auto',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none'
                }
              }}
              multiline
              fullWidth
              placeholder={`${t('extra_instructions_placeholder')}`}
            />
          </Box>
        </ScrollWrapper>
      </Box>
    </Sidebar>
  )
}

export default ThreadsLeft
