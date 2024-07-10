import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { ReactNode, Ref, useEffect, useRef } from 'react'
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import MarkdownRenderer from 'src/@core/components/markdown-container'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { sortArr } from 'src/@core/utils'
import WebsiteLiveMessage from 'src/views/chat/WebsiteLiveMessage'

interface MsgProps {
  msg: any
}

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

interface MessagesLogProps {
  hidden: boolean
  smAbove: boolean
  mdAbove: boolean
  sidebarWidth: number
}

const MessagesLog = (props: MessagesLogProps) => {
  const { messages, live, thread } = useSelector((state: any) => state.chat)
  const chatArea = useRef(null)
  const logo = '/logo.png'

  const scrollToBottom = () => {
    if (chatArea.current) {
      if (props.hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = chatArea.current.scrollHeight
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = chatArea.current._container.scrollHeight
      }
    }
  }

  const AssistantMessage = (props: MsgProps) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mb: 4
      }}
    >
      <CustomAvatar
        src={logo}
        alt={'Safha logo'}
        skin='light'
        color='primary'
        sx={{
          width: 32,
          height: 32,
          ml: undefined,
          mr: 3,
          fontSize: theme => theme.typography.body1.fontSize
        }}
      />

      <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
        <Box sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
          <Box
            sx={{
              boxShadow: 1,
              borderRadius: 1,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(1, 4),
              ml: undefined,
              borderTopLeftRadius: 0,
              borderTopRightRadius: undefined,
              color: 'text.primary',
              backgroundColor: 'background.paper'
            }}
          >
            <MarkdownRenderer>{props.msg.content[0].text.value}</MarkdownRenderer>
          </Box>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {moment.unix(props.msg.created_at).fromNow()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  const UserMessage = (props: MsgProps) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        mb: 4
      }}
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          padding: 2,
          marginTop: 1,
          width: 32,
          height: 32,
          ml: 3,
          fontSize: theme => theme.typography.body1.fontSize,
          borderRadius: '999px',
          backgroundColor: 'customColors.avatarBg'
        }}
      >
        <Icon icon='akar-icons:person' fontSize='1.7rem' />
      </Box>

      <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
        <Box sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
          <Box
            sx={{
              boxShadow: 1,
              borderRadius: 1,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(1, 4),
              ml: 'auto',
              borderTopLeftRadius: undefined,
              borderTopRightRadius: 0,
              color: 'common.black',
              backgroundColor: 'primary.main'
            }}
          >
            <MarkdownRenderer>{props.msg.content[0].text.value}</MarkdownRenderer>
          </Box>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {moment.unix(props.msg.created_at).fromNow()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (props.hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  useEffect(() => scrollToBottom())

  return (
    <Box sx={{ height: 'calc(100% - 8.875rem)' }}>
      <ScrollWrapper>
        {sortArr(messages).map((msg: any) => {
          const isModel = msg.role === 'assistant'

          return isModel ? <AssistantMessage key={msg.id} msg={msg} /> : <UserMessage key={msg.id} msg={msg} />
        })}
        {thread && live && live.threadId === thread.id && <WebsiteLiveMessage title={live.title} url={live.url} />}
      </ScrollWrapper>
    </Box>
  )
}

export default MessagesLog
