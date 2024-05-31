import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import { GetServerSideProps } from 'next/types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import FireworksContainer from 'src/@core/components/fireworks-container'
import { useSettings } from 'src/@core/hooks/useSettings'
import { AppDispatch } from 'src/store'
import { setPlayFireworks } from 'src/store/apps/chat'
import Messages from 'src/views/chat/Messages'
import Threads from 'src/views/chat/Threads'

interface ChatPageProps {
  apiUrl: string
}

const ChatPage = (props: ChatPageProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { playFireworks } = useSelector((state: any) => state.chat)
  const theme = useTheme()
  const { t } = useTranslation()
  const { settings } = useSettings()
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const sidebarWidth = smAbove ? 360 : 300

  const stopFireworks = () => dispatch(setPlayFireworks(false))

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Head>
        <title>{t('page_title_chat')}</title>
      </Head>

      <Threads hidden={hidden} smAbove={smAbove} mdAbove={mdAbove} sidebarWidth={sidebarWidth} />

      <Messages hidden={hidden} smAbove={smAbove} mdAbove={mdAbove} sidebarWidth={sidebarWidth} apiUrl={props.apiUrl} />

      <FireworksContainer play={playFireworks} dur={7000} onDone={stopFireworks} />
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apiUrl = process.env.API_URL

  return {
    props: { apiUrl }
  }
}

export default ChatPage
